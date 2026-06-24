/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tiles. Base: cards (variant: no images).
 * Source: https://honeywellbt.stage.honeywell.com/us/en (div.industry-grid.aem-GridColumn)
 * Generated: 2026-06-23
 *
 * Block library (Cards, no images): 1 column, multiple rows.
 *   Row 1: block name 'cards-tiles'.
 *   Each subsequent row = one card: single cell with a linked title (no image).
 *
 * Source notes: 12 industry tiles are `a.tile-grid__item` with an href; the title
 * text is in `.content-box .title`. The leading `.cmp-tile-grid__header` holds the
 * eyebrow (`.cmp-tile-grid__eyebrow`) and heading (`.cmp-tile-grid__title`); it is
 * emitted as default content before the block so the "Industries" / "Tangible
 * results..." copy is preserved. We rebuild each tile as a single anchor wrapping
 * the title text so the linked title is preserved.
 */
export default function parse(element, { document }) {
  const tiles = Array.from(element.querySelectorAll('a.tile-grid__item, .tile-grid__item'));

  if (!tiles.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Preserve the section header (eyebrow + heading) as default content.
  const defaultContent = [];
  const eyebrow = element.querySelector('.cmp-tile-grid__eyebrow, .cmp-tile-grid__header .eyebrow');
  if (eyebrow && eyebrow.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    defaultContent.push(p);
  }
  const headerHeading = element.querySelector('.cmp-tile-grid__title, .cmp-tile-grid__header h1, .cmp-tile-grid__header h2, .cmp-tile-grid__header h3');
  if (headerHeading && headerHeading.textContent.trim()) {
    const heading = document.createElement(headerHeading.tagName.toLowerCase());
    heading.textContent = headerHeading.textContent.trim();
    defaultContent.push(heading);
  }

  const cells = [];

  tiles.forEach((tile) => {
    const titleEl = tile.querySelector('.content-box .title, .title');
    const titleText = (titleEl ? titleEl.textContent : tile.textContent).trim();
    const href = tile.getAttribute('href');

    if (!titleText) return;

    let cellContent;
    if (href && href !== 'javascript:void(0)') {
      // Linked title: rebuild a clean anchor with just the title text.
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = titleText;
      cellContent = link;
    } else {
      cellContent = titleText;
    }

    // 1-column: one row, one cell.
    cells.push([cellContent]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tiles', cells });
  element.replaceWith(...defaultContent, block);
}
