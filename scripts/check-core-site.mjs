#!/usr/bin/env node
// Core Copy Real site smoke tests. Offline, no third-party packages or account data.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const core=[
'index.html','studio/index.html','studio/writers-block/index.html',
'studio/prose-audit/index.html','studio/ai-draft-editing/index.html',
'studio/review/index.html','publish/index.html','contact/index.html',
'toolbox/index.html','toolbox/kdp/index.html',
'toolbox/kdp/cover-builder/index.html',
'toolbox/kdp/rejection-decoder/index.html',
'toolbox/calculator/index.html','toolbox/adsense/index.html',
'toolbox/review/index.html','privacy/index.html','services/terms/index.html',
'services/kdp-upload-rescue/index.html','services/audiobook-production/index.html'
];
const bad=[];
function fail(message){bad.push(message);console.error('FAIL:',message)}
function fileExists(p){return fs.existsSync(path.resolve(root,p))&&fs.statSync(path.resolve(root,p)).isFile()}
function localTarget(from,href){
 if(!href||/^(?:#|mailto:|tel:|data:|javascript:)/i.test(href))return null;
 let target=href;
 if(/^https?:\/\//i.test(target)){
  try{const u=new URL(target);if(u.hostname!=='copyreal.com'&&u.hostname!=='www.copyreal.com')return null;target=u.pathname}
  catch{return null}
 }
 const cleaned=target.split(/[?#]/)[0];
 if(!cleaned||cleaned==='#')return null;
 if(cleaned.includes("'+"))return null; // dynamic JS string, not a static link
 let abs=cleaned.startsWith('/')?path.resolve(root,'.'+cleaned):path.resolve(root,path.dirname(from),cleaned);
 if(cleaned.endsWith('/'))abs=path.join(abs,'index.html');
 if(!abs.startsWith(root+path.sep)&&abs!==root){fail(from+': suspicious path escaping site root: '+href);return null}
 return abs;
}
for(const p of core){
 if(!fileExists(p)){fail('Missing core page: '+p);continue}
 const html=fs.readFileSync(path.join(root,p),'utf8');
 if(!/<title>[^<]+<\/title>/i.test(html))fail('Missing HTML title: '+p);
 if(!/name="description"/i.test(html)&&p!=='index.html')fail('Missing meta description: '+p);
 if(!/<\/html>/i.test(html))fail('HTML closing tag missing: '+p);
 for(const hit of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const dest=localTarget(p,hit[1]);
  if(dest&&!fs.existsSync(dest))fail(p+': missing local destination '+hit[1]);
 }
 for(const hit of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)){
  const attrs=hit[1]||'',body=hit[2].trim();if(!body)continue;
  if(/type=["']application\/ld\+json["']/i.test(attrs)){
   try{const json=JSON.parse(body);if(json['@context']!=='https://schema.org')fail(p+': unexpected JSON-LD context')}
   catch(e){fail(p+': invalid JSON-LD: '+e.message)}
  }else{
   try{new vm.Script(body,{filename:p})}catch(e){fail(p+': embedded JavaScript failed parse: '+e.message)}
  }
 }
 if(/NOT YET ACCEPTING PAYMENTS/.test(html)&&p==='toolbox/review/index.html')fail('Stale payment-preview copy');
}
const sitemap=path.join(root,'sitemap.xml');
if(!fs.existsSync(sitemap))fail('Missing sitemap.xml');
else{
 const xml=fs.readFileSync(sitemap,'utf8');
 for(const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)){
  const target=localTarget('index.html',match[1]);if(target&&!fs.existsSync(target))fail('Sitemap target missing: '+match[1])
 }
}
const links=[
['£39 title pack','https://book.stripe.com/8x25kF3GsahqgHOcr4aIM01'],
['£79 audio review','https://book.stripe.com/9B6dRbgte89i77eaiWaIM00']
];
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [name,url] of links)if(!home.includes(url)&&!fs.readFileSync(path.join(root,'toolbox/review/index.html'),'utf8').includes(url))fail('Checkout link missing: '+name);

const requiredFunnels=[
 ['index.html','services/kdp-upload-rescue/','Homepage KDP help'],
 ['toolbox/calculator/index.html','https://copyreal.com/toolbox/review/','Audiobook calculator to review'],
 ['toolbox/kdp/rejection-decoder/index.html','https://copyreal.com/services/kdp-upload-rescue/','Decoder to paid repair'],
 ['studio/index.html','https://copyreal.com/services/audiobook-production/','Studio to audio service'],
 ['services/audiobook-production/index.html','https://book.stripe.com/9B6dRbgte89i77eaiWaIM00','Audio landing to checkout'],
 ['services/kdp-upload-rescue/index.html','copyrealbooks@gmail.com','KDP landing to enquiries']
];
for(const [file,required,description] of requiredFunnels){
 if(!fs.readFileSync(path.join(root,file),'utf8').includes(required))fail('Broken acquisition funnel: '+description);
}
console.log('Checked '+core.length+' core pages, HTML script syntax, static links, sitemap and payment link presence.');
if(bad.length){console.error(bad.length+' error(s).');process.exit(1)}
console.log('PASS: no static site errors detected. This does not validate public deployment, checkout payment completion or print-production quality.');
