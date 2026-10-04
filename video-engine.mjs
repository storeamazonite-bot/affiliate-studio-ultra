const clean=value=>String(value??"").trim();

export function createVideoTimeline({product,description,affiliateUrl,durationSec=22}={}){
  const name=clean(product)||"Smart Home Security Product";
  const detail=clean(description)||"Modern security technology for a more connected home.";
  const link=clean(affiliateUrl)||"[INSERT AFFILIATE LINK]";
  const durationMs=Math.max(15,Math.min(30,Number(durationSec)||22))*1000;
  const hook=Math.round(durationMs*.14),productEnd=Math.round(durationMs*.36),benefitEnd=Math.round(durationMs*.73);
  return {width:1080,height:1920,durationMs,scenes:[
    {id:"hook",startMs:0,endMs:hook,text:"Could your home security be smarter?"},
    {id:"product",startMs:hook,endMs:productEnd,text:name},
    {id:"benefit",startMs:productEnd,endMs:benefitEnd,text:detail},
    {id:"cta",startMs:benefitEnd,endMs:durationMs,text:"Discover Product"}
  ],affiliateUrl:link};
}