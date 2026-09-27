(function copyRealDirectStore(){
  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='/assets/store.css';
  document.head.appendChild(css);

  const path=window.location.pathname.replace(/\/+$/,'/');

  // Catalogue: a cover/title click opens the normal title page at its purchase area.
  if(path==='/books/'){
    document.querySelectorAll('a[href^="/books/"],a[href^="./"],a[href^="../books/"]').forEach(link=>{
      const href=link.getAttribute('href');
      if(!href || href.includes('#') || href==='/books/' || href==='./') return;
      if(/\/books\/[^/]+\/?$/.test(new URL(href,window.location.href).pathname)) link.href=href.replace(/#.*$/,'')+'#buy-direct';
    });
    return;
  }

  if(!/^\/books\/[^/]+\/$/.test(path)) return;

  // Frankenstein and The Time Machine were the prototypes; reuse their existing section.
  if(document.querySelector('#buy-direct')) return;

  const detail=document.querySelector('main .detail > div:last-child');
  if(!detail) return;

  const section=document.createElement('section');
  section.className='direct-store';
  section.setAttribute('aria-labelledby','buy-direct');
  section.innerHTML=`<div class="kicker gold">Buy direct from Copy Real</div><h2 id="buy-direct">Choose your edition</h2><p class="store-intro">Purchase the edition you want directly from the publisher. No Copy Real account or subscription is required.</p><div class="edition-grid"><article class="edition-card"><h3>eBook</h3><p>Digital reading edition for your own library.</p><span class="store-status">Unavailable for now</span></article><article class="edition-card"><h3>Pure Narration</h3><p>The complete audiobook with human narration and no cinematic sound design.</p><span class="store-status">Unavailable for now</span></article><article class="edition-card"><h3>Cinematic Effects</h3><p>The complete CFX audiobook edition with cinematic sound design.</p><span class="store-status">Unavailable for now</span></article></div><p class="privacy-note"><strong>Privacy first.</strong> We do not create customer profiles or require registration. When direct purchasing is enabled, we will collect only the information necessary to process the transaction, deliver the purchase and meet our legal and accounting obligations. We do not sell customer information.</p>`;

  const notice=detail.querySelector('.notice')?.parentElement;
  if(notice) detail.insertBefore(section,notice); else detail.appendChild(section);
})();
