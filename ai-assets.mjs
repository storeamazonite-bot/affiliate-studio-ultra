const clean=value=>String(value??"").trim();

export function createAsset({type,product,url,affiliateUrl,thumbnailUrl="",title=""}={}){
  return {
    id:`asset_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    type:type==="video"?"video":"image",
    product:clean(product)||"Smart Home Security Product",
    url:clean(url),
    thumbnailUrl:clean(thumbnailUrl)||clean(url),
    affiliateUrl:clean(affiliateUrl),
    title:clean(title)||`AI ${type==="video"?"Video":"Image"}`,
    createdAt:new Date().toISOString()
  };
}

export function filterAssets(assets=[],{type="all",product=""}={}){
  const p=clean(product).toLowerCase();
  return assets.filter(a=>(type==="all"||a.type===type)&&(!p||String(a.product).toLowerCase().includes(p)));
}

export function assetTypeLabel(type){return type==="video"?"AI Video":"AI Image";}
