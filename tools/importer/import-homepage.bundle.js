/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-intro.js
  function parse(element, { document }) {
    const heading = element.querySelector(".cmp-secondary-hero__heading, h1");
    const description = element.querySelector("p.description, .description-box p, p");
    const ctaLink = element.querySelector(".contact-sales-btn a, a.cta, a.button");
    const bgImage = element.querySelector('.feature-image img, img[class*="background"], img');
    if (!heading && !description) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLink) contentCell.push(ctaLink);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-story.js
  function parse2(element, { document }) {
    let slides = Array.from(
      element.querySelectorAll(".cmp-storytelling__slides > .cmp-storytelling__slide")
    );
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".cmp-storytelling__slide"));
    }
    if (!slides.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".cmp-storytelling__slide-image img, img:not(:first-child)");
      const content = slide.querySelector(".cmp-storytelling__slide-content") || slide;
      const title = content.querySelector(".cmp-storytelling__slide-title, h1, h2, h3, h4");
      const text = content.querySelector(".cmp-storytelling__slide-text, p");
      const cta = content.querySelector("a.cta, a.button, a");
      const contentCell = [];
      if (title) contentCell.push(title);
      if (text) contentCell.push(text);
      if (cta) contentCell.push(cta);
      cells.push([image || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tiles.js
  function parse3(element, { document }) {
    const tiles = Array.from(element.querySelectorAll("a.tile-grid__item, .tile-grid__item"));
    if (!tiles.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const defaultContent = [];
    const eyebrow = element.querySelector(".cmp-tile-grid__eyebrow, .cmp-tile-grid__header .eyebrow");
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      defaultContent.push(p);
    }
    const headerHeading = element.querySelector(".cmp-tile-grid__title, .cmp-tile-grid__header h1, .cmp-tile-grid__header h2, .cmp-tile-grid__header h3");
    if (headerHeading && headerHeading.textContent.trim()) {
      const heading = document.createElement(headerHeading.tagName.toLowerCase());
      heading.textContent = headerHeading.textContent.trim();
      defaultContent.push(heading);
    }
    const cells = [];
    tiles.forEach((tile) => {
      const titleEl = tile.querySelector(".content-box .title, .title");
      const titleText = (titleEl ? titleEl.textContent : tile.textContent).trim();
      const href = tile.getAttribute("href");
      if (!titleText) return;
      let cellContent;
      if (href && href !== "javascript:void(0)") {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = titleText;
        cellContent = link;
      } else {
        cellContent = titleText;
      }
      cells.push([cellContent]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-tiles", cells });
    element.replaceWith(...defaultContent, block);
  }

  // tools/importer/parsers/carousel-solutions.js
  function parse4(element, { document }) {
    const cards = Array.from(element.querySelectorAll("article.solutions-carousel__solution-card"));
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const isCta = card.classList.contains("solutions-carousel__cta-card");
      const image = card.querySelector(".solutions-carousel__card-media img, img.solutions-carousel__card-img, img");
      const contentCell = [];
      if (isCta) {
        const eyebrow = card.querySelector(".solutions-carousel__eyebrow");
        const title = card.querySelector(".solutions-carousel__cta-title, h1, h2, h3");
        if (eyebrow) contentCell.push(eyebrow);
        if (title) contentCell.push(title);
      } else {
        const title = card.querySelector(".solutions-carousel__card-title, h1, h2, h3, h4");
        const desc = card.querySelector(".solutions-carousel__card-desc, .solutions-carousel__card-body p, p");
        const anchor = card.closest("a[href]");
        const href = anchor ? anchor.getAttribute("href") : null;
        if (title) {
          if (href) {
            const link = document.createElement("a");
            link.setAttribute("href", href);
            link.textContent = title.textContent.trim();
            contentCell.push(link);
          } else {
            contentCell.push(title);
          }
        }
        if (desc) contentCell.push(desc);
      }
      cells.push([image || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-solutions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-stories.js
  function parse5(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".full-width-image-slide"));
    if (!slides.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const defaultContent = [];
    const eyebrow = element.querySelector(".carousel__header .eyebrow");
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      defaultContent.push(p);
    }
    const headerHeading = element.querySelector(".carousel__title, .carousel__header h1, .carousel__header h2, .carousel__header h3");
    if (headerHeading && headerHeading.textContent.trim()) {
      const heading = document.createElement(headerHeading.tagName.toLowerCase());
      heading.textContent = headerHeading.textContent.trim();
      defaultContent.push(heading);
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".slide__image-container img, .wrapper__image img, img");
      const content = slide.querySelector(".slide__content-wrapper") || slide;
      const subtitle = content.querySelector(".slide__subtitle, h1, h2, h3");
      const text = content.querySelector(".slide__text, p");
      const ctaAnchor = content.querySelector(".cta a[href], a[href]");
      const contentCell = [];
      if (subtitle) contentCell.push(subtitle);
      if (text) contentCell.push(text);
      if (ctaAnchor) {
        const href = ctaAnchor.getAttribute("href");
        const label = ctaAnchor.textContent.trim();
        if (href && label) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = label;
          contentCell.push(link);
        }
      }
      cells.push([image || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-stories", cells });
    element.replaceWith(...defaultContent, block);
  }

  // tools/importer/parsers/cards-news.js
  function parse6(element, { document }) {
    const items = Array.from(element.querySelectorAll("li.business-grid-item, .business-grid-item"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const defaultContent = [];
    const eyebrow = element.querySelector(".business-grid__eyebrow");
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      defaultContent.push(p);
    }
    const headerHeading = element.querySelector(".business-grid__title, .business-grid__header h1, .business-grid__header h2, .business-grid__header h3");
    if (headerHeading && headerHeading.textContent.trim()) {
      const heading = document.createElement(headerHeading.tagName.toLowerCase());
      heading.textContent = headerHeading.textContent.trim();
      defaultContent.push(heading);
    }
    const cells = [];
    items.forEach((item) => {
      const anchor = item.querySelector("a.business-grid-item__container, a[href]");
      const href = anchor ? anchor.getAttribute("href") : null;
      const image = item.querySelector(".business-grid-item__image img, img");
      const titleEl = item.querySelector(".business-grid-item__title, h1, h2, h3, h4");
      const desc = item.querySelector(".business-grid-item__desc, .business-grid-item__details p, p.business-grid-item__desc");
      const contentCell = [];
      if (titleEl) {
        const titleText = titleEl.textContent.trim();
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = titleText;
          const heading = document.createElement(titleEl.tagName.toLowerCase());
          heading.appendChild(link);
          contentCell.push(heading);
        } else {
          contentCell.push(titleEl);
        }
      }
      if (desc && desc.textContent.trim()) contentCell.push(desc);
      cells.push([image || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(...defaultContent, block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse7(element, { document }) {
    const eyebrow = element.querySelector(".eyebrow");
    const heading = element.querySelector(".description h3, .promobanner__text h1, .promobanner__text h2, h3, h1, h2");
    const ctaAnchor = element.querySelector(".cta a[href], a[href]");
    const bgImage = element.querySelector('img[class*="background"], .promobanner__media img, img');
    if (!heading && !eyebrow) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    if (ctaAnchor) {
      const href = ctaAnchor.getAttribute("href");
      const label = ctaAnchor.textContent.trim();
      if (href && label) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = label;
        contentCell.push(link);
      }
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/honeywellbt-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cookie-banner",
        "#onetrust-consent-sdk"
      ]);
      element.querySelectorAll(
        'img[src*="t.co/i/adsct"], img[src*="analytics.twitter.com"], img[src*="rlcdn.com"]'
      ).forEach((img) => {
        const wrapper = img.closest("picture") || img;
        const para = wrapper.closest("p");
        (para || wrapper).remove();
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        ".cmp-experiencefragment--footer",
        "aside.modals",
        "input.form-control",
        ".page_global_info",
        ".user_global_info",
        ".page_load_event_info",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("[data-cmp-data-layer], [data-cmp-data-layer-enabled]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-data-layer-enabled");
      });
    }
  }

  // tools/importer/transformers/honeywellbt-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/transformers/honeywellbt-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform3(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    function resolveSectionEl(section) {
      const el = section.selector ? element.querySelector(section.selector) : null;
      if (el) return el;
      const blockNames = Array.isArray(section.blocks) ? section.blocks : [];
      for (let b = 0; b < blockNames.length; b += 1) {
        const candidate = element.querySelector(`div.${blockNames[b]}`);
        if (candidate) return candidate;
      }
      return null;
    }
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section) continue;
      const sectionEl = resolveSectionEl(section);
      if (!sectionEl) continue;
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.after(metadataBlock);
      }
      if (i > 0 && sectionEl.previousElementSibling) {
        const hr = doc.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-intro": parse,
    "carousel-story": parse2,
    "cards-tiles": parse3,
    "carousel-solutions": parse4,
    "carousel-stories": parse5,
    "cards-news": parse6,
    "hero-promo": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage template: hero, storytelling carousel, industry tile grid, solutions carousel, full-width image carousel, insights/news grid, and promo banner CTA",
    urls: [
      "https://honeywellbt.stage.honeywell.com/us/en",
      "https://honeywellbt.stage.honeywell.com/us/en/home",
      "https://honeywellbt.stage.honeywell.com/us/en/insights/events/2026/hitec",
      "https://honeywellbt.stage.honeywell.com/us/en/insights/events/2026/isa-otcs",
      "https://honeywellbt.stage.honeywell.com/us/en/insights/events/2026/isa-otcs/thank-you",
      "https://honeywellbt.stage.honeywell.com/us/en/insights/events/2026/nfpa",
      "https://honeywellbt.stage.honeywell.com/us/en/insights/events/2026/niagara-summit"
    ],
    blocks: [
      { name: "hero-intro", instances: ["div.hero.aem-GridColumn"] },
      { name: "carousel-story", instances: ["div.storytelling.aem-GridColumn"] },
      { name: "cards-tiles", instances: ["div.industry-grid.aem-GridColumn"] },
      { name: "carousel-solutions", instances: ["div.solutions-carousel.aem-GridColumn"] },
      { name: "carousel-stories", instances: ["div.full-width-image-carousel.aem-GridColumn"] },
      { name: "cards-news", instances: ["div.business-grid.aem-GridColumn"] },
      { name: "hero-promo", instances: ["div.promobanner.aem-GridColumn"] }
    ],
    sections: [
      { id: "hero", name: "Hero Intro", selector: "div.hero.aem-GridColumn", style: null, blocks: ["hero-intro"], defaultContent: [] },
      { id: "storytelling", name: "Storytelling Carousel", selector: "div.storytelling.aem-GridColumn", style: null, blocks: ["carousel-story"], defaultContent: [] },
      { id: "industry-grid", name: "Industries Grid", selector: "div.industry-grid.aem-GridColumn", style: null, blocks: ["cards-tiles"], defaultContent: ["div.cmp-tile-grid__header"] },
      { id: "solutions-carousel", name: "Solutions Carousel", selector: "div.solutions-carousel.aem-GridColumn", style: null, blocks: ["carousel-solutions"], defaultContent: [] },
      { id: "full-width-image-carousel", name: "Customer Stories Carousel", selector: "div.full-width-image-carousel.aem-GridColumn", style: null, blocks: ["carousel-stories"], defaultContent: ["div.carousel__header"] },
      { id: "business-grid", name: "Insights and News Grid", selector: "div.business-grid.aem-GridColumn", style: null, blocks: ["cards-news"], defaultContent: ["div.business-grid__header"] },
      { id: "promobanner", name: "Promo Banner CTA", selector: "div.promobanner.aem-GridColumn", style: null, blocks: ["hero-promo"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    transform2,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform3] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
