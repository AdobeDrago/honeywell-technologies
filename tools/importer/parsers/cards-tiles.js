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
 * text is in `.content-box .title`. The leading eyebrow + heading
 * (`.cmp-tile-grid__header`) is default content (per authoring analysis) and is
 * intentionally excluded from this block. We rebuild each tile as a single anchor
 * wrapping the title text so the linked title is preserved.
 */
export default function parse(element, { document }) {
  const tiles = Array.from(element.querySelectorAll('a.tile-grid__item, .tile-grid__item'));

  if (!tiles.length) {
    element.replaceWith(...element.childNodes);
    return;
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
  element.replaceWith(block);
}
