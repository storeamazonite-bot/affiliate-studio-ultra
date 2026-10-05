const {app,BrowserWindow,shell,utilityProcess}=require("electron");
const path=require("path");
const isWindows7=process.platform==="win32"&&/^6\\.1\\./.test(process.getSystemVersion());
if(isWindows7)app.disableHardwareAcceleration();

let child=null;
let output="";

function startBackend(){
  return new Promise((resolve,reject)=>{
    const root=__dirname;
    child=utilityProcess.fork(path.join(root,"backend-launcher.cjs"),[],{
      cwd:root,
      env:{...process.env,PORT:"0"},
      stdio:"pipe",
      serviceName:"AffiliAI Ultra Backend"
    });
    const onData=(d)=>{
      output+=d.toString();
      const m=output.match(/http:\/\/localhost:(\d+)/);
      if(m){child.stdout?.removeListener("data",onData);resolve(Number(m[1]));}
    };
    child.stdout?.on("data",onData);
    child.stderr?.on("data",d=>{output+=d.toString()});
    child.on("spawn",()=>{});
    child.on("exit",code=>{if(code&&code!==0)reject(new Error("Backend exited: "+code+" "+output))});
  });
}

app.whenReady().then(async()=>{
  const port=await startBackend();
  const win=new BrowserWindow({
    width:1180,height:780,minWidth:980,minHeight:620,
    backgroundColor:"#faf9f6",
    webPreferences:{contextIsolation:true,nodeIntegration:false,spellcheck:false}
  });
  await win.loadURL("http://localhost:"+port);
  win.webContents.setWindowOpenHandler(({url})=>{
    if(/^https?:/i.test(url))shell.openExternal(url);
    return {action:"deny"};
  });
}).catch(err=>{console.error(err);app.quit()});

app.on("before-quit",()=>{try{child?.kill()}catch{}});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit()});
