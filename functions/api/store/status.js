import {json,requireServices,enabledStore,stripe,markPaid,sha256,randomToken,validSessionId,err} from "../../_lib/store.js";
export async function onRequestGet({request,env}){
  if(!enabledStore(env))return json({error:"Store not enabled"},503);
  const id=new URL(request.url).searchParams.get("session_id");
  if(!validSessionId(env,id))return json({error:"Invalid session"},400);
  try{
    requireServices(env,["STORE_DB","STORE_ASSETS","STRIPE_SECRET_KEY","STORE_PRODUCTS_JSON"]);
    const order=await env.STORE_DB.prepare("SELECT id,sku,status,created_at FROM store_orders WHERE session_id=?").bind(id).first();
    if(!order)return json({error:"Order not found"},404);
    const session=await stripe(env,"checkout/sessions/"+encodeURIComponent(id));
    if(session.payment_status!=="paid")return json({status:"pending"});
    if(!await markPaid(env,session))return json({error:"Payment cannot be reconciled"},409);
    const deliveryDeadline=order.created_at+7*24*3600*1000;
    if(Date.now()>=deliveryDeadline)return json({error:"Delivery window expired; contact support"},410);
    const existing=await env.STORE_DB.prepare("SELECT downloads,max_downloads FROM store_delivery_tokens WHERE order_id=?").bind(order.id).first();
    if(existing&&existing.downloads>=existing.max_downloads)return json({error:"Download limit reached"},410);
    const token=randomToken(),hash=await sha256(token),expiresAt=Math.min(Date.now()+24*3600*1000,deliveryDeadline);
    await env.STORE_DB.prepare("INSERT INTO store_delivery_tokens(token_hash,order_id,expires_at,downloads,max_downloads) VALUES(?,?,?,0,3) ON CONFLICT(order_id) DO UPDATE SET token_hash=excluded.token_hash,expires_at=excluded.expires_at").bind(hash,order.id,expiresAt).run();
    return json({status:"paid",sku:order.sku,downloadUrl:"/api/store/download?token="+token,expiresInSeconds:Math.max(0,Math.floor((expiresAt-Date.now())/1000))});
  }catch(error){return err(error);}
}
