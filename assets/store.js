(function copyRealDirectStore(){
  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='/assets/store.css';
  document.head.appendChild(css);

  const path=window.location.pathname.replace(/\/+$/,'/');

  // Catalogue: cover/title clicks open the Copy Real title page at Buy Direct.
  if(path==='/books/'){
    document.querySelectorAll('a.book-card[href]').forEach(link=>{
      const target=new URL(link.getAttribute('href'),window.location.href);
      if(/^\/books\/[^/]+\/$/.test(target.pathname)){
        target.hash='buy-direct';
        link.href=target.pathname+target.hash;
      }
    });
    return;
  }

  if(!/^\/books\/[^/]+\/$/.test(path)) return;

  const detail=document.querySelector('main .detail > div:last-child');
  if(!detail) return;

  function paymentMarkup(edition){
    return `<div class="payment-options" aria-label="Payment options for ${edition}"><button class="store-buy" type="button" disabled data-provider="stripe" title="Direct purchasing will be enabled when this edition is available">Buy with card / wallet</button><button class="store-buy secondary" type="button" disabled data-provider="paypal" title="PayPal will be enabled when this edition is available">PayPal</button></div><span class="store-status">Unavailable for now</span>`;
  }

  // Frankenstein and The Time Machine were prototypes. Upgrade their existing
  // cards with the same payment-ready controls instead of duplicating sections.
  let section=document.querySelector('.direct-store');
  if(section){
    // Older prototype markup already places #buy-direct on its heading. Keep
    // that anchor rather than creating a duplicate id on the section itself.
    if(!section.id && !section.querySelector('#buy-direct')) section.id='buy-direct';
    section.querySelectorAll('.edition-card').forEach(card=>{
      if(card.querySelector('.payment-options')) return;
      const heading=card.querySelector('h3')?.textContent.trim()||'this edition';
      const status=card.querySelector('.store-status');
      if(status) status.insertAdjacentHTML('beforebegin',paymentMarkup(heading).replace('<span class="store-status">Unavailable for now</span>',''));
    });
    if(!section.querySelector('.checkout-note')){
      const privacy=section.querySelector('.privacy-note');
      const note=document.createElement('p');
      note.className='checkout-note';
      note.innerHTML='<strong>Checkout:</strong> Stripe will handle card and supported wallet payments; PayPal will be available as an alternative. Payment details are handled by the payment provider, not stored by Copy Real.';
      if(privacy) section.insertBefore(note,privacy); else section.appendChild(note);
    }
    return;
  }

  section=document.createElement('section');
  section.className='direct-store';
  section.id='buy-direct';
  section.setAttribute('aria-labelledby','buy-direct-heading');
  section.innerHTML=`<div class="kicker gold">Buy direct from Copy Real</div><h2 id="buy-direct-heading">Choose your edition</h2><p class="store-intro">Purchase the edition you want directly from the publisher. No Copy Real account or subscription is required.</p><div class="edition-grid"><article class="edition-card"><h3>eBook</h3><p>Digital reading edition for your own library.</p>${paymentMarkup('eBook')}</article><article class="edition-card"><h3>Pure Narration</h3><p>The complete audiobook with human narration and no cinematic sound design.</p>${paymentMarkup('Pure Narration')}</article><article class="edition-card"><h3>Cinematic Effects</h3><p>The complete CFX audiobook edition with cinematic sound design.</p>${paymentMarkup('Cinematic Effects')}</article></div><p class="checkout-note"><strong>Checkout:</strong> Stripe will handle card and supported wallet payments; PayPal will be available as an alternative. Payment details are handled by the payment provider, not stored by Copy Real.</p><p class="privacy-note"><strong>Privacy first.</strong> We do not create customer profiles or require registration. When direct purchasing is enabled, we will collect only the information necessary to process the transaction, deliver the purchase and meet our legal and accounting obligations. We do not sell customer information.</p>`;

  const notice=detail.querySelector('.notice')?.parentElement;
  if(notice) detail.insertBefore(section,notice); else detail.appendChild(section);
})();
