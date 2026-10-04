import assert from "node:assert/strict";
import test from "node:test";
import {createVideoTimeline} from "./video-engine.mjs";

test("creates a 9:16 vertical timeline with four campaign scenes",()=>{
  const timeline=createVideoTimeline({
    product:"Smart 4K Camera",
    description:"Clear monitoring for a connected home.",
    affiliateUrl:"https://example.com/affiliate"
  });
  assert.equal(timeline.width,1080);
  assert.equal(timeline.height,1920);
  assert.equal(timeline.durationMs,22000);
  assert.equal(timeline.scenes.length,4);
  assert.deepEqual(timeline.scenes.map(s=>s.id),["hook","product","benefit","cta"]);
});

test("falls back safely when product fields are empty",()=>{
  const timeline=createVideoTimeline({});
  assert.equal(timeline.width,1080);
  assert.equal(timeline.height,1920);
  assert.ok(timeline.scenes.every(s=>typeof s.text==="string"));
});\ntest("supports 15 and 30 second presets",()=>{\n  assert.equal(createVideoTimeline({durationSec:15}).durationMs,15000);\n  assert.equal(createVideoTimeline({durationSec:30}).durationMs,30000);\n});\n