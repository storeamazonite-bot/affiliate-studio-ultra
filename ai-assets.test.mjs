import assert from "node:assert/strict";
import test from "node:test";
import {createAsset,filterAssets,assetTypeLabel} from "./ai-assets.mjs";

test("creates a persistent AI asset record",()=>{
  const asset=createAsset({type:"image",product:"Smart Camera",url:"blob:test",affiliateUrl:"https://example.com"});
  assert.equal(asset.type,"image");
  assert.equal(asset.product,"Smart Camera");
  assert.equal(asset.url,"blob:test");
  assert.equal(asset.affiliateUrl,"https://example.com");
  assert.ok(asset.id);
  assert.ok(asset.createdAt);
});

test("filters assets by type and product",()=>{
  const assets=[
    createAsset({type:"image",product:"Camera",url:"a"}),
    createAsset({type:"video",product:"Camera",url:"b"}),
    createAsset({type:"image",product:"Doorbell",url:"c"})
  ];
  assert.equal(filterAssets(assets,{type:"image"}).length,2);
  assert.equal(filterAssets(assets,{product:"Camera"}).length,2);
  assert.equal(filterAssets(assets,{type:"video",product:"Camera"}).length,1);
});

test("returns readable labels for asset types",()=>{
  assert.equal(assetTypeLabel("image"),"AI Image");
  assert.equal(assetTypeLabel("video"),"AI Video");
});
