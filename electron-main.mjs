import {app,BrowserWindow,shell} from "electron";
import {createServer} from "node:http";
import {readFileSync,existsSync,statSync} from "node:fs";
import {join,extname} from "node:path";
import {fileURLToPath} from "node:url";

const root=join(fileURLToPath(new URL(".",import.meta.url)));
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8"};
let server;

function startStaticServer(){
  return new Promise(resolve=>{
    server=createServer((req,res)=>{
      const requested=req.url==="/"?"index.html":req.url.replace(/^\//,"");
      const file=join(root,requested);
      if(!file.startsWith(root)||!existsSync(file)||statSync(file).isDirectory()){res.writeHead(404);res.end("Not found");return}
      res.writeHead(200,{"Content-Type":mime[extname(file)]||"application/octet-stream"});res.end(readFileSync(file));
    }).listen(0,"127.0.0.1",()=>resolve(server.address().port));
  });
}

app.whenReady().then(async()=>{
  const port=await startStaticServer();
  const win=new BrowserWindow({width:1440,height:950,minWidth:1100,minHeight:700,backgroundColor:"#faf9f6",webPreferences:{contextIsolation:true,nodeIntegration:false}});
  await win.loadURL("http://127.0.0.1:"+port);
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:/i.test(url))shell.openExternal(url);return {action:"deny"}});
  win.on("closed",()=>{server?.close();});
});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit()});
