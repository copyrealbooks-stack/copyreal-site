import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("D1 migration contains required order and delivery constraints",async()=>{
  const sql=await readFile("store/migrations/0001_store.sql","utf8");
  assert.match(sql,/CREATE TABLE IF NOT EXISTS store_orders/i);
  assert.match(sql,/session_id TEXT UNIQUE/i);
  assert.match(sql,/status IN\('pending','paid','cancelled'\)/i);
  assert.match(sql,/CREATE TABLE IF NOT EXISTS store_delivery_tokens/i);
  assert.match(sql,/order_id TEXT NOT NULL UNIQUE REFERENCES store_orders\(id\)/i);
  assert.match(sql,/max_downloads INTEGER NOT NULL DEFAULT 3/i);
});
test("store/books route is explicitly redirected to the actual shop",async()=>{
  const redirects=await readFile("_redirects","utf8");
  assert.match(redirects,/^\/store\/books \/store\/ 301$/m);
  assert.match(redirects,/^\/store\/books\/ \/store\/ 301$/m);
  const html=await readFile("store/index.html","utf8");
  assert.match(html,/Copy Real Direct Store/);
  assert.match(html,/BOOKS &amp; AUDIOBOOKS/);
  assert.doesNotMatch(html,/<h1>BOOKS THAT SHOULD EXIST/i);
});
