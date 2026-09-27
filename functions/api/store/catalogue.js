import {json,enabledStore,products,err} from "../../_lib/store.js";
export async function onRequestGet({env}){
 if(!enabledStore(env))return json({enabled:false,products:[]});
 try{
  const publicProducts=Object.entries(products(env)).filter(([sku,p])=>p.enabled&&p.r2Key&&p.name&&p.amount&&p.currency).map(([sku,p])=>({
   sku,name:p.name,title:p.title||p.name,edition:p.edition||"eBook",
   amount:p.amount,currency:p.currency,cover:p.publicCover||null,territories:p.territories||[]
  }));
  return json({enabled:true,products:publicProducts});
 }catch(e){return err(e);}
}
