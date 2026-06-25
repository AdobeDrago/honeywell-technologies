import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment HTML. Tries local content first (aem up / localhost),
 * then falls back to the DA/EDS production path from block metadata.
 */
async function fetchNavHtml() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    const navMeta = getMetadata('nav');
    const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
    resp = await fetch(`${navPath}.plain.html`);
  }
  if (!resp.ok) return null;
  return resp.text();
}

/**
 * Normalise a fragment-relative image path (e.g. "images/foo.svg") to a
 * root-absolute path ("/images/foo.svg"). The nav fragment uses relative
 * paths (required by content validation) but is consumed on arbitrary page
 * URLs, so relative resolution would break on nested paths.
 */
function fixImagePath(img) {
  const src = img.getAttribute('src');
  if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
    img.setAttribute('src', `/${src}`);
  }
  return img;
}

/**
 * Get an <li>'s own link, tolerating a <p> wrapper. Plain-HTML pipelines differ:
 * localhost/aem serves bare `<li><a>`, while DA/EDS production wraps the link in
 * a paragraph (`<li><p><a>`). Matching both keeps the nav working everywhere.
 */
function ownLink(li) {
  return li.querySelector(':scope > a, :scope > p > a');
}

/** Close any open desktop flyout. */
function closeAllFlyouts(nav) {
  nav.querySelectorAll('.nav-main-item.has-flyout[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });
  const overlay = document.querySelector('.nav-overlay');
  if (overlay) overlay.classList.remove('is-visible');
}

/** Build the desktop main navigation (menubar + hover flyouts). */
function buildMainNav(sourceUl, nav) {
  const menubar = document.createElement('ul');
  menubar.className = 'nav-main';

  Array.from(sourceUl.children).forEach((li) => {
    const topLink = ownLink(li);
    const groupUls = li.querySelectorAll(':scope > ul');
    const item = document.createElement('li');
    item.className = 'nav-main-item';

    const trigger = document.createElement('a');
    trigger.className = 'nav-main-link';
    trigger.href = topLink ? topLink.getAttribute('href') : '#';
    trigger.textContent = topLink ? topLink.textContent.trim() : '';
    item.append(trigger);

    if (groupUls.length) {
      item.classList.add('has-flyout');
      item.setAttribute('aria-expanded', 'false');

      const flyout = document.createElement('div');
      flyout.className = 'nav-flyout';
      const inner = document.createElement('div');
      inner.className = 'nav-flyout-inner';

      groupUls.forEach((ul) => {
        const col = document.createElement('div');
        const hasImages = !!ul.querySelector('img');
        col.className = hasImages ? 'nav-flyout-col nav-flyout-featured' : 'nav-flyout-col';
        const colList = document.createElement('ul');
        Array.from(ul.children).forEach((sourceLi) => {
          const a = ownLink(sourceLi);
          if (!a) return;
          const cell = document.createElement('li');
          const link = document.createElement('a');
          link.href = a.getAttribute('href');
          const img = a.querySelector('img');
          if (img) {
            const picture = (img.closest('picture') || img).cloneNode(true);
            picture.querySelectorAll('img').forEach(fixImagePath);
            if (picture.tagName === 'IMG') fixImagePath(picture);
            link.append(picture);
            const caption = document.createElement('span');
            caption.textContent = a.textContent.trim();
            link.append(caption);
            cell.className = 'nav-flyout-card';
          } else {
            link.textContent = a.textContent.trim();
          }
          cell.append(link);
          colList.append(cell);
        });
        col.append(colList);
        inner.append(col);
      });

      flyout.append(inner);
      item.append(flyout);

      // hover open/close on desktop
      item.addEventListener('mouseenter', () => {
        if (!isDesktop.matches) return;
        closeAllFlyouts(nav);
        item.setAttribute('aria-expanded', 'true');
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) overlay.classList.add('is-visible');
      });
      item.addEventListener('mouseleave', () => {
        if (!isDesktop.matches) return;
        item.setAttribute('aria-expanded', 'false');
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) overlay.classList.remove('is-visible');
      });
    }

    menubar.append(item);
  });

  return menubar;
}

/**
 * Build the slide-in panel (hamburger) content: locale drill-down selector
 * plus utility links (Contact, Support). The panel is a stack of views;
 * clicking a parent slides to the child view, the back arrow returns.
 */
function buildSlidePanel(sourceUl, mainNavUl) {
  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  const viewport = document.createElement('div');
  viewport.className = 'nav-panel-viewport';
  panel.append(viewport);

  // root view
  const rootView = document.createElement('div');
  rootView.className = 'nav-panel-view is-active';
  const rootList = document.createElement('ul');

  const views = [];

  // Mobile main-nav accordion: the 8 top-level items live in the drawer on
  // mobile. Items with sub-lists expand inline (accordion); plain items link.
  function buildMobileAccordion(ul) {
    const acc = document.createElement('ul');
    acc.className = 'nav-mobile-accordion';
    Array.from(ul.children).forEach((li) => {
      const a = ownLink(li);
      const groupUls = li.querySelectorAll(':scope > ul');
      const row = document.createElement('li');
      if (groupUls.length) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-mobile-acc-toggle';
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = a ? a.textContent.trim() : '';
        const sub = document.createElement('div');
        sub.className = 'nav-mobile-acc-panel';
        groupUls.forEach((g) => {
          const subUl = document.createElement('ul');
          Array.from(g.children).forEach((sLi) => {
            const sa = ownLink(sLi);
            if (!sa) return;
            const sItem = document.createElement('li');
            const sLink = document.createElement('a');
            sLink.href = sa.getAttribute('href');
            sLink.textContent = sa.textContent.trim();
            sItem.append(sLink);
            subUl.append(sItem);
          });
          sub.append(subUl);
        });
        btn.addEventListener('click', () => {
          const open = btn.getAttribute('aria-expanded') === 'true';
          // single-expand: close siblings
          acc.querySelectorAll('.nav-mobile-acc-toggle[aria-expanded="true"]').forEach((b) => {
            if (b !== btn) b.setAttribute('aria-expanded', 'false');
          });
          btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
        row.append(btn, sub);
      } else if (a) {
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.className = 'nav-mobile-acc-link';
        link.textContent = a.textContent.trim();
        row.append(link);
      }
      acc.append(row);
    });
    return acc;
  }

  if (mainNavUl) rootView.append(buildMobileAccordion(mainNavUl));

  // Recursively build a view for any <li> that has a nested <ul>.
  function buildView(ul, title, parentView) {
    const view = document.createElement('div');
    view.className = 'nav-panel-view';

    if (title) {
      const header = document.createElement('div');
      header.className = 'nav-panel-header';
      const back = document.createElement('button');
      back.type = 'button';
      back.className = 'nav-panel-back';
      back.setAttribute('aria-label', 'Back');
      back.addEventListener('click', () => {
        view.classList.remove('is-active');
        if (parentView) parentView.classList.add('is-active');
      });
      const heading = document.createElement('span');
      heading.className = 'nav-panel-title';
      heading.textContent = title;
      header.append(back, heading);
      view.append(header);
    }

    const list = document.createElement('ul');
    Array.from(ul.children).forEach((li) => {
      const a = ownLink(li);
      const childUl = li.querySelector(':scope > ul');
      const row = document.createElement('li');
      if (childUl) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-panel-drill';
        btn.textContent = a ? a.textContent.trim() : '';
        const childView = buildView(childUl, a ? a.textContent.trim() : '', view);
        btn.addEventListener('click', () => {
          view.classList.remove('is-active');
          childView.classList.add('is-active');
        });
        row.append(btn);
      } else if (a) {
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = a.textContent.trim();
        row.append(link);
      }
      list.append(row);
    });
    view.append(list);
    viewport.append(view);
    views.push(view);
    return view;
  }

  Array.from(sourceUl.children).forEach((li) => {
    const a = ownLink(li);
    const childUl = li.querySelector(':scope > ul');
    const row = document.createElement('li');
    if (childUl) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-panel-drill';
      btn.textContent = a ? a.textContent.trim() : '';
      const childView = buildView(childUl, a ? a.textContent.trim() : '', rootView);
      btn.addEventListener('click', () => {
        rootView.classList.remove('is-active');
        childView.classList.add('is-active');
      });
      row.append(btn);
    } else if (a) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      row.append(link);
    }
    rootList.append(row);
  });

  rootView.append(rootList);
  viewport.prepend(rootView);
  views.push(rootView);

  const resetViews = () => {
    views.forEach((v) => v.classList.remove('is-active'));
    rootView.classList.add('is-active');
  };

  return { panel, resetViews };
}

export default async function decorate(block) {
  const html = await fetchNavHtml();
  block.textContent = '';
  if (!html) return;

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const sections = tmp.querySelectorAll(':scope > div');
  const brandSection = sections[0];
  const navSection = sections[1];
  const panelSection = sections[2];

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  // Brand (logo)
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) {
    const a = brandSection.querySelector('a');
    if (a) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.className = 'nav-logo';
      const img = a.querySelector('img');
      if (img) link.append(fixImagePath(img.cloneNode(true)));
      brand.append(link);
    }
  }
  nav.append(brand);

  // Main nav (desktop menubar with flyouts)
  const sectionsWrap = document.createElement('div');
  sectionsWrap.className = 'nav-sections';
  const sourceMainUl = navSection ? navSection.querySelector(':scope > ul') : null;
  if (sourceMainUl) sectionsWrap.append(buildMainNav(sourceMainUl, nav));
  nav.append(sectionsWrap);

  // Tools: hamburger + slide-in panel
  const tools = document.createElement('div');
  tools.className = 'nav-tools';

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open Menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  tools.append(hamburger);

  nav.append(tools);

  // The slide-in panel is position:fixed; append it directly to nav (not to
  // the small hamburger tools container) so its container chain measures
  // full-width on mobile.
  let panelApi = null;
  if (panelSection) {
    const sourcePanelUl = panelSection.querySelector(':scope > ul');
    if (sourcePanelUl) {
      panelApi = buildSlidePanel(sourcePanelUl, sourceMainUl);
      nav.append(panelApi.panel);
    }
  }

  // Overlay (backdrop) shared by flyouts and slide-in panel
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.addEventListener('click', () => {
    closeAllFlyouts(nav);
    nav.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open Menu');
    document.body.style.overflowY = '';
    overlay.classList.remove('is-visible');
  });

  hamburger.addEventListener('click', () => {
    const open = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', open ? 'false' : 'true');
    hamburger.setAttribute('aria-expanded', open ? 'false' : 'true');
    hamburger.setAttribute('aria-label', open ? 'Open Menu' : 'Close Menu');
    document.body.style.overflowY = open ? '' : 'hidden';
    overlay.classList.toggle('is-visible', !open);
    if (open && panelApi) panelApi.resetViews();
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      closeAllFlyouts(nav);
      nav.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open Menu');
      document.body.style.overflowY = '';
      overlay.classList.remove('is-visible');
    }
  });

  // Reset transient state when crossing the desktop/mobile breakpoint.
  isDesktop.addEventListener('change', () => {
    closeAllFlyouts(nav);
    nav.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open Menu');
    document.body.style.overflowY = '';
    overlay.classList.remove('is-visible');
    if (panelApi) panelApi.resetViews();
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
  block.append(overlay);
}
