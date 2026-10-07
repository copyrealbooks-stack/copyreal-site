import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const publicFiles=["store/index.html","store/catalogue-data.js","store/success/index.html","store/books/index.html","assets/store.js","assets/store.css"];
test("browser-visible store assets contain no secrets or private storage locations",async()=>{
  for(const file of publicFiles){
    const text=await readFile(file,"utf8");
    assert.doesNotMatch(text,/sk_(?:live|test)_[A-Za-z0-9]{20,}/,file);
    assert.doesNotMatch(text,/whsec_[A-Za-z0-9]{20,}/,file);
    assert.doesNotMatch(text,/https?:\/\/[^"'\s]*(?:r2\.dev|r2\.cloudflarestorage\.com|drive\.google\.com)/i,file);
    assert.doesNotMatch(text,/\br2Prefix\b/,file);
    assert.doesNotMatch(text,/\br2Key\b/,file);
  }
});
test("legacy public R2 inventory manifest is not present on the integration branch",async()=>{
  await assert.rejects(readFile("store/r2-catalogue.json","utf8"),{code:"ENOENT"});
});
