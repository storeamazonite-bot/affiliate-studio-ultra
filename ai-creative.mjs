const clean=value=>String(value??"").trim();

export function normalizeCreativeInput({product,description,affiliateUrl}={}){
  return {
    product:clean(product)||"Smart Home Security Product",
    description:clean(description)||"Modern security technology designed to support a safer, more connected home.",
    affiliateUrl:clean(affiliateUrl)||"[INSERT AFFILIATE LINK]"
  };
}

export function buildImagePrompt({product,description,style="premium product hero",ratio="1:1"}={}){
  return [
    "Create a premium English-first home-security affiliate marketing image.",
    `Product: ${product}.`,
    `Real product description: ${description}.`,
    `Creative style: ${style}. Aspect ratio: ${ratio}.`,
    "Use the supplied real product image as the visual identity reference when available.",
    "Preserve the real product identity, proportions, materials, buttons, ports, lens layout, logo placement and recognizable details.",
    "Do not invent specifications, features, certifications, prices, reviews, guarantees or performance claims.",
    "Place the product in a clean luxury white/marble environment with premium editorial lighting and realistic photography.",
    "Keep any generated marketing text short and legible. Do not render the affiliate URL inside the image."
  ].join(" ");
}

export function buildVideoBrief({product,description,affiliateUrl,durationSec=22}={}){
  return [
    `Create a ${Number(durationSec)||22} seconds premium vertical marketing video for ${product}.`,
    `Use this real product description only: ${description}.`,
    "Show the real product clearly in realistic premium home-security scenes.",
    "Structure: strong hook, product reveal, evidence-based benefit text, lifestyle/security context, final CTA.",
    "Do not alter or invent the product identity, specifications, features, certifications, reviews, prices or guarantees.",
    `Final CTA destination must remain exactly: ${affiliateUrl}`,
    "The affiliate URL is tracking metadata and must never be rewritten, shortened or hallucinated."
  ].join(" ");
}
