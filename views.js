'use strict';
const fs = require('fs');
const path = require('path');

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function img(src, alt, cls) {
  alt = esc(alt);
  if (src) return `<img src="${esc(src)}" alt="${alt}" class="${cls || ''}">`;
  return `<div class="${cls || ''} ph"><span>${alt}</span></div>`;
}

function navHtml(content, active) {
  return content.nav
    .map(
      (n) =>
        `<a href="${esc(n.href)}" class="nav-link${n.href === active ? ' active' : ''}">${esc(n.label)}</a>`
    )
    .join('');
}

function header(content, active) {
  const s = content.site;
  return `
  <header class="site-header">
    <div class="container nav-bar">
      <a href="/" class="brand"><img src="/img/frinit-logo.png" alt="FRINIT" class="logo-img"></a>
      <nav class="main-nav">${navHtml(content, active)}</nav>
      <a href="/contact" class="btn btn-primary nav-cta">Inquiry</a>
      <button class="mobile-toggle" aria-label="menu">☰</button>
    </div>
  </header>`;
}

function footer(content) {
  const s = content.site;
  const social = s.social || {};
  const socialLinks = ['linkedin', 'facebook', 'instagram']
    .filter((k) => social[k])
    .map((k) => `<a href="${esc(social[k])}" target="_blank" rel="noopener">${esc(k)}</a>`)
    .join('');
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="brand"><img src="/img/frinit-logo.png" alt="FRINIT" class="logo-img"></div>
        <p class="muted">${esc(s.slogan)}</p>
        <p class="muted">${esc(content.footer.note || '')}</p>
      </div>
      <div>
        <h4>Contact</h4>
        <p>${esc(s.address || '')}</p>
        <p>Email: <a href="mailto:${esc(s.email)}">${esc(s.email)}</a></p>
        ${s.phone ? `<p>Phone: ${esc(s.phone)}</p>` : ''}
        ${s.whatsapp ? `<p>WhatsApp: ${esc(s.whatsapp)}</p>` : ''}
      </div>
      <div>
        <h4>Quick Links</h4>
        ${content.nav.map((n) => `<a href="${esc(n.href)}">${esc(n.label)}</a>`).join('<br>')}
        ${socialLinks ? `<div class="social">${socialLinks}</div>` : ''}
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} ${esc(s.fullName || s.name)}. All rights reserved.</span>
    </div>
  </footer>`;
}

function layout(content, body, active) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.site.name)} — Slippers & Caps Sourcing in China</title>
<meta name="description" content="FRINIT sources and manufactures beach slippers, winter fur slippers and caps in China for global brands. OEM & ODM, full QC and worldwide shipping.">
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
${header(content, active)}
<main>${body}</main>
${footer(content)}
<a href="/contact" class="floating-cta">Inquiry <span>&rarr;</span></a>
<script src="/js/site.js"></script>
</body>
</html>`;
}

// small helpers for the "international" look
function sectionHead(eyebrow, title, center, idx) {
  return `<div class="sec-head${center ? ' center' : ''}"><h2>${esc(title)}</h2></div>`;
}
function pageHero(eyebrow, title, sub) {
  return `<section class="page-hero"><div class="container"><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(title)}</h1>${
    sub ? `<p class="muted">${esc(sub)}</p>` : ''
  }</div></section>`;
}

// ---------------- Showcase: clients & credentials ----------------

function clientWall(c) {
  const cl = c.clients || {};
  const items = (cl.items || [])
    .map((x) => {
      const inner = x.logo
        ? `<img src="${esc(x.logo)}" alt="${esc(x.name)}">`
        : `<span class="client-name">${esc(x.name)}</span>`;
      return `<div class="client-card">${inner}</div>`;
    })
    .join('');
  return `
  <section class="section section-alt client-section">
    <div class="container">
      ${sectionHead('Trusted Partners', cl.heading || 'Brands We Work With', true)}
      ${cl.lead ? `<p class="lead center">${esc(cl.lead)}</p>` : ''}
      <div class="client-grid">${items}</div>
    </div>
  </section>`;
}

function certsGrid(c) {
  const ct = c.certs || {};
  const items = (ct.items || [])
    .map((x) => {
      const badge = x.image
        ? `<div class="cert-badge"><img src="${esc(x.image)}" alt="${esc(x.name)}" class="cert-img"></div>`
        : `<div class="cert-badge"><span class="cert-mark">${esc((x.name || '✓').slice(0, 2))}</span></div>`;
      const kind = x.kind ? `<span class="cert-kind">${esc(x.kind)}</span>` : '';
      return `<div class="cert-card">${badge}<div class="cert-body">${kind}<h3>${esc(x.name)}</h3>${
        x.desc ? `<p>${esc(x.desc)}</p>` : ''
      }</div></div>`;
    })
    .join('');
  return `
  <section class="section cert-section">
    <div class="container">
      ${sectionHead('Credibility', ct.heading || 'Certifications & Test Reports', true)}
      ${ct.lead ? `<p class="lead center">${esc(ct.lead)}</p>` : ''}
      <div class="cert-grid">${items}</div>
      <div class="cert-more"><a class="btn btn-ghost" href="/credentials">View all credentials</a></div>
    </div>
  </section>`;
}

function credentials(c) {
  const cl = c.clients || {};
  const ct = c.certs || {};
  const clients = (cl.items || [])
    .map((x) => {
      const inner = x.logo
        ? `<img src="${esc(x.logo)}" alt="${esc(x.name)}">`
        : `<span class="client-name">${esc(x.name)}</span>`;
      return `<div class="client-card">${inner}</div>`;
    })
    .join('');
  const certs = (ct.items || [])
    .map((x) => {
      const badge = x.image
        ? `<div class="cert-badge"><img src="${esc(x.image)}" alt="${esc(x.name)}" class="cert-img"></div>`
        : `<div class="cert-badge"><span class="cert-mark">${esc((x.name || '✓').slice(0, 2))}</span></div>`;
      const kind = x.kind ? `<span class="cert-kind">${esc(x.kind)}</span>` : '';
      return `<div class="cert-card">${badge}<div class="cert-body">${kind}<h3>${esc(x.name)}</h3>${
        x.desc ? `<p>${esc(x.desc)}</p>` : ''
      }</div></div>`;
    })
    .join('');
  return `
  ${pageHero('Credentials', 'Clients & Certifications', 'The brands we serve and the standards we hold ourselves to.')}
  <section class="section section-alt"><div class="container">
    ${sectionHead('Our Clients', cl.heading || 'Brands We Work With', true)}
    ${cl.lead ? `<p class="lead center">${esc(cl.lead)}</p>` : ''}
    <div class="client-grid">${clients}</div>
  </div></section>
  <section class="section"><div class="container">
    ${sectionHead('Certifications & Test Reports', ct.heading || 'Certifications & Test Reports', true)}
    ${ct.lead ? `<p class="lead center">${esc(ct.lead)}</p>` : ''}
    <div class="cert-grid">${certs}</div>
  </div></section>`;
}

// ---------------- Pages ----------------

function home(c) {
  const h = c.hero;
  const aboutBlocks = c.about.paragraphs
    .slice(0, 2)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('');
  const stats = c.about.stats
    .map((s) => `<div class="stat"><div class="stat-num">${esc(s.num)}</div><div class="stat-label">${esc(s.label)}</div></div>`)
    .join('');
  const keyStats = (c.keyStats && c.keyStats.length ? c.keyStats : c.about.stats)
    .map((s) => `<div class="impact-item"><div class="stat-num impact-num">${esc(s.num)}</div><div class="impact-label">${esc(s.label)}</div></div>`)
    .join('');
  const adv = c.advantages
    .map(
      (a) =>
        `<div class="adv-card"><div class="adv-no">${esc(a.no)}</div><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p></div>`
    )
    .join('');
  const prod = c.products
    .map(
      (p) =>
        `<a class="prod-card" href="/products">${img(p.image, p.name, 'prod-img')}<div class="prod-body"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p></div></a>`
    )
    .join('');
  const svc = c.services
    .slice(0, 6)
    .map((s) => `<li><strong>${esc(s.title)}</strong> — ${esc(s.desc)}</li>`)
    .join('');
  const news = c.news
    .slice(0, 3)
    .map(
      (n) =>
        `<a class="news-card" href="${esc(n.link || '#')}"><span class="news-date">${esc(n.date)}</span><h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p></a>`
    )
    .join('');
  const steps = (c.process || [])
    .map(
      (s) =>
        `<div class="step-card"><div class="step-no">${esc(s.no)}</div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></div>`
    )
    .join('');

  const mq = ['USA', 'Europe', 'Middle-East', 'Africa', 'OEM / ODM', 'Beach Slippers', 'Fur Slippers', 'Caps', 'Sourcing', 'QC Inspection', 'Global Shipping'];
  const mqOnce = mq.map((t) => `<span>${esc(t)}</span>`).join('');
  const marquee = `<section class="marquee" aria-hidden="true"><div class="marquee-track">${mqOnce}${mqOnce}</div></section>`;

  return `
  <section class="hero" style="${h.image ? `background-image:url('${esc(h.image)}')` : ''}">
    <div class="hero-overlay"></div>
    <div class="container hero-inner">
      <span class="eyebrow">Slipper & Cap Sourcing</span>
      <h1>${esc(h.title)}</h1>
      <p>${esc(h.subtitle)}</p>
      <a class="btn btn-primary btn-lg" href="${esc(h.ctaLink)}">${esc(h.ctaText)}</a>
    </div>
  </section>

  ${marquee}

  <section class="section">
    <div class="container narrow">
      ${sectionHead('Who We Are', c.about.heading, false, '01')}
      ${aboutBlocks}
      <a class="btn btn-ghost" href="/about">Learn more</a>
    </div>
  </section>

  <section class="impact-band">
    <div class="container">
      ${sectionHead('By the Numbers', 'Built on Real Results', true)}
      <div class="impact-grid">${keyStats}</div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      ${sectionHead('Why FRINIT', 'Our Advantages', true, '02')}
      ${c.advantagesLead ? `<p class="lead center">${esc(c.advantagesLead)}</p>` : ''}
      <div class="adv-grid">${adv}</div>
    </div>
  </section>

  ${clientWall(c)}

  <section class="section">
    <div class="container">
      ${sectionHead('Products', 'Our Products', true, '03')}
      <div class="prod-grid">${prod}</div>
    </div>
  </section>

  <section class="section product-range-section">
    <div class="container">
      ${sectionHead('Product Range', 'Our Full Product Lineup', true)}
    </div>
    <div class="range-gallery full"><img src="/img/old_2024.jpg" alt="FRINIT — our products, workspace and team in Fuzhou" loading="lazy" class="range-img"></div>
    <div class="container">
      <p class="range-cap">From our base in Fuzhou we develop, source and ship beach slippers, winter fur slippers and caps for brands across the world.</p>
    </div>
  </section>

  ${certsGrid(c)}

  <section class="section section-alt">
    <div class="container">
      ${sectionHead('How It Works', 'From Inquiry to Delivery', true, '04')}
      <div class="step-grid">${steps}</div>
    </div>
  </section>

  <section class="section">
    <div class="container two-col">
      <div>${sectionHead('Services', 'What We Do', false, '05')}<ul class="svc-list">${svc}</ul><a class="btn btn-ghost" href="/service">All services</a></div>
      <div class="news-col">${sectionHead('News', 'Latest News', false)}${news}</div>
    </div>
  </section>

  <section class="cta-band">
    <div class="container">
      <h2>${esc(c.contact.heading)}</h2>
      <p>${esc(c.contact.intro)}</p>
      <a class="btn btn-primary btn-lg" href="/contact">${esc(c.hero.ctaText)}</a>
    </div>
  </section>`;
}

function about(c) {
  const a = c.about;
  const paras = a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
  const stats = a.stats
    .map((s) => `<div class="stat"><div class="stat-num">${esc(s.num)}</div><div class="stat-label">${esc(s.label)}</div></div>`)
    .join('');
  const adv = c.advantages
    .map(
      (x) =>
        `<div class="adv-card"><div class="adv-no">${esc(x.no)}</div><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></div>`
    )
    .join('');
  const pillars = (a.pillars || [])
    .map((p) => `<div class="pillar-card"><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></div>`)
    .join('');
  return `
  ${pageHero('About', a.heading, a.lead || '')}
  <section class="section"><div class="container narrow">${paras}</div></section>
  <section class="showcase-band"><img src="/img/old_2024.jpg" alt="FRINIT — our products, workspace and team in Fuzhou" loading="lazy" class="showcase-img"></section>
  <section class="section section-alt"><div class="container">
    ${sectionHead('Why FRINIT', 'What Sets Us Apart', true)}
    <div class="pillars">${pillars}</div>
  </div></section>
  <section class="section"><div class="container"><div class="stats-grid big">${stats}</div></div></section>
  <section class="section section-alt"><div class="container">${sectionHead('Capabilities', 'Our Advantages', true)}<div class="adv-grid">${adv}</div></div></section>`;
}

function styleCard(s) {
  const meta = [];
  if (s.material) meta.push(`<span><b>Material</b>${esc(s.material)}</span>`);
  if (s.moq) meta.push(`<span><b>MOQ</b>${esc(s.moq)}</span>`);
  return `<div class="style-card">
    ${img(s.image, s.name, 'style-img')}
    <div class="style-body">
      <h3>${esc(s.name)}</h3>
      ${s.desc ? `<p>${esc(s.desc)}</p>` : ''}
      ${meta.length ? `<div class="style-meta">${meta.join('')}</div>` : ''}
      ${s.note ? `<p class="style-note">${esc(s.note)}</p>` : ''}
    </div>
  </div>`;
}

function products(c) {
  const cats = c.products
    .map((p) => {
      const styles = (p.styles || [])
        .map((s) => styleCard(s))
        .join('');
      return `<div class="prod-cat">
        <div class="prod-cat-head">
          <h3>${esc(p.name)}</h3>
          ${p.desc ? `<p>${esc(p.desc)}</p>` : ''}
        </div>
        <div class="style-grid">${styles}</div>
      </div>`;
    })
    .join('');
  return `
  ${pageHero('Products', 'Products', 'Slippers & caps for global brands')}
  <section class="section"><div class="container">${cats}</div></section>`;
}

function service(c) {
  const svc = c.services
    .map(
      (s, i) =>
        `<div class="svc-card"><div class="svc-no">${String(i + 1).padStart(2, '0')}</div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></div>`
    )
    .join('');
  return `
  ${pageHero('Services', 'Services', 'One-stop sourcing & manufacturing in China')}
  <section class="section"><div class="container"><div class="svc-grid">${svc}</div></div></section>`;
}

function news(c) {
  const items = c.news
    .map(
      (n) =>
        `<a class="news-card full" href="${esc(n.link || '#')}"><span class="news-date">${esc(n.date)}</span><h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p></a>`
    )
    .join('');
  return `
  ${pageHero('News', 'News', '')}
  <section class="section"><div class="container narrow"><div class="news-list">${items}</div></div></section>`;
}

function contact(c) {
  const k = c.contact;
  return `
  ${pageHero('Contact', k.heading, k.intro)}
  <section class="section"><div class="container two-col">
    <div>
      <h3>Contact Information</h3>
      <p>${esc(k.address || '')}</p>
      <p>Email: <a href="mailto:${esc(k.email)}">${esc(k.email)}</a></p>
      ${k.phone ? `<p>Phone: ${esc(k.phone)}</p>` : ''}
      ${k.whatsapp ? `<p>WhatsApp: ${esc(k.whatsapp)}</p>` : ''}
    </div>
    <div>
      <h3>Send Inquiry</h3>
      <form class="contact-form" action="mailto:${esc(k.email)}" method="post" enctype="text/plain">
        <input name="name" placeholder="Your Name" required>
        <input name="email" type="email" placeholder="Your Email" required>
        <input name="company" placeholder="Company">
        <textarea name="message" rows="4" placeholder="Your message" required></textarea>
        <button class="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
  </div></section>`;
}

function adminPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FRINIT Admin</title>
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div id="app"></div>
<script src="/js/admin.js"></script>
</body>
</html>`;
}

module.exports = { layout, home, about, products, service, news, contact, credentials, adminPage };
