const menu=document.querySelector('.menu-btn');const links=document.querySelector('.nav-links');if(menu&&links){menu.addEventListener('click',()=>{links.classList.toggle('open');menu.setAttribute('aria-expanded',links.classList.contains('open'))})}
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('[data-category]').forEach(card=>{card.style.display=(f==='all'||card.dataset.category.split(' ').includes(f))?'block':'none'})}));

const catalogueSearch=document.querySelector('[data-catalogue-search]');
if(catalogueSearch){catalogueSearch.addEventListener('input',()=>{const q=catalogueSearch.value.trim().toLowerCase();document.querySelectorAll('[data-search]').forEach(card=>{card.style.display=(!q||card.dataset.search.toLowerCase().includes(q))?'block':'none'})})}

/* Retail links -----------------------------------------------------------
   Book catalogue cards continue to open the Copy Real title page first.
   On each individual book page we add a purchase button for Amazon UK and
   make the displayed cover itself open the same purchase destination.
   Where a verified KDP ASIN is known we link directly to the product page;
   otherwise an exact KDP-style title + author Amazon Books search is used so
   no unverified ASIN is ever guessed. No affiliate tracking is applied. */
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

  const kdpSearchTitles={
    "It's Only Me":"It's Only Me: The Talk Radio Host Who Became Prime Minister",
    '42':'42: A Novel of Love, Data, and the Price of Certainty',
    'Hooked':'Hooked: The Secret Trade in Mermaids',
    'What Is Happening Now?':'What Is Happening Now: How to Navigate It',
    'Uncanny Valley':'Uncanny Valley',
    'Trion: Ascension':'Trion: Ascension',
    'Nice Knowing You':'Nice Knowing You',
    'Monaloy':'Monaloy',
    '[REDACTED] — Volume II':'[REDACTED] Volume II: A Compendium of Contemporary Folklore and Digital Myth',
    '[REDACTED]':'[REDACTED]: The Backrooms and Contemporary Digital Myth',
    'Nineteen Eighty-Four':'1984: The Illustrated 2025 Edition',
    '1984':'1984: The Illustrated 2025 Edition',
    'The Time Machine':'The Time Machine: A Scholarly Compendium Edition',
    'The War of the Worlds':'The War of the Worlds: A Scholarly Compendium Edition',
    'TRACE':'TRACE: Every Signal Leaves One',
    'Glitch':'GLITCH: It was never about the shooting',
    'Free Party':'Free Party: An Explicit Biographical Account of Rave and Free Party Culture in the Late Twentieth Century',
    "An Actor's Survival Guide":"An Actor's Survival Guide",
    "An Actor's Monologue Bible: Actors Companion — Vol. 2":"The Actor's Companion Volume 2: 101 Monologues",
    'Actors Companion — Vol. 3':"The Actor's Companion: 101 Monologues",
    'Frankenstein':'Frankenstein; or, the Modern Prometheus: A Scholarly Compendium Edition',
    'The Last Exodus':'The Last Exodus: A Chronicle of the First Interstellar Colony',
    'Made for Me':'Made for Me: Love demands a rewrite',
    'The Secret of Lovelock Manor':'The Secret of Lovelock Manor',
    'Last Road to Stroud':'Last Road Stroud',
    'Dead Famous':'Dead Famous: Afterlife Interviews, Volume 1',
    'The Murder at the Vicarage':'The Murder at the Vicarage: A Collector’s Edition',
    "The Boy They Wouldn't Name":"The Boy They Wouldn't Name",
    'A Christmas Carol':'A Christmas Carol',
    'Trion':'Trion: A New Genesis',
    'The Coming Race':'The Coming Race: Edward Bulwer-Lytton’s Classic',
    'The Blood That Binds':'The Blood That Binds',
    'Darkness and Dawn':'Darkness & Dawn: Modern English 2025 Edition',
    'Sex with Aliens':'Sex with Aliens: twenty-four REALLY close encounters',
    'Isan Bedtime Stories for Children':'Isan Bedtime Stories for Children'
  };

  const searchTitle=kdpSearchTitles[title]||title;
  const query=[searchTitle,author].filter(Boolean).join(' ');
  const amazonUrl=verifiedAmazon[title]||('https://www.amazon.co.uk/s?k='+encodeURIComponent(query)+'&i=stripbooks');

  let actions=document.querySelector('main .actions');
  if(!actions){
    actions=document.createElement('div');
    actions.className='actions';
    const detail=document.querySelector('main .detail > div:last-child')||document.querySelector('main');
    detail.appendChild(actions);
  }

  if(!actions.querySelector('[data-amazon-buy]')){
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
  }

  const cover=document.querySelector('main .detail-cover');
  if(cover && !cover.closest('[data-amazon-cover]')){
    const coverLink=document.createElement('a');
    coverLink.href=amazonUrl;
    coverLink.target='_blank';
    coverLink.rel='noopener noreferrer';
    coverLink.dataset.amazonCover='';
    coverLink.title='Buy '+title+' on Amazon UK';
    cover.parentNode.insertBefore(coverLink,cover);
    coverLink.appendChild(cover);
  }
})();
