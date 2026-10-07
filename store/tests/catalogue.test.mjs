import test from "node:test";
import assert from "node:assert/strict";
import {TITLES,PRODUCTS,productsForTitle,PRICE_TABLE} from "../catalogue-data.js";
test("catalogue has 47 inventory titles and exactly five supported SKUs each",()=>{
  assert.equal(TITLES.length,47);
  assert.equal(PRODUCTS.length,235);
  for(const title of TITLES){
    const products=productsForTitle(title.slug);
    assert.equal(products.length,5,title.slug);
    assert.equal(new Set(products.map(p=>p.sku)).size,5,title.slug);
    assert.ok(!products.some(p=>/PN-CFX|CFX-PN/.test(p.sku)),title.slug+" must not create PN+CFX bundle");
    assert.ok(products.some(p=>p.type==="ebook_pn"));
    assert.ok(products.some(p=>p.type==="ebook_cfx"));
  }
});
test("approved GBP pricing is exact for classics and owned works",()=>{
  assert.deepEqual(PRICE_TABLE.classic,{ebook:199,pn:499,cfx:699,ebook_pn:599,ebook_cfx:799});
  assert.deepEqual(PRICE_TABLE.owned,{ebook:399,pn:699,cfx:899,ebook_pn:799,ebook_cfx:999});
  assert.ok(PRODUCTS.every(p=>p.currency==="gbp"));
  const frankenstein=productsForTitle("frankenstein");
  assert.deepEqual(frankenstein.map(p=>p.amount),[199,499,699,599,799]);
  assert.ok(frankenstein.every(p=>p.pilot));
});
