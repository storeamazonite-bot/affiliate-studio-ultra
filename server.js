import fetch from "node-fetch";
import http from "node:http";import fs from "node:fs";import path from "node:path";import {fileURLToPath} from "node:url";import {spawn} from "node:child_process";import ffmpegPath from "ffmpeg-static";import {buildImagePrompt,buildVideoBrief,normalizeCreativeInput} from "./ai-creative.mjs";
const root=path.dirname(fileURLToPath(import.meta.url)),port=Number(process.env.PORT||3000),mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8"};
function send(res,s,t,b){res.writeHead(s,{"Content-Type":t});res.end(b)}
async function ai(b){const key=b.openaiApiKey||process.env.OPENAI_API_KEY,model=b.openaiModel||process.env.OPENAI_MODEL||"gpt-5.5";if(!key||!model)return null;const prompt=`Create premium English-first affiliate marketing copy. Product: ${b.n}. Market: ${b.m}. Affiliate URL: ${b.u}. Description: ${b.d}. Output type: ${b.tab}. Do not invent specifications, prices, guarantees, reviews, certifications, shipping claims or performance figures. Keep the affiliate URL exactly as supplied.`;const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model,input:prompt})});if(!r.ok)return null;const j=await r.json();return j.output_text||null}
async function generateImage(body){
  const key=body.openaiApiKey||process.env.OPENAI_API_KEY;
  const model=process.env.OPENAI_IMAGE_MODEL||"gpt-image-2";
  if(!key)throw Error("OPENAI_API_KEY is not configured");
  const p=normalizeCreativeInput(body);
  const prompt=buildImagePrompt({...p,style:body.style,ratio:body.ratio});
  const content=[{type:"input_text",text:prompt}];
  if(body.imageData)content.push({type:"input_image",image_url:body.imageData});
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5.5",input:[{role:"user",content}],tools:[{type:"image_generation",model,action:"edit",size:"1024x1536",quality:"high",output_format:"png"}],tool_choice:{type:"image_generation"}})});
  const j=await r.json();
  if(!r.ok)throw Error(j?.error?.message||"Image generation failed");
  const call=j.output?.find(x=>x.type==="image_generation_call");
  if(!call?.result)throw Error("Image generation returned no image");
  return {imageData:`data:image/png;base64,${call.result}`,prompt};
}

async function generateVideo(body){
  const key=body.runwayApiSecret||process.env.RUNWAYML_API_SECRET;
  if(!key)throw Error("RUNWAYML_API_SECRET is not configured");
  const p=normalizeCreativeInput(body);
  const seconds=Math.max(4,Math.min(15,Number(body.durationSec)||15));
  const userConcept=buildVideoBrief({...p,durationSec:seconds});
  const r=await fetch("https://api.dev.runwayml.com/v1/recipes/product_ad",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`,"X-Runway-Version":"2024-11-06"},body:JSON.stringify({version:"2026-07",productImages:[{uri:body.imageData}],ratio:"720:1280",audio:true,productInfo:`${p.product}. ${p.description}`,userConcept,duration:seconds})});
  const j=await r.json();
  if(!r.ok)throw Error(j?.error||j?.message||"Video generation failed");
  return {taskId:j.id,durationSec:seconds,affiliateUrl:p.affiliateUrl};
}

async function videoStatus(id,requestSecret=""){
  const key=requestSecret||process.env.RUNWAYML_API_SECRET;
  if(!key)throw Error("RUNWAYML_API_SECRET is not configured");
  const r=await fetch(`https://api.dev.runwayml.com/v1/tasks/${encodeURIComponent(id)}`,{headers:{"Authorization":`Bearer ${key}`,"X-Runway-Version":"2024-11-06"}});
  const j=await r.json();
  if(!r.ok)throw Error(j?.error||j?.message||"Task lookup failed");
  return j;
}

const server=http.createServer(async(req,res)=>{if(req.method==="POST"&&req.url==="/api/convert-mp4"){try{let raw="";for await(const chunk of req)raw+=chunk;const body=JSON.parse(raw);if(!body.videoBase64)throw Error("Missing video");const input=Buffer.from(body.videoBase64.split(",").pop(),"base64");const ffmpegPath=process.env.FFMPEG_PATH||"ffmpeg";const args=["-hide_banner","-loglevel","error","-i","pipe:0","-c:v","libx264","-preset","veryfast","-pix_fmt","yuv420p","-movflags","frag_keyframe+empty_moov","-c:a","aac","-b:a","192k","-shortest","-f","mp4","pipe:1"];const child=spawn(ffmpegPath,args);const chunks=[];let err="";child.stdout.on("data",d=>chunks.push(d));child.stderr.on("data",d=>err+=d);child.on("error",e=>send(res,500,"application/json",JSON.stringify({error:e.message})));child.on("close",code=>{if(code!==0){send(res,500,"application/json",JSON.stringify({error:err||"MP4 conversion failed"}));return}send(res,200,"video/mp4",Buffer.concat(chunks))});child.stdin.end(input)}catch(e){send(res,400,"application/json",JSON.stringify({error:e.message}))}return}if(req.method==="POST"&&req.url==="/api/generate-image"){
try{let raw="";for await(const c of req)raw+=c;const out=await generateImage(JSON.parse(raw));send(res,200,"application/json",JSON.stringify(out))}catch(e){send(res,500,"application/json",JSON.stringify({error:e.message}))}return}
if(req.method==="POST"&&req.url==="/api/generate-video"){
try{let raw="";for await(const c of req)raw+=c;const out=await generateVideo(JSON.parse(raw));send(res,200,"application/json",JSON.stringify(out))}catch(e){send(res,500,"application/json",JSON.stringify({error:e.message}))}return}
if(req.method==="GET"&&req.url.startsWith("/api/video-download/")){try{const id=decodeURIComponent(req.url.split("/").pop());const task=await videoStatus(id,req.headers["x-runway-api-secret"]);const url=task.output?.[0];if(task.status!=="SUCCEEDED"||!url)throw Error("Video is not ready.");const r=await fetch(url);if(!r.ok)throw Error("Provider download failed.");res.writeHead(200,{"Content-Type":r.headers.get("content-type")||"video/mp4","Content-Disposition":`attachment; filename="affiliai-ultra-ai-video.mp4"`});for await(const chunk of r.body)res.write(chunk);res.end()}catch(e){send(res,500,"application/json",JSON.stringify({error:e.message}))}return}if(req.method==="GET"&&req.url.startsWith("/api/video-status/")){
try{const id=decodeURIComponent(req.url.split("/").pop());const out=await videoStatus(id,req.headers["x-runway-api-secret"]);send(res,200,"application/json",JSON.stringify(out))}catch(e){send(res,500,"application/json",JSON.stringify({error:e.message}))}return}
if(req.method==="POST"&&req.url==="/api/generate"){try{let raw="";for await(const c of req)raw+=c;const out=await ai(JSON.parse(raw));send(res,200,"application/json",JSON.stringify({output:out}))}catch(e){send(res,500,"application/json",JSON.stringify({error:"Generation failed"}))}return}const requested=req.url==="/"?"index.html":req.url.replace(/^\//,"");const file=path.join(root,requested);if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){send(res,404,"text/plain; charset=utf-8","Not found");return}send(res,200,mime[path.extname(file)]||"application/octet-stream",fs.readFileSync(file))});server.listen(port,()=>console.log(`AffiliAI Ultra running at http://localhost:${port}`));