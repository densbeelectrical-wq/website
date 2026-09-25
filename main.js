/* Densbe Electrical — shared site script */
(function () {
  'use strict';
  const D = window.DENSBE || { categories: [], products: [], brands: [], brandLogos: [], applications: [], techs: [] };
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const params = new URLSearchParams(location.search);
  const page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';

  /* Set this to a form endpoint (e.g. Formspree / Web3Forms / your own API) to receive
     enquiries + photo uploads directly. Leave blank to fall back to the visitor's email client. */
  const FORM_ENDPOINT = '';
  const SALES_EMAIL = 'sales@densbe-electric.com';
  const WHATSAPP = '6590223133'; // +65 9022 3133 (24/7 mobile line)
  const waLink = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg || 'Hi Densbe, I would like to enquire about a product.')}`;

  const I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg>',
    cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3.3 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.2-.7.2l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.4-.5-.6-.5h-.7z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>'
  };
  window.DENSBE_ICONS = I;

  const cats = D.categories, prods = D.products;
  const catBy = {}; cats.forEach(c => catBy[c.slug] = c);
  const prodBy = {}; prods.forEach(p => prodBy[p.id] = p);
  const mainCats = cats.filter(c => c.group === 'products');
  const estoreCats = cats.filter(c => c.group === 'estore' && c.count > 0);
  const appLabel = {}; D.applications.forEach(a => appLabel[a[0]] = a[1]);
  const techLabel = {}; D.techs.forEach(t => techLabel[t[0]] = t[1]);
  const isEx = p => (p.tech || []).includes('explosion-proof');
  const catLink = s => 'products.html?cat=' + encodeURIComponent(s);
  const prodLink = p => 'product.html?id=' + p.id;

  /* ---------- Header / footer ---------- */
  function renderHeader() {
    const h = $('#site-header'); if (!h) return;
    const act = n => (page === n ? ' class="active"' : '');
    const li = (c, showCount) => `<a href="${catLink(c.slug)}"><span>${esc(c.label)}</span>${showCount ? `<small>${c.count}</small>` : ''}</a>`;
    h.innerHTML = `
    <div class="topbar"><div class="container">
      <div class="tb-left"><a href="tel:+6590223133">${I.phone}<span>+65 9022 3133 · Available 24/7</span></a><a href="${waLink()}" target="_blank" rel="noopener" class="tb-wa">${I.wa}<span>WhatsApp</span></a></div>
      <div class="tb-right"><a href="mailto:${SALES_EMAIL}">${I.mail}<span>${SALES_EMAIL}</span></a><a href="contact.html">${I.pin}<span class="hide-m">403 Race Course Road, Singapore 218653</span></a></div>
    </div></div>
    <header class="header" id="hdr"><div class="container">
      <a class="logo" href="index.html" aria-label="Densbe Electrical home"><img src="assets/site/logo.png" alt="Densbe Electrical"></a>
      <nav aria-label="Main"><ul class="nav">
        <li${act('about')}><a href="about.html">About Us</a></li>
        <li${act('products')}><a href="products.html">Products ${I.chev}</a>
          <div class="mega">${mainCats.map(c => li(c, true)).join('')}<a class="mega-all" href="products.html">View all products ${I.arrow}</a></div></li>
        <li><a href="products.html?group=estore">E-Store ${I.chev}</a>
          <div class="mega mega-wide">${estoreCats.map(c => li(c, true)).join('')}<a class="mega-all" href="products.html?group=estore">Browse the full E-Store ${I.arrow}</a></div></li>
        <li${act('brands')}><a href="brands.html">Brands</a></li>
        <li${act('contact')}><a href="contact.html">Contact Us</a></li>
      </ul></nav>
      <div class="hdr-actions">
        <a class="icon-btn" href="index.html#finder" aria-label="Search products">${I.search}</a>
        <button class="icon-btn" id="enq-open" aria-label="Enquiry list">${I.list}<span class="badge" id="enq-badge" data-n="0"></span></button>
        <a class="btn btn-red btn-sm hdr-cta" href="contact.html">Get a quote</a>
        <button class="burger" id="burger" aria-label="Menu"><i></i><i></i><i></i></button>
      </div>
    </div></header>
    <div class="drawer" id="drawer"><div class="scrim"></div><div class="panel">
      <button class="close" aria-label="Close menu">×</button>
      <a class="top" href="index.html">Home</a>
      <a class="top" href="about.html">About Us</a>
      <details><summary>Products</summary>${mainCats.map(c => `<a href="${catLink(c.slug)}">${esc(c.label)}</a>`).join('')}<a href="products.html"><b>View all products</b></a></details>
      <details><summary>E-Store</summary>${estoreCats.map(c => `<a href="${catLink(c.slug)}">${esc(c.label)}</a>`).join('')}</details>
      <a class="top" href="brands.html">Brands</a>
      <a class="top" href="contact.html">Contact Us</a>
      <a class="btn btn-red" href="contact.html">Get a quote</a>
      <a class="btn btn-ghost" href="index.html#finder">Search products</a>
    </div></div>`;
    const dr = $('#drawer');
    $('#burger').onclick = () => { dr.classList.add('open'); document.body.classList.add('no-scroll'); };
    const closeDr = () => { dr.classList.remove('open'); document.body.classList.remove('no-scroll'); };
    $('.scrim', dr).onclick = closeDr; $('.close', dr).onclick = closeDr;
    $('#enq-open').onclick = openEnq;
    window.addEventListener('scroll', () => $('#hdr').classList.toggle('scrolled', scrollY > 10), { passive: true });
  }

  function renderFooter() {
    const f = $('#site-footer'); if (!f) return;
    f.innerHTML = `<footer class="footer"><div class="container">
      <div class="footer-grid">
        <div><img class="flogo" src="assets/site/logo.png" alt="Densbe Electrical">
          <h5>Densbe Electrical S'pore Pte Ltd</h5>
          <p class="addr">No. 403 Race Course Road<br>Singapore 218653<br><br>
          Mobile: <a href="tel:+6590223133">+65 9022 3133</a> <span style="opacity:.6">(available 24/7)</span><br>
          Tel: <a href="tel:+6564473744">+65 6447 3744</a><br>
          Email: <a href="mailto:${SALES_EMAIL}">${SALES_EMAIL}</a><br><a href="mailto:densbe@singnet.com.sg">densbe@singnet.com.sg</a></p></div>
        <div><h5>Information</h5><ul>
          <li><a href="index.html">Home</a></li><li><a href="about.html">About Us</a></li><li><a href="products.html">Products</a></li>
          <li><a href="products.html?group=estore">E-Store</a></li><li><a href="brands.html">Brands</a></li><li><a href="contact.html">Contact Us</a></li></ul></div>
        <div><h5>Account</h5><ul>
          <li><a href="#" data-enq>Enquiry List</a></li><li><a href="contact.html">Request a Quote</a></li>
          <li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms &amp; Conditions</a></li></ul></div>
      </div>
      <div class="footer-bottom"><span>© ${new Date().getFullYear()} Densbe Electrical S'pore Pte Ltd. All rights reserved.</span><span>Established 1983 · Singapore</span></div>
    </div></footer>
    <div class="enq" id="enq"><div class="scrim"></div><div class="panel">
      <div class="head"><h3>Enquiry list</h3><button aria-label="Close">×</button></div>
      <div class="list" id="enq-list"></div>
      <div class="foot"><p>Add the items you need, then send the list to our team. We reply with stock, lead time and pricing.</p>
        <button class="btn btn-red btn-block" id="enq-send">Send enquiry ${I.arrow}</button>
        <a class="btn btn-wa btn-block" id="enq-wa" href="${waLink()}" target="_blank" rel="noopener">${I.wa} Send via WhatsApp</a>
        <button class="btn btn-ghost btn-block btn-sm" id="enq-clear">Clear list</button></div>
    </div></div>
    <div class="modal" id="modal"><div class="scrim"></div><div class="dialog" role="dialog" aria-modal="true"><button class="m-close" aria-label="Close">×</button><div id="modal-body"></div></div></div>
    <a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat with Densbe on WhatsApp"><span class="wa-label">Chat on WhatsApp</span><span class="wa-icon">${I.wa}</span></a>
    <div class="toast" id="toast"></div>
    <div class="lightbox" id="lightbox"><img alt=""></div>`;
    $$('[data-enq]').forEach(a => a.onclick = e => { e.preventDefault(); openEnq(); });
    const en = $('#enq');
    $('.scrim', en).onclick = closeEnq; $('.head button', en).onclick = closeEnq;
    $('#enq-clear').onclick = () => { if (confirm('Clear your enquiry list?')) { saveEnq({}); renderEnq(); } };
    $('#enq-send').onclick = () => { if (!Object.keys(getEnq()).length) return toast('Your enquiry list is empty.'); location.href = 'contact.html?enquiry=1'; };
    $('#lightbox').onclick = () => $('#lightbox').classList.remove('open');
    $('#modal .scrim').onclick = closeModal; $('#modal .m-close').onclick = closeModal;
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  /* ---------- Modal ---------- */
  function openModal(html) { $('#modal-body').innerHTML = html; $('#modal').classList.add('open'); document.body.classList.add('no-scroll'); }
  function closeModal() { const m = $('#modal'); if (m) { m.classList.remove('open'); document.body.classList.remove('no-scroll'); } }
  function mailFor(p, qty) { return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent('Enquiry: ' + p.name)}&body=${encodeURIComponent('Hi Densbe,\n\nPlease quote for the following item:\n\nProduct: ' + p.name + (p.model ? '\nModel / Code: ' + p.model : '') + (p.brand ? '\nBrand: ' + p.brand : '') + '\nCategory: ' + p.cat + '\nQuantity: ' + (qty || 1) + '\n\nDelivery location:\nRequired by:\n\nName:\nCompany:\nContact no.:')}`; }
  function productModal(p) {
    openModal(`<div class="m-prod">
      <div class="m-img"><img src="${p.img}" alt="${esc(p.name)}"></div>
      <div class="m-txt"><div class="cat">${esc(p.cat)}</div><h3>${esc(p.name)}</h3>${p.model ? `<div class="model">Model / Code: <b>${esc(p.model)}</b></div>` : ''}
        <p>What would you like to do with this item?</p>
        <div class="m-qty"><span>Qty</span><div class="qty"><button id="m-minus">−</button><input id="m-qty" value="1" inputmode="numeric"><button id="m-plus">+</button></div></div>
        <div class="m-actions">
          <button class="btn btn-red" id="m-add">${I.plus} Add to enquiry list</button>
          <a class="btn btn-dark" id="m-mail" href="${mailFor(p, 1)}">${I.mail} Email us about this item</a>
          <a class="btn btn-wa" id="m-wa" href="${waLink('Hi Densbe, please quote for: ' + p.name + (p.model ? ' (' + p.model + ')' : '') + '. Quantity: 1')}" target="_blank" rel="noopener">${I.wa} WhatsApp us about this item</a>
          <a class="btn btn-ghost" href="${prodLink(p)}">View in store ${I.arrow}</a>
        </div></div></div>`);
    const q = $('#m-qty'); const getQ = () => Math.max(1, parseInt(q.value) || 1);
    const sync = () => { $('#m-mail').href = mailFor(p, getQ()); $('#m-wa').href = waLink('Hi Densbe, please quote for: ' + p.name + (p.model ? ' (' + p.model + ')' : '') + '. Quantity: ' + getQ()); };
    $('#m-minus').onclick = () => { q.value = Math.max(1, getQ() - 1); sync(); }; $('#m-plus').onclick = () => { q.value = getQ() + 1; sync(); }; q.oninput = sync;
    $('#m-add').onclick = () => { const src = $('.m-img img'); closeModal(); addEnq(p.id, getQ(), false, src); };
  }
  function resultsModal(r, v, allUrl) {
    openModal(`<div class="m-results">
      <div class="m-rhead"><span class="eyebrow">Search results</span><h3>${r.length} item${r.length > 1 ? 's' : ''} found for “${esc(v)}”</h3><p>Select an item to enquire, email us about it, or view it in the store.</p></div>
      <div class="m-rlist">${r.slice(0, 8).map(p => `<button type="button" class="m-ritem" data-pid="${p.id}"><img src="${p.img}" alt=""><div><b>${hl(p.name, v)}</b><span>${esc(p.cat)}${p.model ? ' · ' + esc(p.model) : ''}</span></div>${I.arrow}</button>`).join('')}</div>
      <div class="m-rfoot"><a class="btn btn-ghost btn-sm" href="${allUrl}">${r.length > 8 ? 'See all ' + r.length + ' results in store' : 'View these in the store'} ${I.arrow}</a>
        <a class="btn btn-dark btn-sm" href="contact.html?subject=${encodeURIComponent('Enquiry: ' + v)}&msg=${encodeURIComponent('Hi Densbe,\n\nI am looking for: ' + v + '\nQuantity:\nBrand (if known):\nDelivery location:\nRequired by:')}">${I.mail} Not the right item? Email us</a></div></div>`);
    $$('.m-ritem').forEach(b => b.onclick = () => productModal(prodBy[b.dataset.pid]));
  }
  function noMatchModal(v) {
    const subject = 'Enquiry: ' + v; const msg = 'Hi Densbe,\n\nI could not find the following item in your online store. Please advise availability, price and lead time:\n\nItem / part number: ' + v + '\nQuantity:\nBrand (if known):\nDelivery location:\nRequired by:';
    openModal(`<div class="m-none">
      <div class="m-icon">${I.search}</div>
      <h3>No item found in online store</h3>
      <p>“${esc(v)}” isn't listed online yet, but we can still supply it. Send us an email enquiry and our team will reply with availability, price and lead time.</p>
      <div class="m-actions">
        <a class="btn btn-red" href="contact.html?subject=${encodeURIComponent(subject)}&msg=${encodeURIComponent(msg)}">${I.mail} Email enquiry for this item</a>
        <a class="btn btn-wa" href="${waLink('Hi Densbe, I am looking for: ' + v + '. Please advise availability, price and lead time.')}" target="_blank" rel="noopener">${I.wa} WhatsApp us instead</a>
        <a class="btn btn-ghost" href="products.html">Browse the online store ${I.arrow}</a>
      </div></div>`);
  }

  /* ---------- Enquiry list (localStorage) ---------- */
  const KEY = 'densbe_enquiry';
  const getEnq = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const saveEnq = o => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } updateBadge(); $$('.enq-toggle').forEach(b => b.classList.toggle('on', !!o[b.dataset.id])); };
  function updateBadge() { const n = Object.values(getEnq()).reduce((a, b) => a + b, 0); const b = $('#enq-badge'); if (b) { b.textContent = n || ''; b.dataset.n = n; } }
  function addEnq(id, qty, quiet, fromEl) {
    const o = getEnq(); o[id] = (o[id] || 0) + (qty || 1); saveEnq(o); const p = prodBy[id];
    flyToEnq(fromEl, p); if (!quiet) toast(`<b>Added to enquiry list</b><span>${esc(p ? p.name : '')}</span>`, true, p && p.img);
  }
  function toggleEnq(id, fromEl) { const o = getEnq(); if (o[id]) { delete o[id]; saveEnq(o); toast('Removed from enquiry list'); } else addEnq(id, 1, false, fromEl); }
  function flyToEnq(fromEl, p) {
    const target = $('#enq-open'); if (!target || !p) return;
    const src = fromEl && (fromEl.closest('.prod-card, .m-prod, .pd, .enq-item, .m-ritem') || fromEl.parentElement); const img = src && src.querySelector('img');
    const from = (img || fromEl || target).getBoundingClientRect(); const to = target.getBoundingClientRect();
    const size = Math.min(110, Math.max(56, from.width)); const sx = from.left + from.width / 2 - size / 2, sy = from.top + from.height / 2 - size / 2;
    const ex = to.left + to.width / 2 - size / 2, ey = to.top + to.height / 2 - size / 2;
    const ghost = document.createElement('div'); ghost.className = 'fly-ghost'; ghost.style.cssText = `width:${size}px;height:${size}px;left:${sx}px;top:${sy}px`; ghost.innerHTML = `<img src="${p.img}" alt="">`; document.body.appendChild(ghost);
    const dx = ex - sx, dy = ey - sy;
    const anim = ghost.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1, offset: 0 },
      { transform: `translate(${dx * .45}px, ${Math.min(dy, 0) - 140}px) scale(.85)`, opacity: 1, offset: .5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.18)`, opacity: .6, offset: 1 }
    ], { duration: 820, easing: 'cubic-bezier(.35,0,.25,1)', fill: 'forwards' });
    anim.onfinish = () => { ghost.remove(); target.classList.remove('bump'); void target.offsetWidth; target.classList.add('bump'); setTimeout(() => target.classList.remove('bump'), 700); };
    if (fromEl) { fromEl.classList.add('just-added'); setTimeout(() => fromEl.classList.remove('just-added'), 900); }
  }
  function setQty(id, q) { const o = getEnq(); if (q <= 0) delete o[id]; else o[id] = q; saveEnq(o); renderEnq(); }
  function renderEnq() {
    const l = $('#enq-list'); if (!l) return; const o = getEnq(); const ids = Object.keys(o);
    if (!ids.length) { l.innerHTML = `<div class="empty-msg"><p>Your enquiry list is empty.</p><p style="margin-top:8px;font-size:13px">Browse the catalogue and tap “Enquire” on any item.</p></div>`; return; }
    l.innerHTML = ids.map(id => { const p = prodBy[id]; if (!p) return ''; return `<div class="enq-item">
      <a href="${prodLink(p)}"><img src="${p.img}" alt=""></a>
      <div><a class="n" href="${prodLink(p)}">${esc(p.name)}</a><div class="c">${esc(p.cat)}</div><button class="rm" data-rm="${id}">Remove</button></div>
      <div class="qty"><button data-q="${id}" data-d="-1">−</button><input value="${o[id]}" data-qi="${id}" inputmode="numeric"><button data-q="${id}" data-d="1">+</button></div></div>`; }).join('');
    $$('[data-rm]', l).forEach(b => b.onclick = () => setQty(b.dataset.rm, 0));
    $$('[data-q]', l).forEach(b => b.onclick = () => setQty(b.dataset.q, (o[b.dataset.q] || 0) + +b.dataset.d));
    $$('[data-qi]', l).forEach(i => i.onchange = () => setQty(i.dataset.qi, Math.max(0, parseInt(i.value) || 0)));
  }
  function openEnq() { renderEnq(); const w = $('#enq-wa'); if (w) { const t = enqText(); w.href = waLink(t ? 'Hi Densbe, please quote for the following items:\n' + t : 'Hi Densbe, I would like to request a quote.'); } $('#enq').classList.add('open'); document.body.classList.add('no-scroll'); }
  function closeEnq() { $('#enq').classList.remove('open'); document.body.classList.remove('no-scroll'); }
  const absUrl = rel => new URL(rel, location.href.replace(/[^/]*$/, '')).href;
  function enqText(withLinks) { const o = getEnq(); return Object.keys(o).map((id, i) => { const p = prodBy[id]; if (!p) return ''; let t = `${i + 1}. ${p.name}${p.model ? ' (' + p.model + ')' : ''} — Qty: ${o[id]}`; if (withLinks) t += `\n   Photo: ${absUrl(p.img)}\n   Page: ${absUrl(prodLink(p))}`; return t; }).filter(Boolean).join('\n'); }
  function enqCards() { const o = getEnq(); return Object.keys(o).map(id => { const p = prodBy[id]; return p ? `<a class="ep-item" href="${prodLink(p)}"><img src="${p.img}" alt=""><div><b>${esc(p.name)}</b>${p.model ? `<span>${esc(p.model)}</span>` : ''}<span>Qty: ${o[id]}</span></div></a>` : ''; }).join(''); }
  let toastT; function toast(m, withLink, img) { const t = $('#toast'); if (!t) return; const html = /<b>/.test(m) ? m : esc(m); t.innerHTML = (img ? `<img src="${img}" alt="">` : '') + `<div class="t-txt">${html}</div>` + (withLink ? '<a href="#" data-enq class="t-link">View list</a>' : ''); t.classList.toggle('rich', !!img); t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3600); $$('[data-enq]', t).forEach(a => a.onclick = e => { e.preventDefault(); openEnq(); }); }

  /* ---------- Search ---------- */
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9+]+/g, ' ').trim();
  const strip = s => String(s || '').replace(/<[^>]+>/g, ' ');
  prods.forEach(p => { p._n = norm(p.name); p._m = norm(p.model); p._b = norm(p.brand); p._c = norm(p.cat + ' ' + p.cats.map(s => catBy[s] ? catBy[s].label : '').join(' ')); p._d = norm(strip(p.desc)).slice(0, 1200); });
  function score(p, q) {
    if (!q) return 1; const toks = q.split(' ').filter(Boolean); let s = 0;
    for (const t of toks) {
      let ts = 0;
      if (p._n === q) ts = 100; else if (p._n.startsWith(t)) ts = 40; else if ((' ' + p._n + ' ').includes(' ' + t + ' ')) ts = 30; else if (p._n.includes(t)) ts = 18;
      if (p._m && (p._m === t || p._m.replace(/ /g, '').includes(t.replace(/ /g, '')))) ts = Math.max(ts, 45);
      if (p._b && p._b.includes(t)) ts = Math.max(ts, 22);
      if (p._c.includes(t)) ts = Math.max(ts, 10);
      if (!ts && p._d.includes(t)) ts = 5;
      if (!ts) return 0; s += ts;
    }
    return s;
  }
  function search(q, f) {
    q = norm(q); f = f || {};
    let r = prods.filter(p => (!f.cat || p.cats.includes(f.cat)) && (!f.group || p.cats.some(s => catBy[s] && catBy[s].group === f.group)) && (!f.brand || p.brand === f.brand) && (!f.app || (p.apps || []).includes(f.app)) && (!f.tech || (p.tech || []).includes(f.tech)));
    if (!q) return r;
    const rank = qq => r.map(p => [score(p, qq), p]).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name)).map(x => x[1]);
    let out = rank(q);
    if (!out.length) { // typo tolerance: relax each word to a shorter prefix (circuite -> circui -> circ)
      let toks = q.split(' ').filter(Boolean);
      for (let i = 0; i < 3 && !out.length; i++) { toks = toks.map(t => t.length > 4 ? t.slice(0, -1) : t); out = rank(toks.join(' ')); }
    }
    return out;
  }
  function hl(s, q) { if (!q) return esc(s); const toks = norm(q).split(' ').filter(t => t.length > 1); let out = esc(s); toks.forEach(t => { out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return out; }

  /* ---------- Cards ---------- */
  function card(p, q) {
    const inList = !!getEnq()[p.id];
    return `<article class="prod-card reveal">
      <a class="thumb" href="${prodLink(p)}"><img loading="lazy" src="${p.img}" alt="${esc(p.name)}">${isEx(p) ? '<span class="tag ex">Ex-proof</span>' : (p.brand ? `<span class="tag">${esc(p.brand)}</span>` : '')}</a>
      <div class="body"><div class="cat">${esc(p.cat)}</div><h3><a href="${prodLink(p)}">${hl(p.name, q)}</a></h3>${p.model ? `<div class="model">${esc(p.model)}</div>` : ''}
      <div class="actions"><a class="btn btn-dark" href="${prodLink(p)}">View</a><button class="icon-btn enq-toggle${inList ? ' on' : ''}" data-id="${p.id}" aria-label="Add to enquiry" title="Add to enquiry list">${inList ? I.check : I.plus}</button></div></div></article>`;
  }
  function bindCards(root) { $$('.enq-toggle', root).forEach(b => b.onclick = () => { toggleEnq(b.dataset.id, b); const on = !!getEnq()[b.dataset.id]; b.classList.toggle('on', on); b.innerHTML = on ? I.check : I.plus; }); }
  function catCard(c, featured) {
    return `<a class="cat-card reveal${featured ? ' featured' : ''}" href="${catLink(c.slug)}"><div class="thumb"><img loading="lazy" src="${c.img}" alt=""></div>
      <div class="body"><h3>${esc(c.short)}</h3><p>${esc(c.label)}</p><div class="meta"><span>${c.count} product${c.count === 1 ? '' : 's'}</span><b>Browse ${I.arrow}</b></div></div></a>`;
  }

  /* ---------- Hero finder ---------- */
  function initFinder() {
    const f = $('#finder-form'); if (!f) return;
    const q = $('#f-q'), sug = $('#f-suggest');
    $('#f-cat').innerHTML = '<option value="">Select a category</option>' + mainCats.map(c => `<option value="${c.slug}">${esc(c.label)}</option>`).join('') + '<optgroup label="E-Store">' + estoreCats.map(c => `<option value="${c.slug}">${esc(c.label)}</option>`).join('') + '</optgroup>';
    $('#f-app').innerHTML = '<option value="">Select an application</option>' + D.applications.map(a => `<option value="${a[0]}">${esc(a[1])}</option>`).join('');
    $('#f-tech').innerHTML = '<option value="">Select requirements</option>' + D.techs.map(t => `<option value="${t[0]}">${esc(t[1])}</option>`).join('');
    $('#f-brand').innerHTML = '<option value="">Any brand</option>' + D.brands.map(b => `<option value="${esc(b)}">${esc(b)}</option>`).join('');
    const filters = () => ({ cat: $('#f-cat').value, app: $('#f-app').value, tech: $('#f-tech').value, brand: $('#f-brand').value });
    let idx = -1;
    function render() {
      const v = q.value.trim(); if (v.length < 2) { sug.classList.remove('show'); sug.innerHTML = ''; return; }
      const r = search(v, filters()); idx = -1;
      if (!r.length) { sug.innerHTML = `<a href="#" class="s-all" data-nomatch>No item found in online store for “${esc(v)}” — email us about it ${I.arrow}</a>`; sug.classList.add('show'); $('[data-nomatch]', sug).onclick = e => { e.preventDefault(); sug.classList.remove('show'); noMatchModal(v); }; return; }
      sug.innerHTML = r.slice(0, 6).map(p => `<a href="${prodLink(p)}" data-pid="${p.id}"><img src="${p.img}" alt=""><div><div class="s-name">${hl(p.name, v)}</div><div class="s-cat">${esc(p.cat)}${p.model ? ' · ' + esc(p.model) : ''}</div></div></a>`).join('') + `<a class="s-all" href="${resultsUrl()}" data-all>See all ${r.length} result${r.length > 1 ? 's' : ''} ${I.arrow}</a>`;
      $$('[data-pid]', sug).forEach(a => a.onclick = e => { e.preventDefault(); sug.classList.remove('show'); productModal(prodBy[a.dataset.pid]); });
      $('[data-all]', sug).onclick = e => { e.preventDefault(); sug.classList.remove('show'); resultsModal(r, v, resultsUrl()); };
      sug.classList.add('show');
    }
    const resultsUrl = () => { const u = new URLSearchParams(); const v = q.value.trim(); if (v) u.set('q', v); const fl = filters(); Object.keys(fl).forEach(k => fl[k] && u.set(k, fl[k])); return 'products.html' + (u.toString() ? '?' + u : ''); };
    q.addEventListener('input', render); q.addEventListener('focus', render);
    $$('select', f).forEach(s => s.addEventListener('change', render));
    q.addEventListener('keydown', e => { const items = $$('a', sug); if (!items.length) return; if (e.key === 'ArrowDown') { e.preventDefault(); idx = (idx + 1) % items.length; } else if (e.key === 'ArrowUp') { e.preventDefault(); idx = (idx - 1 + items.length) % items.length; } else if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); items[idx].click(); return; } else if (e.key === 'Escape') { sug.classList.remove('show'); return; } items.forEach((a, i) => a.classList.toggle('active', i === idx)); });
    document.addEventListener('click', e => { if (!f.contains(e.target)) sug.classList.remove('show'); });
    f.onsubmit = e => { e.preventDefault(); const v = q.value.trim(); const r = search(v, filters()); sug.classList.remove('show'); if (!v && !Object.values(filters()).some(Boolean)) { q.focus(); return; } if (!r.length) return noMatchModal(v || 'your selection'); if (r.length === 1) return productModal(r[0]); resultsModal(r, v || 'your selection', resultsUrl()); };
    $('#f-source').onclick = () => { location.href = resultsUrl() + (resultsUrl().includes('?') ? '&' : '?') + 'source=1'; };
    document.addEventListener('keydown', e => { if (e.key === '/' && document.activeElement !== q && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openFinder(); } });
    const hero = $('.hero'); const video = $('#hero-video'); let seqStarted = false, finderShown = false;
    const showFinder = () => {
      if (finderShown) return; finderShown = true;
      hero.classList.add('is-open', 'ended'); f.classList.add('open');
      setTimeout(() => { f.classList.add('settled'); q.focus({ preventScroll: true }); }, 900);
      unlock();
    };
    const lock = () => { if (!finderShown) document.body.classList.add('hero-lock'); };
    const unlock = () => document.body.classList.remove('hero-lock');
    const jumpToEnd = () => { if (video) { try { video.pause(); if (video.duration) video.currentTime = video.duration; } catch (e) { } } hero.classList.add('ended'); };
    function startSequence() {
      if (seqStarted) return; seqStarted = true;
      hero.classList.add('playing');
      if (!video || matchMedia('(prefers-reduced-motion: reduce)').matches) { jumpToEnd(); setTimeout(showFinder, 500); return; }
      let done = false; const finish = () => { if (done) return; done = true; hero.classList.add('ended'); showFinder(); };
      video.addEventListener('ended', finish, { once: true });
      video.addEventListener('timeupdate', () => { if (video.duration && video.currentTime >= video.duration - 0.08) finish(); });
      video.playbackRate = 1.75;
      const pr = video.play(); if (pr && pr.catch) pr.catch(() => { jumpToEnd(); finish(); });
      setTimeout(finish, 4500); // safety
    }
    function openFinder(instant) {
      if (finderShown) { q.focus(); return; }
      if (instant) { seqStarted = true; hero.classList.add('playing'); jumpToEnd(); showFinder(); return; }
      startSequence();
    }
    $('#hero-open').onclick = () => startSequence();
    window.openFinder = openFinder;
    if (video) { video.loop = false; video.addEventListener('loadedmetadata', () => { try { video.currentTime = 0; } catch (e) { } }); }
    // lock the page until the visitor presses search or tries to scroll; the first scroll runs the sequence
    lock();
    const onIntent = e => { if (finderShown) return; if (e.type === 'keydown' && !['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) return; if (e.cancelable) e.preventDefault(); startSequence(); };
    window.addEventListener('wheel', onIntent, { passive: false }); window.addEventListener('touchmove', onIntent, { passive: false }); window.addEventListener('keydown', onIntent);
    if (location.hash === '#finder' || params.get('q')) openFinder(true);
    window.addEventListener('hashchange', () => { if (location.hash === '#finder') openFinder(true); });
  }
  /* ---------- Count-up for stats ---------- */
  function countUp() {
    $$('.stats .stat b').forEach(b => {
      const raw = b.textContent.trim(); const m = raw.match(/^(\d+)(.*)$/); if (!m) return;
      const target = +m[1], suffix = m[2]; b.textContent = '0' + suffix;
      const io2 = new IntersectionObserver(es => { if (!es[0].isIntersecting) return; io2.disconnect(); const t0 = performance.now(), dur = 1400;
        const step = now => { const k = Math.min(1, (now - t0) / dur); const e = 1 - Math.pow(1 - k, 3); b.textContent = Math.round(target * e) + suffix; if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }, { threshold: .4 });
      io2.observe(b);
    });
  }

  /* ---------- Home ---------- */
  function initHome() {
    if (!$('#home-products')) return;
    const cg = $('#home-cats'); if (cg) { const order = ['explosion-proof', 'led-lights', 'plugs-and-socket', 'circuit-breakers', 'fan', 'professional-lamps', 'clean-room-led-flourescent-tube', 'cables', 'vol-motorstarters-distribution-panels-plugs-and-recepticles', 'sensors', 'cable-glands-and-cable-accessories']; cg.innerHTML = order.map((s, i) => catBy[s] ? catCard(catBy[s], i === 0) : '').join(''); }
    if ($('#home-estore')) { $('#home-estore').innerHTML = estoreCats.filter(c => c.count).map(estoreCard).join(''); bindSlides($('#home-estore')); }
    const picks = ['densbe-led-ex-proof', 'obstruction light', 'triproof', 'flame detector', 'siemens sirius', 'hubbell', 'longlife extrabright', 'solar'];
    const pp = []; picks.forEach(k => { const r = search(k).find(p => !pp.includes(p)); if (r) pp.push(r); });
    $('#home-products').innerHTML = pp.slice(0, 8).map(p => card(p)).join(''); bindCards($('#home-products'));
  }

  /* ---------- Sourcing request (drop-ship) panel ---------- */
  function sourcePanel(st, c) {
    const bits = [st.q && st.q, st.brand && st.brand, c && c.label, st.app && appLabel[st.app], st.tech && techLabel[st.tech]].filter(Boolean);
    return `<div class="source-panel reveal in" style="grid-column:1/-1" id="source-panel">
      <div class="sp-txt"><span class="eyebrow">Available on request</span><h3>${st.q ? 'We can supply “' + esc(st.q) + '”' : 'Tell us what you need'}</h3>
        <p>Densbe sources genuine parts from our manufacturer network and drop-ships them directly to your site. Leave your details and we reply with price, lead time and shipping.</p>
        <ul class="check-list"><li>Genuine parts, any brand</li><li>Worldwide direct shipping</li><li>Short lead times from ex-stock</li><li>Datasheets &amp; alternatives on request</li></ul></div>
      <form class="form sp-form" id="source-form">
        <div class="field full"><label for="s-part">Part number / description</label><input id="s-part" name="part" required value="${esc(bits.join(' · '))}" placeholder="e.g. Siemens 3RT1023-1AP00"></div>
        <div class="field"><label for="s-qty">Quantity</label><input id="s-qty" name="qty" inputmode="numeric" placeholder="e.g. 10"></div>
        <div class="field"><label for="s-when">Required by</label><input id="s-when" name="when" placeholder="e.g. 2 weeks"></div>
        <div class="field"><label for="s-name">Your name</label><input id="s-name" name="name" required></div>
        <div class="field"><label for="s-email">Email</label><input id="s-email" name="email" type="email" required></div>
        <div class="field full"><label for="s-phone">Phone / WhatsApp <span style="font-weight:500;color:var(--muted)">— optional</span></label><input id="s-phone" name="phone"></div>
        <div class="form-ok" id="source-ok"></div>
        <div class="field full"><button class="btn btn-red" type="submit">Request a quote ${I.arrow}</button></div>
      </form></div>`;
  }
  function bindSource(root) {
    const f = $('#source-form', root); if (!f) return;
    f.onsubmit = async e => {
      e.preventDefault(); const fd = new FormData(f); const btn = $('button[type=submit]', f); btn.disabled = true;
      const subject = 'Quote request: ' + fd.get('part');
      const body = `Part: ${fd.get('part')}\nQuantity: ${fd.get('qty') || '-'}\nRequired by: ${fd.get('when') || '-'}\n\nName: ${fd.get('name')}\nEmail: ${fd.get('email')}\nPhone: ${fd.get('phone') || '-'}`;
      if (FORM_ENDPOINT) {
        try { fd.append('subject', subject); const r = await fetch(FORM_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }); if (!r.ok) throw 0; $('#source-ok').style.display = 'block'; $('#source-ok').textContent = 'Thank you — your request has been sent. We will reply with price and lead time shortly.'; f.reset(); }
        catch (err) { alert('Sorry, the request could not be sent. Please email ' + SALES_EMAIL + ' directly.'); }
      } else {
        location.href = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        $('#source-ok').style.display = 'block'; $('#source-ok').textContent = 'Your email app has opened with the request ready to send.';
      }
      btn.disabled = false;
    };
  }

  /* ---------- Catalogue ---------- */
  function initCatalog() {
    const grid = $('#cat-grid'); if (!grid) return;
    const st = { q: params.get('q') || '', cat: params.get('cat') || '', group: params.get('group') || '', brand: params.get('brand') || '', app: params.get('app') || '', tech: params.get('tech') || '', source: params.get('source') === '1', sort: 'rel', shown: 24 };
    const qi = $('#c-q'); qi.value = st.q;
    $('#c-brand').innerHTML = '<option value="">All brands</option>' + D.brands.map(b => `<option value="${esc(b)}">${esc(b)}</option>`).join('');
    $('#c-app').innerHTML = '<option value="">Any application</option>' + D.applications.map(a => `<option value="${a[0]}">${esc(a[1])}</option>`).join('');
    $('#c-tech').innerHTML = '<option value="">Any requirement</option>' + D.techs.map(t => `<option value="${t[0]}">${esc(t[1])}</option>`).join('');
    $('#c-brand').value = st.brand; $('#c-app').value = st.app; $('#c-tech').value = st.tech;
    function catList() {
      const a = (c) => `<a href="#" data-cat="${c.slug}" class="${st.cat === c.slug ? 'on' : ''}"><span>${esc(c.short)}</span><small>${c.count}</small></a>`;
      $('#c-cats').innerHTML = `<a href="#" data-cat="" class="${!st.cat && !st.group ? 'on' : ''}"><span>All products</span><small>${prods.length}</small></a><div class="grp">Products</div>${mainCats.map(a).join('')}<div class="grp">Osram &amp; Philips lamps</div>${cats.filter(c => c.group === 'sub').map(a).join('')}<div class="grp">E-Store by brand</div><a href="#" data-group="estore" class="${st.group === 'estore' && !st.cat ? 'on' : ''}"><span>All E-Store</span></a>${estoreCats.filter(c => c.count).map(a).join('')}`;
      $$('[data-cat],[data-group]', $('#c-cats')).forEach(x => x.onclick = e => { e.preventDefault(); st.cat = x.dataset.cat || ''; st.group = x.dataset.group || ''; st.shown = 24; run(); $('#filters').classList.remove('open'); });
    }
    function run() {
      let r = search(st.q, st);
      if (st.sort === 'az') r = r.slice().sort((a, b) => a.name.localeCompare(b.name)); else if (st.sort === 'za') r = r.slice().sort((a, b) => b.name.localeCompare(a.name));
      const u = new URLSearchParams(); ['q', 'cat', 'group', 'brand', 'app', 'tech'].forEach(k => st[k] && u.set(k, st[k])); history.replaceState(null, '', 'products.html' + (u.toString() ? '?' + u : ''));
      const c = st.cat && catBy[st.cat];
      $('#c-title').textContent = c ? c.label : st.group === 'estore' ? 'E-Store' : st.q ? (r.length ? `Results for “${st.q}”` : `“${st.q}”`) : 'All products';
      $('#c-sub').textContent = (!r.length && st.q) ? 'This part is available on request. Densbe sources genuine parts from our manufacturer network and ships them directly to you.' : c ? (c.group === 'estore' ? `Genuine ${c.label} items available through the Densbe E-Store. Add items to your enquiry list for stock and pricing.` : `Browse our ${c.label.toLowerCase()} range. Can't find the exact model? Ask us to source it.`) : 'Search thousands of electrical parts, or let Densbe source it for you.';
      document.title = ($('#c-title').textContent) + ' | Densbe Electrical';
      $('#c-count').innerHTML = r.length ? `<b>${r.length}</b> product${r.length === 1 ? '' : 's'}` : `<b>Available on request</b>`;
      const chips = []; const chip = (l, k) => chips.push(`<span>${esc(l)}<button data-x="${k}" aria-label="Remove">×</button></span>`);
      if (st.q) chip('“' + st.q + '”', 'q'); if (c) chip(c.short, 'cat'); if (st.group && !c) chip('E-Store', 'group'); if (st.brand) chip(st.brand, 'brand'); if (st.app) chip(appLabel[st.app], 'app'); if (st.tech) chip(techLabel[st.tech], 'tech');
      $('#c-chips').innerHTML = chips.join(''); $$('[data-x]').forEach(b => b.onclick = () => { st[b.dataset.x] = ''; if (b.dataset.x === 'q') qi.value = ''; $('#c-' + b.dataset.x) && ($('#c-' + b.dataset.x).value = ''); run(); });
      catList();
      const srcPanel = sourcePanel(st, c);
      if (!r.length) { grid.innerHTML = srcPanel; bindSource(grid); $('#c-more').style.display = 'none'; return; }
      grid.innerHTML = (st.source ? srcPanel : '') + r.slice(0, st.shown).map(p => card(p, st.q)).join(''); bindCards(grid); if (st.source) bindSource(grid); reveal();
      $('#c-more').style.display = r.length > st.shown ? 'flex' : 'none';
    }
    let t; qi.oninput = () => { clearTimeout(t); t = setTimeout(() => { st.q = qi.value.trim(); st.shown = 24; run(); }, 180); };
    $('#c-form').onsubmit = e => { e.preventDefault(); st.q = qi.value.trim(); run(); };
    ['brand', 'app', 'tech'].forEach(k => $('#c-' + k).onchange = e => { st[k] = e.target.value; st.shown = 24; run(); });
    $('#c-sort').onchange = e => { st.sort = e.target.value; run(); };
    $('#c-reset').onclick = () => { Object.assign(st, { q: '', cat: '', group: '', brand: '', app: '', tech: '', shown: 24 }); qi.value = ''; ['brand', 'app', 'tech'].forEach(k => $('#c-' + k).value = ''); run(); };
    $('#c-more button').onclick = () => { st.shown += 24; run(); };
    $('#filters-toggle').onclick = () => $('#filters').classList.add('open'); $('#filters .fclose button').onclick = () => $('#filters').classList.remove('open');
    run();
  }

  /* ---------- Product detail ---------- */
  function initProduct() {
    const el = $('#pd'); if (!el) return;
    const p = prodBy[params.get('id')];
    if (!p) { el.innerHTML = `<div class="empty" style="grid-column:1/-1"><h3>Product not found</h3><p>This item may have been moved. Browse the catalogue or ask us to source it.</p><a class="btn btn-red" href="products.html">Browse products</a></div>`; return; }
    document.title = p.name + ' | Densbe Electrical';
    const c = catBy[p.cats[0]];
    $('#pd-crumb').innerHTML = `<a href="index.html">Home</a><span><a href="products.html">Products</a></span>${c ? `<span><a href="${catLink(c.slug)}">${esc(c.short)}</a></span>` : ''}<span>${esc(p.name)}</span>`;
    el.innerHTML = `<div class="gallery"><img src="${p.img}" alt="${esc(p.name)}" id="pd-img"></div>
      <div><div class="cat">${esc(p.cat)}</div><h1>${esc(p.name)}</h1>
      <div class="meta">${p.model ? `<span>Model / Code: <b>${esc(p.model)}</b></span>` : ''}${p.brand ? `<span>Brand: <b>${esc(p.brand)}</b></span>` : ''}<span class="stock">● Available on enquiry</span></div>
      <div class="desc">${p.desc}</div>
      <div class="enquire-box"><div class="qty"><button id="q-m">−</button><input id="q-v" value="1" inputmode="numeric"><button id="q-p">+</button></div><button class="btn btn-red" id="pd-add">Enquire item ${I.arrow}</button><a class="btn btn-ghost" href="contact.html?subject=${encodeURIComponent('Quote request: ' + p.name)}&msg=${encodeURIComponent('Hi Densbe, please quote for:\n' + p.name + (p.model ? ' (' + p.model + ')' : '') + '\nQuantity: ')}">Quick quote</a></div>
      <div class="help"><span>Need a datasheet or an alternative model?</span><a href="tel:+6590223133">Call +65 9022 3133</a><a href="mailto:${SALES_EMAIL}?subject=${encodeURIComponent('Enquiry: ' + p.name)}">Email sales</a></div></div>`;
    const qv = $('#q-v'); $('#q-m').onclick = () => qv.value = Math.max(1, (+qv.value || 1) - 1); $('#q-p').onclick = () => qv.value = (+qv.value || 1) + 1;
    $('#pd-add').onclick = () => addEnq(p.id, Math.max(1, parseInt(qv.value) || 1), false, $('#pd-img'));
    $('#pd-img').onclick = () => { $('#lightbox img').src = p.img; $('#lightbox').classList.add('open'); };
    const rel = prods.filter(x => x.id !== p.id && x.cats.some(s => p.cats.includes(s))).slice(0, 4);
    if (rel.length) { $('#pd-related').innerHTML = rel.map(x => card(x)).join(''); bindCards($('#pd-related')); } else $('#pd-related-sec').style.display = 'none';
  }

  /* ---------- E-Store brand cards (logo + hover slideshow) ---------- */
  const BRAND_LOGO = { siemens: 'assets/brands/brand-06.png', hubbell: 'assets/brands/brand-13.png', omron: 'assets/brands/brand-23.png', 'pepperl-fuchs': 'assets/brands/brand-08.png', meikosha: 'assets/brands/brand-21.gif', robertshaw: 'assets/brands/brand-16.jpg', 'professional-lamps/osram': 'assets/brands/brand-01.png', 'professional-lamps/philips': 'assets/brands/brand-02.png' };
  function estoreCard(c) {
    const ps = prods.filter(p => p.cats.includes(c.slug)).slice(0, 6);
    const logo = BRAND_LOGO[c.slug];
    return `<a class="estore-card${logo ? ' has-logo' : ''}" href="${catLink(c.slug)}" data-slides>
      <div class="ec-front">${logo ? `<img class="ec-logo" src="${logo}" alt="${esc(c.short)}">` : `<span class="ec-word">${esc(c.short)}</span>`}
        <div class="ec-meta"><b>${esc(c.short)}</b><small>${c.count} item${c.count > 1 ? 's' : ''} · View range ${I.arrow}</small></div></div>
      <div class="ec-slides">${ps.map((p, i) => `<figure class="${i === 0 ? 'on' : ''}"><img loading="lazy" src="${p.img}" alt=""><figcaption>${esc(p.name)}</figcaption></figure>`).join('')}
        <div class="ec-count">${ps.length ? '1 / ' + ps.length : ''}</div></div></a>`;
  }
  function bindSlides(root) {
    $$('[data-slides]', root).forEach(card => {
      const figs = $$('.ec-slides figure', card); if (figs.length < 2) return; let i = 0, t;
      const show = n => { figs[i].classList.remove('on'); i = (n + figs.length) % figs.length; figs[i].classList.add('on'); $('.ec-count', card).textContent = (i + 1) + ' / ' + figs.length; };
      card.addEventListener('mouseenter', () => { clearInterval(t); t = setInterval(() => show(i + 1), 1100); });
      card.addEventListener('mouseleave', () => { clearInterval(t); show(0); });
    });
  }

  /* ---------- Slanted logo wall ---------- */
  function initLogoWall() {
    const walls = $$('[data-logo-wall]'); if (!walls.length || !D.brandLogos.length) return;
    const logos = D.brandLogos.filter(l => !/brand-31\./.test(l)); const lanes = [[], [], []]; logos.forEach((l, i) => lanes[i % 3].push(l));
    walls.forEach((w, wi) => {
      w.innerHTML = `<div class="lw-plane">${lanes.map((ln, i) => { const tiles = ln.map(l => `<div class="lw-tile"><img loading="lazy" src="${l}" alt="Brand logo"></div>`).join(''); return `<div class="lw-lane ${i % 2 ? 'lw-rev' : ''}" style="--dur:${52 + i * 9}s"><div class="lw-track">${tiles}${tiles}${tiles}</div></div>`; }).join('')}</div>`;
      const plane = $('.lw-plane', w); const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fixed = w.dataset.tilt;
      const update = () => {
        if (reduce) { plane.style.setProperty('--p', 1); return; }
        if (fixed) { plane.style.setProperty('--p', fixed); return; }
        const r = w.getBoundingClientRect(); const vh = innerHeight;
        // 0 when the wall enters from the bottom, 1 once its centre passes ~55% of the viewport
        const start = vh, end = vh * 0.5 - r.height / 2;
        const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
        const e = 1 - Math.pow(1 - p, 3);
        plane.style.setProperty('--p', e.toFixed(4));
      };
      update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    });
  }

  /* ---------- Brands page ---------- */
  function initBrands() {
    const g = $('#brand-grid'); if (g) g.innerHTML = D.brandLogos.filter(l => !/brand-31\./.test(l)).map(l => `<div class="brand-tile reveal"><img loading="lazy" src="${l}" alt="Brand logo"></div>`).join('');
    if (!$('#brand-estore')) return;
    $('#brand-estore').innerHTML = estoreCats.filter(c => c.count).map(estoreCard).join(''); bindSlides($('#brand-estore'));
  }

  /* ---------- Contact form ---------- */
  function initContact() {
    const f = $('#contact-form'); if (!f) return;
    if (params.get('subject')) f.subject.value = params.get('subject');
    if (params.get('msg')) f.message.value = params.get('msg');
    if (params.get('enquiry')) { const t = enqText(true); f.subject.value = f.subject.value || 'Enquiry list from densbe-electric.com'; f.message.value = (t ? 'Please quote for the following items:\n' + t : 'My enquiry list is empty.') + '\n\nDelivery location:\nRequired by:'; }
    if (location.hash === '#identify') { f.subject.value = f.subject.value || 'Please identify this component'; f.message.value = f.message.value || 'Hi Densbe, I have attached a photo of the product / nameplate. Please help identify it and quote for a replacement.\n\nQuantity:\nWhere it is used:'; setTimeout(() => f.scrollIntoView({ behavior: 'smooth' }), 400); }
    const waEnq = $('#wa-enquiry'); if (waEnq) { const t = enqText(); waEnq.href = waLink(t ? 'Hi Densbe, please quote for the following items:\n' + t : 'Hi Densbe, I would like to request a quote.'); }
    const enqPreview = $('#enq-preview'); if (enqPreview) { const cards = enqCards(); if (cards) { enqPreview.style.display = 'block'; enqPreview.innerHTML = `<div class="ep-head"><b>Items in your enquiry list</b><span>Product photos are included in your enquiry automatically</span></div><div class="ep-grid">${cards}</div>`; } }
    f.onsubmit = async e => {
      e.preventDefault(); const btn = $('button[type=submit]', f); btn.disabled = true; btn.textContent = 'Sending…';
      const fd = new FormData(f); const has = fd.get('photo') && fd.get('photo').size;
      if (FORM_ENDPOINT) {
        try { const r = await fetch(FORM_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }); if (!r.ok) throw 0; $('#form-ok').style.display = 'block'; $('#form-ok').textContent = 'Thank you — your message has been sent. Our team will reply shortly.'; f.reset(); }
        catch (err) { alert('Sorry, the message could not be sent. Please email ' + SALES_EMAIL + ' directly.'); }
      } else {
        const body = `Name: ${fd.get('name')}\nEmail: ${fd.get('email')}\nContact: ${fd.get('contact')}\n\n${fd.get('message')}` + (has ? '\n\n[Please attach the product photo to this email before sending.]' : '');
        location.href = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(fd.get('subject') || 'Website enquiry')}&body=${encodeURIComponent(body)}`;
        $('#form-ok').style.display = 'block'; $('#form-ok').textContent = has ? 'Your email app has opened with the message. Please attach your photo before sending.' : 'Your email app has opened with the message ready to send.';
      }
      btn.disabled = false; btn.innerHTML = 'Send message ' + I.arrow;
    };
  }

  /* ---------- Reveal + preloader ---------- */
  let io;
  function autoReveal() {
    $$('.section-head, .split > *, .contact-grid > *, .footer-grid > div, .pd > *, .catalog > *, .val, .tl, .estore-card, .brand-grid .brand-tile, .source-panel, .marquee').forEach(el => { if (!el.classList.contains('reveal')) el.classList.add('reveal'); });
    $$('.split .img').forEach(el => el.classList.add('reveal-left'));
    $$('.split .txt').forEach(el => el.classList.add('reveal-right'));
    $$('.cat-grid, .prod-grid, .val-grid, .estore-grid, .brand-grid, .timeline, .footer-grid, .stats .container').forEach(g => Array.from(g.children).forEach((ch, i) => { ch.style.setProperty('--i', Math.min(i, 9)); }));
  }
  function reveal() {
    autoReveal(); if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(e => e.classList.add('in')); return; } io = io || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .05 }); $$('.reveal:not(.in)').forEach(e => io.observe(e)); }
  function preloader() {
    const pl = $('#preloader'); if (!pl) return; const start = Date.now(); const min = sessionStorage.getItem('densbe_seen') ? 350 : 1100;
    const done = () => { setTimeout(() => { pl.classList.add('done'); markLoaded(); document.body.classList.remove('no-scroll'); try { sessionStorage.setItem('densbe_seen', '1'); } catch (e) { } setTimeout(() => pl.remove(), 700); }, Math.max(0, min - (Date.now() - start))); };
    const v = $('#hero-video'); const ready = () => (v && v.readyState < 3) ? new Promise(r => { v.addEventListener('canplaythrough', r, { once: true }); v.addEventListener('error', r, { once: true }); setTimeout(r, 3500); }) : Promise.resolve();
    const go = () => ready().then(done);
    if (document.readyState === 'complete') go(); else { window.addEventListener('load', go); setTimeout(go, 5000); }
  }
  function markLoaded() { requestAnimationFrame(() => document.body.classList.add('loaded')); }

  document.addEventListener('DOMContentLoaded', () => {
    if (page === 'index') document.body.classList.add('home');
    renderHeader(); renderFooter(); updateBadge();
    initFinder(); initHome(); initCatalog(); initProduct(); initBrands(); initContact(); initLogoWall();
    reveal(); countUp(); preloader(); if (!$('#preloader')) markLoaded();
  });
  window.Densbe = { search, addEnq, openEnq, card, bindCards };
})();
