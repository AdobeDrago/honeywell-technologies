import { getMetadata } from '../../scripts/aem.js';

const SOCIAL_SVG = {
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.08 24 18.09 24 12.07z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.09 0 12 0 12s0 3.91.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.91 24 12 24 12s0-3.91-.5-5.8zM9.6 15.6V8.4l6.27 3.6L9.6 15.6z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38A5.86 5.86 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z"/></svg>',
};

function socialName(href) {
  const h = (href || '').toLowerCase();
  if (h.includes('linkedin')) return 'linkedin';
  if (h.includes('facebook')) return 'facebook';
  if (h.includes('youtube')) return 'youtube';
  if (h.includes('instagram')) return 'instagram';
  return null;
}

function fixImagePath(img) {
  const src = img.getAttribute('src');
  if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
    img.setAttribute('src', `/${src}`);
  }
  return img;
}

async function fetchFooterHtml() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    const footerMeta = getMetadata('footer');
    const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
    resp = await fetch(`${footerPath}.plain.html`);
  }
  if (!resp.ok) return null;
  return resp.text();
}

/**
 * Build the multi-column link grid from a flat sequence of heading <p> + <ul>
 * pairs. Groups are distributed into columns following the source layout.
 */
function buildLinkGrid(section) {
  const grid = document.createElement('div');
  grid.className = 'footer-links';

  // Collect ordered (heading, list) group pairs.
  const groups = [];
  Array.from(section.children).forEach((el) => {
    if (el.tagName === 'P') {
      groups.push({ heading: el.textContent.trim(), list: null });
    } else if (el.tagName === 'UL' && groups.length) {
      groups[groups.length - 1].list = el;
    }
  });

  // Source column distribution by group heading.
  const columnPlan = [
    ['Who We Are', 'What We Do', 'Forge', 'Accelerator OS', 'Investors'],
    ['People', 'Businesses', 'News'],
    ['Industries', 'Outcomes'],
    ['Legal', 'Support', 'Contact Us'],
  ];

  columnPlan.forEach((headings) => {
    const col = document.createElement('div');
    col.className = 'footer-col';
    headings.forEach((h) => {
      const group = groups.find((g) => g.heading === h);
      if (!group) return;
      const groupEl = document.createElement('div');
      groupEl.className = 'footer-group';
      const heading = document.createElement('p');
      heading.className = 'footer-group-title';
      heading.textContent = group.heading;
      groupEl.append(heading);
      if (group.list) {
        const ul = document.createElement('ul');
        Array.from(group.list.querySelectorAll(':scope > li')).forEach((li) => {
          const a = li.querySelector('a');
          if (!a) return;
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = a.getAttribute('href');
          link.textContent = a.textContent.trim();
          item.append(link);
          ul.append(item);
        });
        groupEl.append(ul);
      }
      col.append(groupEl);
    });
    grid.append(col);
  });

  return grid;
}

/** Build the bottom bar: logo, Contact Us link, Follow Us + social icons. */
function buildBottomBar(section) {
  const bar = document.createElement('div');
  bar.className = 'footer-bar';

  const logoLink = section.querySelector('a img')?.closest('a');
  if (logoLink) {
    const a = document.createElement('a');
    a.href = logoLink.getAttribute('href');
    a.className = 'footer-logo';
    const img = logoLink.querySelector('img');
    if (img) a.append(fixImagePath(img.cloneNode(true)));
    bar.append(a);
  }

  const right = document.createElement('div');
  right.className = 'footer-bar-right';

  // Contact Us link (the non-logo, non-social link)
  const contact = Array.from(section.querySelectorAll('p > a')).find((a) => !a.querySelector('img'));
  if (contact) {
    const c = document.createElement('a');
    c.href = contact.getAttribute('href');
    c.className = 'footer-contact';
    c.textContent = contact.textContent.trim();
    right.append(c);
  }

  // Follow Us label
  const followLabel = Array.from(section.querySelectorAll('p')).find((p) => p.textContent.trim() === 'Follow Us');
  if (followLabel) {
    const label = document.createElement('span');
    label.className = 'footer-follow-label';
    label.textContent = 'Follow Us';
    right.append(label);
  }

  // Social icons (inline SVG)
  const socialUl = section.querySelector('ul');
  if (socialUl) {
    const social = document.createElement('div');
    social.className = 'footer-social';
    Array.from(socialUl.querySelectorAll(':scope > li > a')).forEach((a) => {
      const href = a.getAttribute('href');
      const name = socialName(href);
      const link = document.createElement('a');
      link.href = href;
      link.className = 'footer-social-icon';
      link.setAttribute('aria-label', a.textContent.trim());
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
      link.innerHTML = name ? SOCIAL_SVG[name] : a.textContent.trim();
      social.append(link);
    });
    right.append(social);
  }

  bar.append(right);
  return bar;
}

/** Build the copyright row: copyright text + legal links. */
function buildCopyright(section) {
  const row = document.createElement('div');
  row.className = 'footer-copyright-row';

  const cp = Array.from(section.querySelectorAll('p')).find((p) => p.textContent.includes('Copyright'));
  if (cp) {
    const text = document.createElement('p');
    text.className = 'footer-copyright';
    text.textContent = cp.textContent.trim();
    row.append(text);
  }

  const legalUl = section.querySelector('ul');
  if (legalUl) {
    const legal = document.createElement('ul');
    legal.className = 'footer-legal';
    Array.from(legalUl.querySelectorAll(':scope > li > a')).forEach((a) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      li.append(link);
      legal.append(li);
    });
    row.append(legal);
  }

  return row;
}

export default async function decorate(block) {
  const html = await fetchFooterHtml();
  block.textContent = '';
  if (!html) return;

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const sections = tmp.querySelectorAll(':scope > div');

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  if (sections[0]) footer.append(buildLinkGrid(sections[0]));
  if (sections[1]) footer.append(buildBottomBar(sections[1]));
  if (sections[2]) footer.append(buildCopyright(sections[2]));

  block.append(footer);
}
