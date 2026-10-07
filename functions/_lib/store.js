import {getProduct,PRODUCTS} from "../../store/catalogue-data.js";
// Copy Real private store helpers for Cloudflare Pages Functions.
// STORE_PRODUCTS_JSON contains private enablement + R2 object mappings only.
// Approved prices come from catalogue-data.js and cannot be supplied by the browser.
export const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff",...headers}});
export function requireServices(env,keys){const absent=keys.filter(key=>!env[key]);if(absent.length)throw new Error("Store configuration missing: "+absent.join(", "));}
export function storeMode(env){
  if(env.STORE_ENABLED!=="true")return null;
  const key=String(env.STRIPE_SECRET_KEY||"");
  if(env.STORE_MODE==="test"&&key.startsWith("sk_test_"))return "test";
  if(env.STORE_MODE==="live"&&env.STORE_LIVE_APPROVED==="true"&&key.startsWith("sk_live_"))return "live";
  return null;
}
export function enabledStore(env){return Boolean(storeMode(env));}
export function allowedOrigin(request,env){
  const origin=request.headers.get("origin");
  if(!origin)return false;
  const actual=new URL(request.url).origin;
  if(origin!==actual)return false;
  return !env.STORE_PUBLIC_ORIGIN||origin===env.STORE_PUBLIC_ORIGIN;
}
export function privateProducts(env){let parsed;try{parsed=JSON.parse(env.STORE_PRODUCTS_JSON||"{}");}catch{throw new Error("Invalid private product configuration");}if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))throw new Error("Invalid private product configuration");return parsed;}
function validObjectKey(value){return typeof value==="string"&&value.length>0&&value.length<=1024&&!/^\w+:\/\//i.test(value)&&!value.startsWith("/")&&!/(^|\/)\.\.(\/|$)/.test(value)&&!value.includes("drive.google.com");}
export function lookupProduct(env,sku){
  const meta=getProduct(sku),config=privateProducts(env)[sku];
  if(!meta||!config||config.enabled!==true||!validObjectKey(config.r2Key))return null;
  const territories=Array.isArray(config.territories)?config.territories.filter(code=>/^[A-Z]{2}$/.test(code)):[];
  if(meta.territoryMode==="restricted"&&territories.length===0)return null;
  return {...meta,r2Key:config.r2Key,filename:typeof config.filename==="string"?config.filename:"",contentType:typeof config.contentType==="string"?config.contentType:"",territories};
}
export function enabledProducts(env){return PRODUCTS.map(product=>lookupProduct(env,product.sku)).filter(Boolean);}
export async function stripe(env,path,init={}){
  const response=await fetch("https://api.stripe.com/v1/"+path,{...init,headers:{"authorization":"Bearer "+env.STRIPE_SECRET_KEY,...(init.headers||{})}});
  const value=await response.json();
  if(!response.ok)throw new Error("Stripe API: "+(value.error?.type||"request_failed"));
  return value;
}
export async function sha256(text){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,"0")).join("");}
export function randomToken(){const bytes=crypto.getRandomValues(new Uint8Array(32));return [...bytes].map(b=>b.toString(16).padStart(2,"0")).join("");}
function constantTimeEqual(a,b){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;}
export async function verifyStripeSignature(body,header,secret){
  if(!header||!secret)return false;
  let timestamp=null;const signatures=[];
  for(const part of header.split(",")){const [key,value]=part.split("=",2);if(key==="t")timestamp=Number(value);if(key==="v1"&&value)signatures.push(value);}
  if(!Number.isFinite(timestamp)||Math.abs(Date.now()/1000-timestamp)>300||!signatures.length)return false;
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const mac=new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(String(timestamp)+"."+body)));
  const expected=[...mac].map(b=>b.toString(16).padStart(2,"0")).join("");
  return signatures.some(sig=>constantTimeEqual(expected,sig));
}
export function validSessionId(env,id){const mode=storeMode(env);return typeof id==="string"&&(mode==="test"?/^cs_test_[a-zA-Z0-9_]{10,}$/.test(id):mode==="live"?/^cs_live_[a-zA-Z0-9_]{10,}$/.test(id):false);}
export async function markPaid(env,session){
  if(session.payment_status!=="paid"||!session.id||!session.client_reference_id)return false;
  const order=await env.STORE_DB.prepare("SELECT id,sku,amount,currency,session_id,status FROM store_orders WHERE id=?").bind(session.client_reference_id).first();
  if(!order||order.session_id!==session.id||order.status==="cancelled")return false;
  const configured=lookupProduct(env,order.sku);
  if(!configured||configured.amount!==order.amount||configured.currency!==order.currency||session.amount_total!==order.amount||session.currency!==order.currency)return false;
  if(order.status==="pending")await env.STORE_DB.prepare("UPDATE store_orders SET status='paid',paid_at=? WHERE id=? AND status='pending'").bind(Date.now(),order.id).run();
  return true;
}
export function err(error){console.error("Copy Real store:",error?.message||error);return json({error:"Store temporarily unavailable"},503);}
