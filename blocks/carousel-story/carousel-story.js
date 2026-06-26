import { fetchPlaceholders } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../ue/scripts/ue-utils.js';

const ADVANCE_THROTTLE_MS = 1200;

function setActiveSlide(block, slideIndex) {
  const slides = block.querySelectorAll('.carousel-story-slide');
  const realIndex = ((slideIndex % slides.length) + slides.length) % slides.length;
  block.dataset.activeSlide = realIndex;
  block.style.setProperty('--active-slide', realIndex);

  const counter = block.querySelector('.carousel-story-slide-counter');
  if (counter) counter.textContent = String(realIndex + 1).padStart(2, '0');

  slides.forEach((slide, idx) => {
    const isActive = idx === realIndex;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', !isActive);
    slide.querySelectorAll('a').forEach((link) => {
      if (isActive) link.removeAttribute('tabindex');
      else link.setAttribute('tabindex', '-1');
    });
  });
}

export function showSlide(block, slideIndex = 0) {
  setActiveSlide(block, slideIndex);
}

function bindEvents(block) {
  const slideCount = block.querySelectorAll('.carousel-story-slide').length;
  let lastAdvance = 0;

  const current = () => parseInt(block.dataset.activeSlide || '0', 10);

  // Scrolling down advances to the next slide; scrolling up retreats. The active
  // slide animates diagonally in from the bottom-right (see CSS transitions),
  // replicating the source's parallax-on-scroll behaviour. The wheel is only
  // "captured" while another slide exists in the scroll direction; at the ends
  // the event passes through so the page keeps scrolling normally.
  block.addEventListener('wheel', (e) => {
    const dir = e.deltaY > 0 ? 1 : -1;
    const next = current() + dir;
    if (next < 0 || next >= slideCount) return; // at an end -> let the page scroll

    // Within bounds: consume the scroll and move one slide.
    e.preventDefault();

    const now = Date.now();
    if (now - lastAdvance < ADVANCE_THROTTLE_MS) return;
    lastAdvance = now;
    // Forward (scroll down): incoming slide sweeps from the bottom-right corner.
    // Backward (scroll up): incoming slide sweeps from the top-left corner.
    block.dataset.direction = dir > 0 ? 'forward' : 'back';
    setActiveSlide(block, next);
  }, { passive: false });

  // Keyboard accessibility: arrow keys advance/retreat.
  block.setAttribute('tabindex', '0');
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      block.dataset.direction = 'forward';
      setActiveSlide(block, current() + 1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      block.dataset.direction = 'back';
      setActiveSlide(block, current() - 1);
      e.preventDefault();
    }
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-story-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-story-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-story-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-story-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-story-slides-container');

  const counter = document.createElement('div');
  counter.classList.add('carousel-story-slide-counter');
  counter.setAttribute('aria-hidden', 'true');
  counter.textContent = '01';
  container.append(counter);

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-story-slides');

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  setActiveSlide(block, 0);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
