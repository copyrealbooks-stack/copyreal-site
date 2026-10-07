import {json,enabledStore,enabledProducts,err} from "../../_lib/store.js";
export async function onRequestGet({env}){
  if(!enabledStore(env))return json({enabled:false,mode:null,products:[]});
  try{
    const products=enabledProducts(env).map(({r2Key,filename,contentType,...product})=>product);
    return json({enabled:true,mode:env.STORE_MODE,products});
  }catch(error){return err(error);}
}
