const menu=document.querySelector('.menu-btn');const links=document.querySelector('.nav-links');if(menu&&links){menu.addEventListener('click',()=>{links.classList.toggle('open');menu.setAttribute('aria-expanded',links.classList.contains('open'))})}
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('[data-category]').forEach(card=>{card.style.display=(f==='all'||card.dataset.category.split(' ').includes(f))?'block':'none'})}));

const catalogueSearch=document.querySelector('[data-catalogue-search]');
if(catalogueSearch){catalogueSearch.addEventListener('input',()=>{const q=catalogueSearch.value.trim().toLowerCase();document.querySelectorAll('[data-search]').forEach(card=>{card.style.display=(!q||card.dataset.search.toLowerCase().includes(q))?'block':'none'})})}

/* Retail links -----------------------------------------------------------
   Book catalogue cards continue to open the Copy Real title page first.
   On each individual book page we add a purchase button for Amazon UK.
   Where a verified KDP ASIN is known we link directly to the product page;
   otherwise an exact title + author Amazon Books search is used so no
   unverified ASIN is ever guessed. No affiliate tracking is applied. */
(function addAmazonPurchaseLink(){
  const path=window.location.pathname.replace(/\/+$/,'/');
  if(!/^\/books\/[^/]+\/$/.test(path)) return;

  const titleEl=document.querySelector('main h1');
  if(!titleEl) return;
  const title=titleEl.textContent.trim();
  const author=(document.querySelector('.subtitle')?.textContent||'').trim();

  const verifiedAmazon={
    'Project 2025':'https://www.amazon.co.uk/dp/B0F6VLJBNC',
    'Project 2025: For The Balanced Individual':'https://www.amazon.co.uk/dp/B0F6VLJBNC',
    'What Is Happening Now?':'https://www.amazon.co.uk/dp/B0H3C32ZDP',
    'What Is Happening Now':'https://www.amazon.co.uk/dp/B0H3C32ZDP'
  };

  const query=[title,author].filter(Boolean).join(' ');
  const amazonUrl=verifiedAmazon[title]||('https://www.amazon.co.uk/s?k='+encodeURIComponent(query)+'&i=stripbooks');

  let actions=document.querySelector('main .actions');
  if(!actions){
    actions=document.createElement('div');
    actions.className='actions';
    const detail=document.querySelector('main .detail > div:last-child')||document.querySelector('main');
    detail.appendChild(actions);
  }

  if(actions.querySelector('[data-amazon-buy]')) return;
  const buy=document.createElement('a');
  buy.className='btn primary';
  buy.href=amazonUrl;
  buy.target='_blank';
  buy.rel='noopener noreferrer';
  buy.dataset.amazonBuy='';
  buy.textContent='Buy on Amazon';
  buy.setAttribute('aria-label','Buy '+title+' on Amazon UK');
  actions.prepend(buy);

  const note=document.createElement('div');
  note.className='fine';
  note.style.marginTop='10px';
  note.textContent='Amazon availability and formats may vary by country.';
  actions.insertAdjacentElement('afterend',note);
})();
