/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro. Base: hero.
 * Source: https://honeywellbt.stage.honeywell.com/us/en (div.hero.aem-GridColumn)
 * Generated: 2026-06-23
 *
 * Block library (Hero): 1 column, 3 rows.
 *   Row 1: block name.
 *   Row 2: background image (optional).
 *   Row 3: title (heading) + subheading/paragraph + optional CTA.
 *
 * Source notes: the hero content is duplicated across a mobile description-box
 * and a desktop secondary-column description-box. We extract a single copy of
 * each. The "feature-image" divs are CSS background images (no <img>), so the
 * background row may be empty for this instance.
 */
export default function parse(element, { document }) {
  // Title — H1 heading.
  const heading = element.querySelector('.cmp-secondary-hero__heading, h1');

  // Intro paragraph — pick the first .description (avoids the duplicated copy).
  const description = element.querySelector('p.description, .description-box p, p');

  // Optional CTA — a real link inside the contact-sales button container.
  const ctaLink = element.querySelector('.contact-sales-btn a, a.cta, a.button');

  // Optional background/feature image (only real <img> elements; the
  // .feature-image divs are CSS backgrounds with no <img> in this instance).
  const bgImage = element.querySelector('.feature-image img, img[class*="background"], img');

  // Empty-block guard.
  if (!heading && !description) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional).
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: heading + paragraph + optional CTA, all in a single cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLink) contentCell.push(ctaLink);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
