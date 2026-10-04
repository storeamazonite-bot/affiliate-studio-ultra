import {createVideoTimeline} from "./video-engine.mjs";

const state={tab:"landing",imageData:"",videoBlob:null,videoUrl:""};const $=id=>document.getElementById(id);

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.tab=b.dataset.tab;$( "visual").classList.toggle("hidden",state.tab!=="image");updateTitle()});

$("imageInput").onchange=e=>{const f=e.target.files?.[0];if(!f)return;$("imageName").textContent=f.name;const r=new FileReader();r.onload=()=>{$("previewImg").src=r.result;$("visualImg").src=r.result;state.imageData=r.result;$("preview").classList.remove("hidden");$("visual").classList.toggle("hidden",state.tab!=="image");resetVideo()};r.readAsDataURL(f)};

$("generateBtn").onclick=generate;
$("copyBtn").onclick=async()=>{await navigator.clipboard.writeText($("output").value);$("notice").textContent="Copied to clipboard."};
$("downloadBtn").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([$("output").value],{type:"text/plain"}));a.download="affiliate-campaign.txt";a.click();URL.revokeObjectURL(a.href)};
$("videoBtn").onclick=buildVideo;\n$("convertMp4Btn").onclick=convertMp4;
$("downloadVideoBtn").onclick=downloadVideo;

function data(){return{n:$("productName").value.trim()||"Smart Home Security Product",u:$("affiliateUrl").value.trim()||"[INSERT AFFILIATE LINK]",d:$("description").value.trim()||"Modern security technology designed to support a safer, more connected home.",m:$("market").value,c:$("channel").value}}

function updateTitle(){const x={landing:"Premium Landing Page",tiktok:"TikTok • 9:16",facebook:"Facebook Campaign",pinterest:"Pinterest Pin",image:"Marketing Image"};$("outputTitle").textContent=x[state.tab]}

async function generate(){const p=data();$("mode").textContent="GENERATING";$("notice").textContent="Building your premium campaign…";if(state.tab==="image"){imageCopy(p);$("mode").textContent="VISUAL MODE";$("notice").textContent=state.imageData?"Real product image loaded into the creative workspace.":"Upload a real product image to build the visual.";return}try{const r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...p,tab:state.tab})});const j=await r.json();if(!r.ok||!j.output)throw Error();$("output").value=j.output;$("mode").textContent="AI MODE";$("notice").textContent="Campaign generated."}catch(e){$("output").value=local(p);$("mode").textContent="LOCAL MODE";$("notice").textContent="Local generator used. Connect an AI provider for richer generation."}updateTitle()}

function imageCopy(p){$("output").value=`MARKETING IMAGE CREATIVE

PRODUCT
${p.n}

HEADLINE
Smarter Security. Better Decisions.

SUBHEAD
Modern home protection, presented with a premium visual style.

CTA
Discover Product

AFFILIATE URL
${p.u}

FORMAT OPTIONS
• TikTok / Reels: 9:16
• Facebook: 1:1 or 4:5
• Pinterest: 2:3

Use the uploaded real product image. Do not alter product identity or invent features.`}

function local(p){if(state.tab==="landing")return`HEADLINE
Smarter Security. Greater Peace of Mind.

PRODUCT
${p.n}

POSITIONING
Discover a practical security upgrade for your home, built around modern features and everyday confidence.

PRODUCT MESSAGE
${p.d}

CTA
Discover Product → ${p.u}

MARKET
${p.m}

AFFILIATE DISCLOSURE
This content may contain affiliate links. We may earn a commission from qualifying purchases.`;if(state.tab==="tiktok")return videoBrief(p);if(state.tab==="facebook")return`FACEBOOK POST

Your home deserves smarter protection.

Meet ${p.n} — a modern home-security option designed around convenience, awareness and peace of mind.

${p.d}

Discover Product → ${p.u}

#HomeSecurity #SmartHome #HomeProtection`;return`PINTEREST PIN

${p.n}

Smart home security inspiration for a safer, more connected home.

${p.d}

Discover Product → ${p.u}

Keywords: home security, smart home, security technology, home protection`}

function videoBrief(p){return`TIKTOK 9:16 VIDEO BRIEF

HOOK (0–3s)
“Could your home security be smarter?”

SCENE 1 (3–7s)
Show the real product image with a clean premium zoom.

SCENE 2 (7–13s)
Highlight: ${p.d}

SCENE 3 (13–18s)
Show the product in a modern home-security context with concise benefit text.

CTA (18–22s)
“Discover the product — link in bio.”

CAPTION
Upgrade the way you think about home security with ${p.n}.

AFFILIATE URL
${p.u}

FORMAT
9:16 vertical • TikTok / Reels / Shorts`}

function resetVideo(){if(state.videoUrl)URL.revokeObjectURL(state.videoUrl);state.videoBlob=null;state.videoUrl="";$("downloadVideoBtn").disabled=true;$("convertMp4Btn").disabled=true;$("videoStage").classList.add("hidden");$("videoProgress").textContent="READY";$("videoStatus").textContent="Upload a product image, then build the video."}

function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src})}

function drawCover(ctx,img,w,h,zoom=1){const scale=Math.max(w/img.width,h/img.height)*zoom;const iw=img.width*scale,ih=img.height*scale;const x=(w-iw)/2,y=(h-ih)/2;ctx.drawImage(img,x,y,iw,ih)}

function drawScene(ctx,timeline,img,elapsed){const scene=timeline.scenes.find(s=>elapsed>=s.startMs&&elapsed<s.endMs)||timeline.scenes.at(-1);const local=(elapsed-scene.startMs)/(scene.endMs-scene.startMs);ctx.clearRect(0,0,timeline.width,timeline.height);ctx.fillStyle="#f5f2eb";ctx.fillRect(0,0,timeline.width,timeline.height);
if(img){ctx.save();drawCover(ctx,img,timeline.width,timeline.height,scene.id==="product"?1.02:1.08);ctx.globalAlpha=.18;ctx.fillStyle="#ffffff";ctx.fillRect(0,0,timeline.width,timeline.height);ctx.restore()}
const grad=ctx.createLinearGradient(0,0,0,timeline.height);grad.addColorStop(0,"#ffffffd9");grad.addColorStop(.45,"#ffffff35");grad.addColorStop(1,"#111111dd");ctx.fillStyle=grad;ctx.fillRect(0,0,timeline.width,timeline.height);
ctx.fillStyle="#111";ctx.font="800 32px Inter,Arial,sans-serif";ctx.fillText("AFFILIAI ULTRA",72,110);
ctx.fillStyle="#777";ctx.font="700 24px Inter,Arial,sans-serif";ctx.fillText("HOME SECURITY • AFFILIATE",72,154);
const scale=1+Math.sin(Math.min(1,Math.max(0,local))*Math.PI)*.025;ctx.save();ctx.translate(timeline.width/2,timeline.height*.58);ctx.scale(scale,scale);ctx.translate(-timeline.width/2,-timeline.height*.58);
ctx.fillStyle="#111";ctx.font="800 78px Inter,Arial,sans-serif";const lines=wrapText(ctx,scene.text,860);let y=timeline.height*.58-(lines.length-1)*48;for(const line of lines){ctx.fillText(line,(timeline.width-ctx.measureText(line).width)/2,y);y+=96}ctx.restore();
if(scene.id==="cta"){ctx.fillStyle="#111";roundRect(ctx,120,1500,840,150,28);ctx.fillStyle="#fff";ctx.font="800 42px Inter,Arial,sans-serif";ctx.fillText("DISCOVER PRODUCT",330,1592)}
ctx.fillStyle="#fff";ctx.font="500 22px Inter,Arial,sans-serif";const footer=timeline.affiliateUrl.length>58?timeline.affiliateUrl.slice(0,55)+"…":timeline.affiliateUrl;ctx.fillText(footer,72,1810);ctx.fillText("Affiliate disclosure • Link provided by advertiser",72,1850)}

function wrapText(ctx,text,maxWidth){const words=String(text).split(/\s+/);const lines=[];let line="";for(const word of words){const test=line?line+" "+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test}if(line)lines.push(line);return lines.slice(0,4)}

function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();ctx.fill()}

async function buildVideo(){const p=data();if(!state.imageData){$("notice").textContent="Upload the real product image before generating the video.";return}if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream){$("notice").textContent="This browser cannot export video. Use the latest Chrome or Edge.";return}
$("videoStage").classList.remove("hidden");$("videoBtn").disabled=true;$("downloadVideoBtn").disabled=true;$("mode").textContent="RENDERING VIDEO";$("videoStatus").textContent="Rendering a real 1080 × 1920 vertical video locally…";
const timeline=createVideoTimeline({product:p.n,description:p.d,affiliateUrl:p.u,durationSec:Number($("videoDuration").value)||22});const canvas=$("videoCanvas"),ctx=canvas.getContext("2d");const img=await loadImage(state.imageData);const stream=canvas.captureStream(30);const mime=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":MediaRecorder.isTypeSupported("video/webm;codecs=vp8")?"video/webm;codecs=vp8":"video/webm";const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:7000000});const chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};const finished=new Promise(resolve=>recorder.onstop=resolve);recorder.start(250);const start=performance.now();
await new Promise(resolve=>{const frame=now=>{const elapsed=Math.min(timeline.durationMs,now-start);drawScene(ctx,timeline,img,elapsed);$("videoProgress").textContent=Math.round(elapsed/timeline.durationMs*100)+"%";if(elapsed<timeline.durationMs){requestAnimationFrame(frame)}else{setTimeout(()=>{recorder.stop();resolve()},150)}};requestAnimationFrame(frame)});await finished;
state.videoBlob=new Blob(chunks,{type:"video/webm"});if(state.videoUrl)URL.revokeObjectURL(state.videoUrl);state.videoUrl=URL.createObjectURL(state.videoBlob);$("downloadVideoBtn").disabled=false;$("convertMp4Btn").disabled=false;$("videoBtn").disabled=false;$("mode").textContent="VIDEO READY";$("videoStatus").textContent="Your 9:16 video is ready. Download the WebM file and publish it to TikTok, Reels or Shorts.";$("videoProgress").textContent="100%";$("notice").textContent="Vertical video created locally — no paid video API required."}

function downloadVideo(){if(!state.videoUrl)return;const a=document.createElement("a");a.href=state.videoUrl;a.download="affiliai-ultra-9x16-video.webm";document.body.appendChild(a);a.click();a.remove();$("notice").textContent="Video download started."}

updateTitle();\nasync function convertMp4(){if(!state.videoBlob)return;$("convertMp4Btn").disabled=true;$("convertMp4Btn").textContent="Converting…";$("notice").textContent="Converting the vertical video to MP4 locally…";try{const reader=new FileReader();const base64=await new Promise((resolve,reject)=>{reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(state.videoBlob)});const r=await fetch("/api/convert-mp4",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({videoBase64:base64})});if(!r.ok)throw Error("MP4 conversion failed");const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="affiliai-ultra-9x16-video.mp4";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);$("notice").textContent="MP4 download started."}catch(e){$("notice").textContent="MP4 export failed. You can still download the WebM version."}finally{$("convertMp4Btn").disabled=false;$("convertMp4Btn").textContent="Export MP4"}}