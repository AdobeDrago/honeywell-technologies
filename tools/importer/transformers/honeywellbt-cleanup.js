/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: honeywellbt site-wide cleanup.
 *
 * Removes non-authorable site shell/chrome so the import contains only the
 * page-level authorable content that lives under
 * `main > div.root.responsivegrid > ... > div.responsivegrid` (hero,
 * storytelling, industry-grid, solutions-carousel, full-width-image-carousel,
 * business-grid, promobanner blocks).
 *
 * Every selector below was verified against migration-work/cleaned.html:
 *   - .cmp-experiencefragment--header  (cleaned.html line 6)  global header XF (nav)
 *   - .cmp-experiencefragment--footer  (cleaned.html line 1556) global footer XF
 *   - .cookie-banner                   (cleaned.html line 1969) cookie consent banner (nested in footer XF)
 *   - #onetrust-consent-sdk            (cleaned.html line 2004) OneTrust consent SDK (after </main>)
 *   - aside.modals                     (cleaned.html line 1998) empty modal container (after </main>)
 *   - input.form-control               (cleaned.html lines 2000-2003) stray form inputs (after </main>)
 *   - .page_global_info / .user_global_info / .page_load_event_info
 *                                      (cleaned.html lines 855-860) hidden data-layer tracking divs
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };
// (selectors verified against migration-work/cleaned.html)

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent banners and overlays before block parsing so they
    // never interfere with block matching. Selectors from captured DOM.
    WebImporter.DOMUtils.remove(element, [
      '.cookie-banner',
      '#onetrust-consent-sdk',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable global chrome (header/footer experience fragments,
    // empty modal container, stray form inputs, hidden tracking divs) and
    // unsafe leftover elements. Selectors from captured DOM.
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      'aside.modals',
      'input.form-control',
      '.page_global_info',
      '.user_global_info',
      '.page_load_event_info',
      'iframe',
      'link',
      'noscript',
    ]);

    // Strip data-layer / tracking attributes left on remaining authorable nodes.
    element.querySelectorAll('[data-cmp-data-layer], [data-cmp-data-layer-enabled]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-data-layer-enabled');
    });
  }
}
