import assert from "node:assert/strict";
import test from "node:test";
import {buildImagePrompt,buildVideoBrief,normalizeCreativeInput} from "./ai-creative.mjs";

test("builds a product-specific image prompt without changing the affiliate URL",()=>{
  const p=normalizeCreativeInput({product:"Smart 4K Camera",description:"Outdoor camera with night vision.",affiliateUrl:"https://example.com/track"});
  const prompt=buildImagePrompt({...p,style:"luxury home scene",ratio:"9:16"});
  assert.match(prompt,/Smart 4K Camera/);
  assert.match(prompt,/Outdoor camera with night vision/);
  assert.match(prompt,/9:16/);
  assert.match(prompt,/preserve the real product identity/i);
});

test("builds a video brief with an exact affiliate CTA",()=>{
  const p=normalizeCreativeInput({product:"Smart Doorbell",description:"Video doorbell for front-door awareness.",affiliateUrl:"https://example.com/door"});
  const brief=buildVideoBrief({...p,durationSec:22});
  assert.match(brief,/Smart Doorbell/);
  assert.match(brief,/22 seconds/);
  assert.match(brief,/https:\/\/example\.com\/door/);
  assert.match(brief,/do not alter or invent/i);
});

test("normalizes missing creative fields safely",()=>{
  const p=normalizeCreativeInput({});
  assert.equal(p.product,"Smart Home Security Product");
  assert.equal(p.affiliateUrl,"[INSERT AFFILIATE LINK]");
});
