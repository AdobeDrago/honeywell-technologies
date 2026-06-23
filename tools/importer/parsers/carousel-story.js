/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-story. Base: carousel.
 * Source: https://honeywellbt.stage.honeywell.com/us/en (div.storytelling.aem-GridColumn)
 * Generated: 2026-06-23
 *
 * Block library (Carousel): 2 columns, multiple rows.
 *   Row 1: block name.
 *   Each subsequent row = one slide: cell 1 image | cell 2 (title + description + optional CTA).
 *
 * Source notes: real slides live in `.cmp-storytelling__slides > .cmp-storytelling__slide`.
 * Each slide has a decorative full-bleed background <img> (direct child) plus the
 * real content image inside `.cmp-storytelling__slide-image`. We use the content
 * image. A separate `.cmp-storytelling__contentslide` block duplicates the text for
 * mobile — we deliberately do NOT iterate it (we scope to `.cmp-storytelling__slides`).
 */
export default function parse(element, { document }) {
  // Real slides only — scoped to the slides container to skip the mobile contentslide duplicate.
  let slides = Array.from(
    element.querySelectorAll('.cmp-storytelling__slides > .cmp-storytelling__slide'),
  );
  // Fallback if the container class differs across pages.
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.cmp-storytelling__slide'));
  }

  if (!slides.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  slides.forEach((slide) => {
    // Content image (not the decorative background img that is a direct child of the slide).
    const image = slide.querySelector('.cmp-storytelling__slide-image img, img:not(:first-child)');

    const content = slide.querySelector('.cmp-storytelling__slide-content') || slide;
    const title = content.querySelector('.cmp-storytelling__slide-title, h1, h2, h3, h4');
    const text = content.querySelector('.cmp-storytelling__slide-text, p');
    const cta = content.querySelector('a.cta, a.button, a');

    const contentCell = [];
    if (title) contentCell.push(title);
    if (text) contentCell.push(text);
    if (cta) contentCell.push(cta);

    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-story', cells });
  element.replaceWith(block);
}
