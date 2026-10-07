(function copyRealStoreIntegration(){
  const nav=document.querySelector(".site-header .nav-links");
  if(nav&&!nav.querySelector("[data-direct-store-nav]")){
    const link=document.createElement("a");link.href="/store/";link.textContent="Store";link.dataset.directStoreNav="";
    if(location.pathname.startsWith("/store/")){link.classList.add("active");link.setAttribute("aria-current","page");}
    const audio=[...nav.querySelectorAll("a")].find(a=>/\/audio\/?$/.test(new URL(a.href,location.href).pathname));
    if(audio)audio.insertAdjacentElement("afterend",link);else nav.appendChild(link);
  }
  const path=location.pathname.replace(/\/+$/,"/");
  if(!/^\/books\/[^/]+\/$/.test(path))return;
  const slug=path.split("/").filter(Boolean).at(-1);
  const actions=document.querySelector("main .actions");
  if(!actions||actions.querySelector("[data-direct-store-buy]"))return;
  const direct=document.createElement("a");direct.className="btn";direct.dataset.directStoreBuy="";direct.href="/store/?title="+encodeURIComponent(slug)+"#title-"+encodeURIComponent(slug);direct.textContent="Buy direct";
  const amazon=actions.querySelector("[data-amazon-buy]");if(amazon)amazon.insertAdjacentElement("beforebegin",direct);else actions.prepend(direct);
})();