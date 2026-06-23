/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroIntroParser from './parsers/hero-intro.js';
import carouselStoryParser from './parsers/carousel-story.js';
import cardsTilesParser from './parsers/cards-tiles.js';
import carouselSolutionsParser from './parsers/carousel-solutions.js';
import carouselStoriesParser from './parsers/carousel-stories.js';
import cardsNewsParser from './parsers/cards-news.js';
import heroPromoParser from './parsers/hero-promo.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/honeywellbt-cleanup.js';
import dmImagesTransformer from './transformers/honeywellbt-dm-images.js';
import sectionsTransformer from './transformers/honeywellbt-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-intro': heroIntroParser,
  'carousel-story': carouselStoryParser,
  'cards-tiles': cardsTilesParser,
  'carousel-solutions': carouselSolutionsParser,
  'carousel-stories': carouselStoriesParser,
  'cards-news': cardsNewsParser,
  'hero-promo': heroPromoParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Homepage template: hero, storytelling carousel, industry tile grid, solutions carousel, full-width image carousel, insights/news grid, and promo banner CTA',
  urls: [
    'https://honeywellbt.stage.honeywell.com/us/en',
    'https://honeywellbt.stage.honeywell.com/us/en/home',
    'https://honeywellbt.stage.honeywell.com/us/en/insights/events/2026/hitec',
    'https://honeywellbt.stage.honeywell.com/us/en/insights/events/2026/isa-otcs',
    'https://honeywellbt.stage.honeywell.com/us/en/insights/events/2026/isa-otcs/thank-you',
    'https://honeywellbt.stage.honeywell.com/us/en/insights/events/2026/nfpa',
    'https://honeywellbt.stage.honeywell.com/us/en/insights/events/2026/niagara-summit',
  ],
  blocks: [
    { name: 'hero-intro', instances: ['div.hero.aem-GridColumn'] },
    { name: 'carousel-story', instances: ['div.storytelling.aem-GridColumn'] },
    { name: 'cards-tiles', instances: ['div.industry-grid.aem-GridColumn'] },
    { name: 'carousel-solutions', instances: ['div.solutions-carousel.aem-GridColumn'] },
    { name: 'carousel-stories', instances: ['div.full-width-image-carousel.aem-GridColumn'] },
    { name: 'cards-news', instances: ['div.business-grid.aem-GridColumn'] },
    { name: 'hero-promo', instances: ['div.promobanner.aem-GridColumn'] },
  ],
  sections: [
    { id: 'hero', name: 'Hero Intro', selector: 'div.hero.aem-GridColumn', style: null, blocks: ['hero-intro'], defaultContent: [] },
    { id: 'storytelling', name: 'Storytelling Carousel', selector: 'div.storytelling.aem-GridColumn', style: null, blocks: ['carousel-story'], defaultContent: [] },
    { id: 'industry-grid', name: 'Industries Grid', selector: 'div.industry-grid.aem-GridColumn', style: null, blocks: ['cards-tiles'], defaultContent: ['div.cmp-tile-grid__header'] },
    { id: 'solutions-carousel', name: 'Solutions Carousel', selector: 'div.solutions-carousel.aem-GridColumn', style: null, blocks: ['carousel-solutions'], defaultContent: [] },
    { id: 'full-width-image-carousel', name: 'Customer Stories Carousel', selector: 'div.full-width-image-carousel.aem-GridColumn', style: null, blocks: ['carousel-stories'], defaultContent: ['div.carousel__header'] },
    { id: 'business-grid', name: 'Insights and News Grid', selector: 'div.business-grid.aem-GridColumn', style: null, blocks: ['cards-news'], defaultContent: ['div.business-grid__header'] },
    { id: 'promobanner', name: 'Promo Banner CTA', selector: 'div.promobanner.aem-GridColumn', style: null, blocks: ['hero-promo'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced
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

    // 4. afterTransform cleanup + section breaks/metadata + DM image rewrite
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
