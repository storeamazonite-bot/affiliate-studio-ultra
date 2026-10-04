const clean=value=>String(value??"").trim();

export function createVideoTimeline({product,description,affiliateUrl}={}){
  const name=clean(product)||"Smart Home Security Product";
  const detail=clean(description)||"Modern security technology for a more connected home.";
  const link=clean(affiliateUrl)||"[INSERT AFFILIATE LINK]";
  return {
    width:1080,
    height:1920,
    durationMs:22000,
    scenes:[
      {id:"hook",startMs:0,endMs:3000,text:"Could your home security be smarter?"},
      {id:"product",startMs:3000,endMs:8000,text:name},
      {id:"benefit",startMs:8000,endMs:16000,text:detail},
      {id:"cta",startMs:16000,endMs:22000,text:"Discover Product"}
    ],
    affiliateUrl:link
  };
}