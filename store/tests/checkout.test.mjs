import test from "node:test";
import assert from "node:assert/strict";
import {webcrypto} from "node:crypto";
import {storeMode,enabledStore,verifyStripeSignature,lookupProduct} from "../../functions/_lib/store.js";
import {onRequestPost as checkout} from "../../functions/api/store/checkout.js";
import {onRequestPost as webhook} from "../../functions/api/store/webhook.js";
import {onRequestGet as status} from "../../functions/api/store/status.js";
import {onRequestGet as download} from "../../functions/api/store/download.js";
globalThis.crypto ||= webcrypto;
const origin="https://preview.example.pages.dev";
const sessionId="cs_test_testsessionabcdefghijkl";
const privateConfig=()=>JSON.stringify({
  "FRANKENSTEIN-EBOOK":{enabled:true,r2Key:"frankenstein/ebook.zip",filename:"frankenstein-ebook.zip",contentType:"application/zip"},
  "FRANKENSTEIN-EBOOK-PN":{enabled:true,r2Key:"frankenstein/ebook-pn.zip",filename:"frankenstein-ebook-pn.zip",contentType:"application/zip"},
  "1984-EBOOK":{enabled:true,r2Key:"1984/ebook.zip"}
});
function database(){
  const orders=new Map(),tokens=new Map();
  const prepare=sql=>({bind(...a){return {
    async run(){
      if(sql.startsWith("INSERT INTO store_orders"))orders.set(a[0],{id:a[0],sku:a[1],amount:a[2],currency:a[3],status:"pending",created_at:a[4],session_id:null});
      else if(sql.startsWith("UPDATE store_orders SET session_id"))orders.get(a[1]).session_id=a[0];
      else if(sql.startsWith("UPDATE store_orders SET status")){const o=orders.get(a[1]);if(o?.status==="pending"){o.status="paid";o.paid_at=a[0]}}
      else if(sql.startsWith("INSERT INTO store_delivery_tokens")){
        const existing=tokens.get(a[1]);
        if(existing){existing.token_hash=a[0];existing.expires_at=a[2];}
        else tokens.set(a[1],{token_hash:a[0],order_id:a[1],expires_at:a[2],downloads:0,max_downloads:3});
      } else throw Error("Unexpected SQL "+sql);
      return {success:true};
    },
    async first(){
      if(sql.startsWith("SELECT id,sku,amount,currency,session_id,status"))return orders.get(a[0])||null;
      if(sql.startsWith("SELECT id,sku,status,created_at"))return [...orders.values()].find(x=>x.session_id===a[0])||null;
      if(sql.startsWith("SELECT downloads,max_downloads")){const t=tokens.get(a[0]);return t?{downloads:t.downloads,max_downloads:t.max_downloads}:null}
      if(sql.startsWith("SELECT t.order_id,o.sku")){const t=[...tokens.values()].find(x=>x.token_hash===a[0]&&x.expires_at>a[1]&&x.downloads<x.max_downloads);return t?{order_id:t.order_id,sku:orders.get(t.order_id).sku,status:orders.get(t.order_id).status}:null}
      if(sql.startsWith("UPDATE store_delivery_tokens SET downloads")){const t=[...tokens.values()].find(x=>x.token_hash===a[0]&&x.expires_at>a[1]&&x.downloads<x.max_downloads);if(!t)return null;t.downloads++;return {downloads:t.downloads}}
      throw Error("Unexpected SQL "+sql);
    }
  }}})
  return {prepare,orders,tokens};
}
const request=(path,method="GET",body,headers={})=>new Request(origin+path,{method,headers,body});
async function signature(raw,secret){const t=Math.floor(Date.now()/1000).toString(),key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);const bytes=new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(t+"."+raw)));return "t="+t+",v1=deadbeef,v1="+[...bytes].map(n=>n.toString(16).padStart(2,"0")).join("")}
test("store gating requires explicit live approval and approved server prices",()=>{
  assert.equal(storeMode({STORE_ENABLED:"true",STORE_MODE:"live",STRIPE_SECRET_KEY:"sk_live_fake"}),null);
  assert.equal(storeMode({STORE_ENABLED:"true",STORE_MODE:"live",STORE_LIVE_APPROVED:"true",STRIPE_SECRET_KEY:"sk_live_fake"}),"live");
  assert.equal(enabledStore({STORE_ENABLED:"true",STORE_MODE:"test",STRIPE_SECRET_KEY:"sk_test_fake"}),true);
  const env={STORE_PRODUCTS_JSON:privateConfig()};
  assert.equal(lookupProduct(env,"FRANKENSTEIN-EBOOK").amount,199);
  assert.equal(lookupProduct(env,"FRANKENSTEIN-EBOOK").currency,"gbp");
  assert.equal(lookupProduct(env,"FRANKENSTEIN-EBOOK-PN").amount,599);
  assert.equal(lookupProduct(env,"1984-EBOOK"),null,"restricted title must not enable without country allow-list");
});
test("origin protection and Stripe signature validation",async()=>{
  assert.equal(await verifyStripeSignature('{"test":true}',"t=1,v1=aaa","whsec_fake"),false);
  const unauthorized=await checkout({request:request("/api/store/checkout","POST",'{"sku":"FRANKENSTEIN-EBOOK"}',{"content-type":"application/json","origin":"https://attacker.example"}),env:{STORE_ENABLED:"true",STORE_MODE:"test",STRIPE_SECRET_KEY:"sk_test_fake"}});
  assert.equal(unauthorized.status,403);
});
test("GBP checkout -> signed webhook -> protected R2 download cap cannot be reset",async()=>{
  const db=database(),oldFetch=globalThis.fetch,secret="whsec_test_only";
  const env={STORE_ENABLED:"true",STORE_MODE:"test",STRIPE_SECRET_KEY:"sk_test_fake",STRIPE_WEBHOOK_SECRET:secret,STORE_PRODUCTS_JSON:privateConfig(),STORE_DB:db,STORE_ASSETS:{async get(key){assert.equal(key,"frankenstein/ebook.zip");return {body:new Response("Test file").body,size:9,httpMetadata:{contentType:"application/zip"}}}}};
  let session;
  globalThis.fetch=async(url,init)=>{
    if(String(url).endsWith("/checkout/sessions")){
      const body=new URLSearchParams(init.body);
      assert.equal(body.get("line_items[0][price_data][currency]"),"gbp");
      assert.equal(body.get("line_items[0][price_data][unit_amount]"),"199");
      session={id:sessionId,client_reference_id:body.get("client_reference_id"),amount_total:199,currency:"gbp",payment_status:"paid"};
      return Response.json({...session,url:"https://checkout.stripe.com/test-checkout"});
    }
    if(String(url).includes("/checkout/sessions/"+sessionId))return Response.json(session);
    throw Error("Unexpected Stripe request "+url);
  };
  try{
    const req=request("/api/store/checkout","POST",JSON.stringify({sku:"FRANKENSTEIN-EBOOK"}),{"content-type":"application/json","origin":origin});req.cf={country:"TH"};
    const start=await checkout({request:req,env});assert.equal(start.status,200);assert.equal((await start.json()).checkoutUrl,"https://checkout.stripe.com/test-checkout");
    const event=JSON.stringify({id:"evt_test",type:"checkout.session.completed",data:{object:session}});
    const signed=await webhook({request:request("/api/store/webhook","POST",event,{"stripe-signature":await signature(event,secret)}),env});assert.equal(signed.status,200);
    const firstStatus=await status({request:request("/api/store/status?session_id="+sessionId),env});assert.equal(firstStatus.status,200);
    let delivery=await firstStatus.json();assert.equal(delivery.status,"paid");
    for(let i=0;i<2;i++){const file=await download({request:request(delivery.downloadUrl),env});assert.equal(file.status,200);assert.equal(await file.text(),"Test file")}
    const secondStatus=await status({request:request("/api/store/status?session_id="+sessionId),env});assert.equal(secondStatus.status,200);
    delivery=await secondStatus.json();
    const third=await download({request:request(delivery.downloadUrl),env});assert.equal(third.status,200);
    const cappedStatus=await status({request:request("/api/store/status?session_id="+sessionId),env});assert.equal(cappedStatus.status,410);
    const forged=await webhook({request:request("/api/store/webhook","POST",event,{"stripe-signature":"t=1,v1=garbage"}),env});assert.equal(forged.status,400);
  }finally{globalThis.fetch=oldFetch}
});
