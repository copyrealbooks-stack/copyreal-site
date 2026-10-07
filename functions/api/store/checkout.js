import {json,requireServices,enabledStore,allowedOrigin,lookupProduct,stripe,err} from "../../_lib/store.js";
export async function onRequestPost({request,env}){
  if(!allowedOrigin(request,env))return json({error:"Invalid origin"},403);
  if(!enabledStore(env))return json({error:"Checkout is not enabled"},503);
  try{
    requireServices(env,["STORE_DB","STRIPE_SECRET_KEY","STORE_PRODUCTS_JSON"]);
    if(!String(request.headers.get("content-type")||"").toLowerCase().includes("application/json"))return json({error:"Expected JSON"},415);
    const body=await request.json(),sku=body?.sku;
    if(typeof sku!=="string"||!/^[A-Z0-9-]{3,96}$/.test(sku))return json({error:"Invalid product"},400);
    const product=lookupProduct(env,sku);
    if(!product)return json({error:"This edition is not currently available"},404);
    const country=request.cf?.country;
    if(product.territories.length&&(!country||!product.territories.includes(country)))return json({error:"Not available in your territory"},403);
    const id=crypto.randomUUID(),now=Date.now();
    await env.STORE_DB.prepare("INSERT INTO store_orders(id,sku,amount,currency,status,created_at) VALUES(?,?,?,?,'pending',?)").bind(id,sku,product.amount,product.currency,now).run();
    const site=new URL(request.url).origin;
    const fields=new URLSearchParams({
      mode:"payment",
      client_reference_id:id,
      success_url:site+"/store/success/?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:site+"/store/?cancelled=1",
      "line_items[0][price_data][currency]":product.currency,
      "line_items[0][price_data][unit_amount]":String(product.amount),
      "line_items[0][price_data][product_data][name]":product.title+" — "+product.edition,
      "line_items[0][quantity]":"1",
      "metadata[sku]":sku,
      "metadata[order_id]":id,
      "payment_method_types[0]":"card"
    });
    const session=await stripe(env,"checkout/sessions",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded","idempotency-key":id},body:fields});
    if(!session?.id||!session?.url)throw new Error("Stripe checkout session missing fields");
    await env.STORE_DB.prepare("UPDATE store_orders SET session_id=? WHERE id=?").bind(session.id,id).run();
    return json({checkoutUrl:session.url});
  }catch(error){return err(error);}
}
