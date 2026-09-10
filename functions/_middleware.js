export async function onRequest(context) {
  const requestUrl = new URL(context.request.url);
  const hostname = requestUrl.hostname.toLowerCase();

  // Leave the normal CopyReal.com site and preview domains untouched.
  if (hostname !== 'almanac.copyreal.com') {
    return context.next();
  }

  const path = requestUrl.pathname;

  // If somebody arrives with the old /almanac/ prefix on the dedicated
  // subdomain, normalise it to the clean subdomain URL.
  if (path === '/almanac' || path.startsWith('/almanac/')) {
    const clean = new URL(context.request.url);
    clean.pathname = path === '/almanac' ? '/' : path.slice('/almanac'.length);
    return Response.redirect(clean.toString(), 301);
  }

  // Routes which belong to the parent Copy Real site should leave the
  // Almanac subdomain rather than being presented as Almanac content.
  const parentSitePrefixes = [
    '/books/',
    '/audio/',
    '/series/',
    '/authors/',
    '/public-domain/',
    '/coming-soon/',
    '/contact/'
  ];
  if (parentSitePrefixes.some(prefix => path.startsWith(prefix))) {
    const parent = new URL(context.request.url);
    parent.hostname = 'copyreal.com';
    parent.protocol = 'https:';
    return Response.redirect(parent.toString(), 302);
  }

  // The Almanac uses a small number of shared Copy Real assets (favicon and
  // the 2026 cover). Those remain at the parent site's root asset path.
  if (path.startsWith('/assets/') &&
      path !== '/assets/almanac.css' &&
      path !== '/assets/almanac.js') {
    return context.next();
  }

  // Serve the dedicated Almanac build at the subdomain root without exposing
  // /almanac/ in the visitor-facing URL.
  const assetUrl = new URL(context.request.url);
  assetUrl.pathname = `/almanac${path === '/' ? '/' : path}`;
  return context.env.ASSETS.fetch(new Request(assetUrl, context.request));
}
