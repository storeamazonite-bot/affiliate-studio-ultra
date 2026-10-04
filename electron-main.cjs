const {app,BrowserWindow,shell}=require("electron");
const {spawn}=require("child_process");
const path=require("path");

let child=null;

function startBackend(){
  return new Promise((resolve,reject)=>{
    const root=__dirname;
    child=spawn(process.execPath,[path.join(root,"server.js")],{
      cwd:root,
      env:{...process.env,ELECTRON_RUN_AS_NODE:"1",PORT:"0"},
      stdio:["ignore","pipe","pipe"],
      windowsHide:true
    });
    let output="";
    const onData=(d)=>{
      output+=d.toString();
      const m=output.match(/http:\/\/localhost:(\d+)/);
      if(m){child.stdout.removeListener("data",onData);resolve(Number(m[1]));}
    };
    child.stdout.on("data",onData);
    child.stderr.on("data",d=>{output+=d.toString()});
    child.on("error",reject);
    child.on("exit",(code)=>{if(code&&code!==0)reject(new Error("Backend exited: "+code+" "+output))});
  });
}

app.whenReady().then(async()=>{
  const port=await startBackend();
  const win=new BrowserWindow({
    width:1440,height:950,minWidth:1100,minHeight:700,
    backgroundColor:"#faf9f6",
    webPreferences:{contextIsolation:true,nodeIntegration:false}
  });
  await win.loadURL("http://localhost:"+port);
  win.webContents.setWindowOpenHandler(({url})=>{
    if(/^https?:/i.test(url))shell.openExternal(url);
    return {action:"deny"};
  });
}).catch(err=>{console.error(err);app.quit()});

app.on("before-quit",()=>{if(child)child.kill()});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit()});
