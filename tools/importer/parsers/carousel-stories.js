/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-stories. Base: carousel.
 * Source: https://honeywellbt.stage.honeywell.com/us/en (div.full-width-image-carousel.aem-GridColumn)
 * Generated: 2026-06-23
 *
 * Block library (Carousel): 2 columns, multiple rows.
 *   Row 1: block name.
 *   Each subsequent row = one slide: cell 1 image | cell 2 (subtitle + text + CTA link).
 *
 * Source notes: 3 slides are `.full-width-image-slide`. The leading
 * `.carousel__header` (eyebrow + heading + "View More Stories") is default content
 * (per authoring analysis) and is excluded. Each slide's image is duplicated for
 * desktop/mobile — we take the first. The CTA is `.slide__content-wrapper .cta a`
 * with the label nested in `.anchor-text`; we rebuild a clean anchor.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.full-width-image-slide'));

  if (!slides.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  slides.forEach((slide) => {
    // First image (desktop copy); mobile copy is a duplicate.
    const image = slide.querySelector('.slide__image-container img, .wrapper__image img, img');

    const content = slide.querySelector('.slide__content-wrapper') || slide;
    const subtitle = content.querySelector('.slide__subtitle, h1, h2, h3');
    const text = content.querySelector('.slide__text, p');

    // CTA link — clean anchor using its text label.
    const ctaAnchor = content.querySelector('.cta a[href], a[href]');

    const contentCell = [];
    if (subtitle) contentCell.push(subtitle);
    if (text) contentCell.push(text);
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

    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-stories', cells });
  element.replaceWith(block);
}
