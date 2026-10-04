import {app,BrowserWindow,shell} from "electron";
import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";
import {join} from "node:path";

const root=join(fileURLToPath(new URL(".",import.meta.url)));
let child;
const port=Number(process.env.PORT||0);

function startBackend(){
  return new Promise((resolve,reject)=>{
    const selected=port||0;
    child=spawn(process.execPath,[join(root,"server.js")],{cwd:root,env:{...process.env,PORT:String(selected)},stdio:["ignore","pipe","pipe"]});
    let output="";
    const onData=d=>{output+=d.toString();const m=output.match(/http:\/\/localhost:(\d+)/);if(m){child.stdout.off("data",onData);resolve(Number(m[1]));}};
    child.stdout.on("data",onData);
    child.stderr.on("data",d=>{if(String(d).toLowerCase().includes("error"))output+=String(d)});
    child.on("error",reject);
    child.on("exit",code=>{if(code&&code!==0)reject(new Error("Backend exited: "+code+" "+output))});
  });
}

app.whenReady().then(async()=>{
  const backendPort=await startBackend();
  const win=new BrowserWindow({width:1440,height:950,minWidth:1100,minHeight:700,backgroundColor:"#faf9f6",webPreferences:{contextIsolation:true,nodeIntegration:false}});
  await win.loadURL("http://localhost:"+backendPort);
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:/i.test(url))shell.openExternal(url);return {action:"deny"}});
});
app.on("before-quit",()=>{child?.kill()});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit()});
