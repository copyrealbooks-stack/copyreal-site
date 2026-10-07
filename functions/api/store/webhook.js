import {json,requireServices,verifyStripeSignature,markPaid,err} from "../../_lib/store.js";
export async function onRequestPost({request,env}){
  try{
    requireServices(env,["STORE_DB","STRIPE_WEBHOOK_SECRET","STORE_PRODUCTS_JSON"]);
    const raw=await request.text();
    if(!await verifyStripeSignature(raw,request.headers.get("stripe-signature"),env.STRIPE_WEBHOOK_SECRET))return json({error:"Bad signature"},400);
    const event=JSON.parse(raw);
    if(event.type==="checkout.session.completed"||event.type==="checkout.session.async_payment_succeeded"){
      const session=event.data?.object||{};
      if(session.payment_status!=="paid")return json({received:true,pending:true});
      if(!await markPaid(env,session)){console.error("Payment reconciliation needs review",event.id);return json({error:"Reconciliation failed"},503);}
    }
    return json({received:true});
  }catch(error){return err(error);}
}
