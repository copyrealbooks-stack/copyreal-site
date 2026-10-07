// Copy Real Direct Store public catalogue.
// Safe to expose: titles, SKU identifiers and approved GBP pricing only.
// Private R2 object keys, payment credentials and customer data must never appear here.
export const CURRENCY="gbp";
export const PRICE_TABLE=Object.freeze({
  classic:Object.freeze({ebook:199,pn:499,cfx:699,ebook_pn:599,ebook_cfx:799}),
  owned:Object.freeze({ebook:399,pn:699,cfx:899,ebook_pn:799,ebook_cfx:999})
});
export const EDITION_TYPES=Object.freeze([
  Object.freeze({key:"ebook",suffix:"EBOOK",label:"eBook",description:"Digital reading edition"}),
  Object.freeze({key:"pn",suffix:"PN",label:"Pure Narration",description:"Complete unabridged narration without added sound design"}),
  Object.freeze({key:"cfx",suffix:"CFX",label:"Cinematic Edition",description:"Complete unabridged narration enhanced with atmosphere and cinematic effects"}),
  Object.freeze({key:"ebook_pn",suffix:"EBOOK-PN",label:"eBook + Pure Narration",description:"eBook and Pure Narration together"}),
  Object.freeze({key:"ebook_cfx",suffix:"EBOOK-CFX",label:"eBook + Cinematic Edition",description:"eBook and Cinematic Edition together"})
]);
export const TITLES=Object.freeze([
  {
    "slug": "1984",
    "title": "Nineteen Eighty-Four",
    "pricingClass": "classic",
    "territoryMode": "restricted",
    "skuBase": "1984",
    "pilot": false
  },
  {
    "slug": "42",
    "title": "42",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "42",
    "pilot": false
  },
  {
    "slug": "actors-companion-2",
    "title": "An Actor's Monologue Bible: Actors Companion — Vol. 2",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "ACTORS-COMPANION-2",
    "pilot": false
  },
  {
    "slug": "actors-companion-3",
    "title": "Actors Companion — Vol. 3",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "ACTORS-COMPANION-3",
    "pilot": false
  },
  {
    "slug": "actors-survival-guide",
    "title": "An Actor's Survival Guide",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "ACTORS-SURVIVAL-GUIDE",
    "pilot": false
  },
  {
    "slug": "apocalypse-park",
    "title": "Apocalypse Park",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "APOCALYPSE-PARK",
    "pilot": false
  },
  {
    "slug": "ash-and-iron-the-martian-shadow",
    "title": "The Martian Shadow",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "ASH-AND-IRON-THE-MARTIAN-SHADOW",
    "pilot": false
  },
  {
    "slug": "blood-that-binds",
    "title": "The Blood That Binds",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "BLOOD-THAT-BINDS",
    "pilot": false
  },
  {
    "slug": "boy-they-wouldnt-name",
    "title": "The Boy They Wouldn't Name",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "BOY-THEY-WOULDNT-NAME",
    "pilot": false
  },
  {
    "slug": "christmas-carol",
    "title": "A Christmas Carol",
    "pricingClass": "classic",
    "territoryMode": "standard",
    "skuBase": "CHRISTMAS-CAROL",
    "pilot": false
  },
  {
    "slug": "coming-race",
    "title": "The Coming Race",
    "pricingClass": "classic",
    "territoryMode": "standard",
    "skuBase": "COMING-RACE",
    "pilot": false
  },
  {
    "slug": "conditions",
    "title": "Conditions",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "CONDITIONS",
    "pilot": false
  },
  {
    "slug": "darkness-and-dawn",
    "title": "Darkness and Dawn",
    "pricingClass": "classic",
    "territoryMode": "standard",
    "skuBase": "DARKNESS-AND-DAWN",
    "pilot": false
  },
  {
    "slug": "dead-famous",
    "title": "Dead Famous",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "DEAD-FAMOUS",
    "pilot": false
  },
  {
    "slug": "donny",
    "title": "Donny",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "DONNY",
    "pilot": false
  },
  {
    "slug": "flipside",
    "title": "Flipside",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "FLIPSIDE",
    "pilot": false
  },
  {
    "slug": "frankenstein",
    "title": "Frankenstein",
    "pricingClass": "classic",
    "territoryMode": "standard",
    "skuBase": "FRANKENSTEIN",
    "pilot": true
  },
  {
    "slug": "free-party",
    "title": "Free Party",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "FREE-PARTY",
    "pilot": false
  },
  {
    "slug": "glitch",
    "title": "Glitch",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "GLITCH",
    "pilot": false
  },
  {
    "slug": "hooked",
    "title": "Hooked",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "HOOKED",
    "pilot": false
  },
  {
    "slug": "isan-bedtime-stories",
    "title": "Isan Bedtime Stories for Children",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "ISAN-BEDTIME-STORIES",
    "pilot": false
  },
  {
    "slug": "its-only-me",
    "title": "It's Only Me",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "ITS-ONLY-ME",
    "pilot": false
  },
  {
    "slug": "kings-road",
    "title": "The King's Road",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "KINGS-ROAD",
    "pilot": false
  },
  {
    "slug": "last-exodus",
    "title": "The Last Exodus",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "LAST-EXODUS",
    "pilot": false
  },
  {
    "slug": "last-road-stroud",
    "title": "Last Road to Stroud",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "LAST-ROAD-STROUD",
    "pilot": false
  },
  {
    "slug": "lion-witch-wardrobe",
    "title": "The Lion, the Witch and the Wardrobe",
    "pricingClass": "classic",
    "territoryMode": "restricted",
    "skuBase": "LION-WITCH-WARDROBE",
    "pilot": false
  },
  {
    "slug": "lovelock-manor",
    "title": "The Secret of Lovelock Manor",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "LOVELOCK-MANOR",
    "pilot": false
  },
  {
    "slug": "made-for-me",
    "title": "Made for Me",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "MADE-FOR-ME",
    "pilot": false
  },
  {
    "slug": "monaloy",
    "title": "Mondaloy",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "MONDALOY",
    "pilot": false
  },
  {
    "slug": "murder-at-vicarage",
    "title": "The Murder at the Vicarage",
    "pricingClass": "classic",
    "territoryMode": "restricted",
    "skuBase": "MURDER-AT-VICARAGE",
    "pilot": false
  },
  {
    "slug": "nice-knowing-you",
    "title": "Nice Knowing You",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "NICE-KNOWING-YOU",
    "pilot": false
  },
  {
    "slug": "project-2025",
    "title": "Project 2025: For The Balanced Individual",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "PROJECT-2025",
    "pilot": false
  },
  {
    "slug": "psychic-service",
    "title": "His Majesty's Psychic Service",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "PSYCHIC-SERVICE",
    "pilot": false
  },
  {
    "slug": "redacted-volume-i",
    "title": "[REDACTED] — Volume I",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "REDACTED-VOLUME-I",
    "pilot": false
  },
  {
    "slug": "redacted-volume-ii",
    "title": "[REDACTED] — Volume II",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "REDACTED-VOLUME-II",
    "pilot": false
  },
  {
    "slug": "sex-with-aliens",
    "title": "Sex with Aliens",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "SEX-WITH-ALIENS",
    "pilot": false
  },
  {
    "slug": "sex-with-robots",
    "title": "Sex with Robots",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "SEX-WITH-ROBOTS",
    "pilot": false
  },
  {
    "slug": "sleepless-man",
    "title": "The Sleepless Man",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "SLEEPLESS-MAN",
    "pilot": false
  },
  {
    "slug": "sugar-dragon",
    "title": "Sugar Dragon",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "SUGAR-DRAGON",
    "pilot": false
  },
  {
    "slug": "time-machine",
    "title": "The Time Machine",
    "pricingClass": "classic",
    "territoryMode": "standard",
    "skuBase": "TIME-MACHINE",
    "pilot": false
  },
  {
    "slug": "trace",
    "title": "TRACE",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "TRACE",
    "pilot": false
  },
  {
    "slug": "trion-ascension",
    "title": "Trion: Ascension",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "TRION-ASCENSION",
    "pilot": false
  },
  {
    "slug": "trion",
    "title": "Trion",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "TRION",
    "pilot": false
  },
  {
    "slug": "uncanny-valley",
    "title": "Uncanny Valley",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "UNCANNY-VALLEY",
    "pilot": false
  },
  {
    "slug": "war-of-the-worlds",
    "title": "The War of the Worlds",
    "pricingClass": "classic",
    "territoryMode": "standard",
    "skuBase": "WAR-OF-THE-WORLDS",
    "pilot": false
  },
  {
    "slug": "what-is-happening-now-2027",
    "title": "What Is Happening Now? 2027",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "WHAT-IS-HAPPENING-NOW-2027",
    "pilot": false
  },
  {
    "slug": "what-is-happening-now",
    "title": "What Is Happening Now?",
    "pricingClass": "owned",
    "territoryMode": "standard",
    "skuBase": "WHAT-IS-HAPPENING-NOW",
    "pilot": false
  }
]);
export const PRODUCTS=Object.freeze(TITLES.flatMap(title=>EDITION_TYPES.map(edition=>Object.freeze({
  sku:title.skuBase+"-"+edition.suffix,
  slug:title.slug,
  title:title.title,
  pricingClass:title.pricingClass,
  territoryMode:title.territoryMode,
  pilot:title.pilot,
  type:edition.key,
  edition:edition.label,
  description:edition.description,
  amount:PRICE_TABLE[title.pricingClass][edition.key],
  currency:CURRENCY
}))));
const PRODUCT_INDEX=new Map(PRODUCTS.map(product=>[product.sku,product]));
export function getProduct(sku){return PRODUCT_INDEX.get(sku)||null;}
export function productsForTitle(slug){return PRODUCTS.filter(product=>product.slug===slug);}
