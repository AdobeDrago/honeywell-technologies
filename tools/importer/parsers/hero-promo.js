/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-promo. Base: hero.
 * Source: https://honeywellbt.stage.honeywell.com/us/en (div.promobanner.aem-GridColumn)
 * Generated: 2026-06-23
 *
 * Block library (Hero): 1 column, 3 rows.
 *   Row 1: block name.
 *   Row 2: background image (optional) — omitted here (background is a CSS color, no <img>).
 *   Row 3: eyebrow + heading + CTA, all in a single cell.
 *
 * Source notes: eyebrow is `.eyebrow`, heading is `.description h3`, the CTA is
 * `.cta a[href]` with the label nested in `.anchor-text` — we rebuild a clean anchor.
 */
export default function parse(element, { document }) {
  const eyebrow = element.querySelector('.eyebrow');
  const heading = element.querySelector('.description h3, .promobanner__text h1, .promobanner__text h2, h3, h1, h2');
  const ctaAnchor = element.querySelector('.cta a[href], a[href]');
  const bgImage = element.querySelector('img[class*="background"], .promobanner__media img, img');

  if (!heading && !eyebrow) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: optional background image (only if a real <img> exists).
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: eyebrow + heading + CTA in a single cell.
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (ctaAnchor) {
    const href = ctaAnchor.getAttribute('href');
    const label = ctaAnchor.textContent.trim();
    if (href && label) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = label;
      contentCell.push(link);
    }
  }
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
