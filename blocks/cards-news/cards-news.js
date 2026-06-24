import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../ue/scripts/ue-utils.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-news-card-image';
      } else {
        div.className = 'cards-news-card-body';
        // Tag the category eyebrow (paragraph before the heading) and the
        // description (paragraph after the heading) so the hover reveal and the
        // always-on category can be styled separately.
        const children = [...div.children];
        const headingIdx = children.findIndex((el) => /^H[1-6]$/.test(el.tagName));
        children.forEach((el, idx) => {
          if (el.tagName !== 'P') return;
          const isCategory = headingIdx !== -1 && idx < headingIdx;
          el.classList.add(isCategory ? 'cards-news-card-category' : 'cards-news-card-desc');
        });
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
