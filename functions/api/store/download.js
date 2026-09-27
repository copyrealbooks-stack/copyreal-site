import {json,requireServices,enabledStore,lookupProduct,sha256,err} from "../../_lib/store.js";
export async function onRequestGet({request,env}){
 if(!enabledStore(env))return json({error:"Store not enabled"},503);
 try{
  requireServices(env,["STORE_DB","STORE_ASSETS","STORE_PRODUCTS_JSON"]);
  const token=new URL(request.url).searchParams.get("token");
  if(!token||!/^[a-f0-9]{64}$/.test(token))return json({error:"Invalid download link"},400);
  const hash=await sha256(token),now=Date.now();
  // Read order first; R2 remains private. Do not return permanent storage URLs.
  const row=await env.STORE_DB.prepare("SELECT t.order_id,o.sku,o.status FROM store_delivery_tokens t JOIN store_orders o ON o.id=t.order_id WHERE t.token_hash=? AND t.expires_at>? AND t.downloads<t.max_downloads").bind(hash,now).first();
  if(!row||row.status!=="paid")return json({error:"Download expired or unavailable"},410);
  const product=lookupProduct(env,row.sku);if(!product)return json({error:"Edition unavailable"},404);
  const asset=await env.STORE_ASSETS.get(product.r2Key);
  if(!asset)return json({error:"File not yet available; contact support"},503);
  // Atomic cap on successful streaming attempts. Retried interrupted transfers may consume a slot.
  const claim=await env.STORE_DB.prepare("UPDATE store_delivery_tokens SET downloads=downloads+1 WHERE token_hash=? AND expires_at>? AND downloads<max_downloads RETURNING downloads").bind(hash,Date.now()).first();
  if(!claim)return json({error:"Download limit reached"},410);
  const filename=(product.filename||row.sku+".zip").replace(/[^a-zA-Z0-9._-]/g,"_");
  return new Response(asset.body,{headers:{"content-type":product.contentType||"application/octet-stream","content-disposition":'attachment; filename="'+filename+'"',"cache-control":"private, no-store","x-content-type-options":"nosniff","content-length":String(asset.size)}});
 }catch(e){return err(e);}
}
