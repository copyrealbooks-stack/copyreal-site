const menu=document.querySelector('.menu-btn');const links=document.querySelector('.nav-links');if(menu&&links){menu.addEventListener('click',()=>{links.classList.toggle('open');menu.setAttribute('aria-expanded',links.classList.contains('open'))})}
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('[data-category]').forEach(card=>{card.style.display=(f==='all'||card.dataset.category.split(' ').includes(f))?'block':'none'})}));

const catalogueSearch=document.querySelector('[data-catalogue-search]');
if(catalogueSearch){catalogueSearch.addEventListener('input',()=>{const q=catalogueSearch.value.trim().toLowerCase();document.querySelectorAll('[data-search]').forEach(card=>{card.style.display=(!q||card.dataset.search.toLowerCase().includes(q))?'block':'none'})})}
