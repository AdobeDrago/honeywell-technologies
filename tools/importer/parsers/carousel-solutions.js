/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-solutions. Base: carousel.
 * Source: https://honeywellbt.stage.honeywell.com/us/en (div.solutions-carousel.aem-GridColumn)
 * Generated: 2026-06-23
 *
 * Block library (Carousel): 2 columns, multiple rows.
 *   Row 1: block name.
 *   Each subsequent row = one slide: cell 1 image | cell 2 (title + description + optional CTA link).
 *
 * Source notes: the first slide is an intro CTA card
 * (`article.solutions-carousel__cta-card`) with an eyebrow + title and NO image —
 * it becomes a slide with an empty image cell. The 6 solution cards are
 * `a[href] > article.solutions-carousel__solution-card`, each with a card image,
 * an h3 title, a description paragraph, and a wrapping anchor href. We preserve the
 * link by turning the title into a linked heading.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('article.solutions-carousel__solution-card'));

  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const isCta = card.classList.contains('solutions-carousel__cta-card');

    // Image (solution cards only; the CTA intro card has none).
    const image = card.querySelector('.solutions-carousel__card-media img, img.solutions-carousel__card-img, img');

    const contentCell = [];

    if (isCta) {
      // Intro slide: eyebrow + title.
      const eyebrow = card.querySelector('.solutions-carousel__eyebrow');
      const title = card.querySelector('.solutions-carousel__cta-title, h1, h2, h3');
      if (eyebrow) contentCell.push(eyebrow);
      if (title) contentCell.push(title);
    } else {
      const title = card.querySelector('.solutions-carousel__card-title, h1, h2, h3, h4');
      const desc = card.querySelector('.solutions-carousel__card-desc, .solutions-carousel__card-body p, p');
      // Wrapping anchor provides the slide link.
      const anchor = card.closest('a[href]');
      const href = anchor ? anchor.getAttribute('href') : null;

      if (title) {
        if (href) {
          // Preserve the link by wrapping the title text in an anchor (linked heading).
          const link = document.createElement('a');
          link.setAttribute('href', href);
          link.textContent = title.textContent.trim();
          contentCell.push(link);
        } else {
          contentCell.push(title);
        }
      }
      if (desc) contentCell.push(desc);
    }

    // 2-column: image | content. CTA intro card gets an empty image cell.
    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-solutions', cells });
  element.replaceWith(block);
}
