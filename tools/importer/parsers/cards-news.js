/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base: cards (with images).
 * Source: https://honeywellbt.stage.honeywell.com/us/en (div.business-grid.aem-GridColumn)
 * Generated: 2026-06-23
 *
 * Block library (Cards): 2 columns, multiple rows.
 *   Row 1: block name 'cards-news'.
 *   Each subsequent row = one card: cell 1 image | cell 2 (title + description), linked.
 *
 * Source notes: 6 article cards are `li.business-grid-item`, each wrapped in
 * `a.business-grid-item__container[href]`. Image is `.business-grid-item__image img`,
 * title is `h3.business-grid-item__title`, description is `p.business-grid-item__desc`.
 * The leading `.business-grid__header` (eyebrow + heading) is default content (per
 * authoring analysis) and is excluded. The card link is preserved by wrapping the
 * title text in an anchor.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('li.business-grid-item, .business-grid-item'));

  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    const anchor = item.querySelector('a.business-grid-item__container, a[href]');
    const href = anchor ? anchor.getAttribute('href') : null;

    const image = item.querySelector('.business-grid-item__image img, img');
    const titleEl = item.querySelector('.business-grid-item__title, h1, h2, h3, h4');
    const desc = item.querySelector('.business-grid-item__desc, .business-grid-item__details p, p.business-grid-item__desc');

    const contentCell = [];
    if (titleEl) {
      const titleText = titleEl.textContent.trim();
      if (href) {
        // Preserve the card link as a linked heading.
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = titleText;
        const heading = document.createElement(titleEl.tagName.toLowerCase());
        heading.appendChild(link);
        contentCell.push(heading);
      } else {
        contentCell.push(titleEl);
      }
    }
    if (desc && desc.textContent.trim()) contentCell.push(desc);

    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
