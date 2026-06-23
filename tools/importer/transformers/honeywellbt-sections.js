/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: honeywellbt section breaks + section metadata.
 *
 * Driven by payload.template.sections (page-templates.json, template "homepage",
 * 7 sections). For each section (processed in reverse document order):
 *   - inserts an <hr> section break before the section element when it is not
 *     the first section and content precedes it;
 *   - inserts a Section Metadata block after the section element when the
 *     section has a non-null `style`.
 *
 * The homepage template's 7 section selectors are all verified to exist in
 * migration-work/cleaned.html (e.g. div.hero.aem-GridColumn at line 867,
 * div.storytelling.aem-GridColumn at line 896). All 7 sections currently have
 * style === null, so no Section Metadata blocks are emitted; 6 <hr> breaks are
 * expected (sections.length - 1).
 *
 * Runs in afterTransform only.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve a section to its element in the post-parse DOM. The original
  // source selector (e.g. div.hero.aem-GridColumn) no longer matches after
  // the block parsers replace those containers with generated block tables
  // (e.g. div.hero-intro). Fall back to the section's block-variant class —
  // the parser leaves the block-variant div as a sibling of the other blocks,
  // so inserting an <hr> directly before it produces a section break between
  // adjacent blocks (which the markdown round-trip turns into separate EDS
  // sections). Do NOT climb to a shared wrapper: all blocks share one wrapper,
  // so climbing would collapse every section onto the same element.
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

  // Process in reverse order so inserts don't disturb the positions of
  // sections we have not handled yet.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    if (!section) continue;

    const sectionEl = resolveSectionEl(section);
    if (!sectionEl) continue;

    // Section Metadata block (only when a style is defined for the section).
    if (section.style) {
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.after(metadataBlock);
    }

    // Section break: <hr> before every non-first section that has content
    // preceding it in the document.
    if (i > 0 && sectionEl.previousElementSibling) {
      const hr = doc.createElement('hr');
      sectionEl.before(hr);
    }
  }
}
