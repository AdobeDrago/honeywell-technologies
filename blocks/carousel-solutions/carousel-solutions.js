import { fetchPlaceholders } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../ue/scripts/ue-utils.js';

function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCounter(block) {
  const counter = block.querySelector('.carousel-solutions-counter-current');
  if (!counter) return;
  const active = parseInt(block.dataset.activeSlide || '0', 10);
  counter.textContent = pad(active + 1);
}

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-solutions');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-solutions-slide');
  const prevButton = block.querySelector('.slide-prev');
  const nextButton = block.querySelector('.slide-next');
  if (prevButton) prevButton.disabled = slideIndex <= 0;
  if (nextButton) nextButton.disabled = slideIndex >= slides.length - 1;

  updateCounter(block);
}

export function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-solutions-slide');
  let realSlideIndex = slideIndex < 0 ? 0 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = slides.length - 1;
  const activeSlide = slides[realSlideIndex];

  block.querySelector('.carousel-solutions-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slidesEl = block.querySelector('.carousel-solutions-slides');
  const slideObserver = new IntersectionObserver((entries) => {
    // pick the most-visible intersecting slide as the active (left-most) one
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.target.offsetLeft - b.target.offsetLeft);
    if (visible.length) updateActiveSlide(visible[0].target);
  }, { root: slidesEl, threshold: 0.9 });
  block.querySelectorAll('.carousel-solutions-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-solutions-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-solutions-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-solutions-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  // the leading CTA / intro card has an empty image cell
  const imageCell = slide.querySelector('.carousel-solutions-slide-image');
  if (!imageCell || imageCell.childElementCount === 0) {
    slide.classList.add('carousel-solutions-cta');
  }

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy && labeledBy.getAttribute('id')) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-solutions-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-solutions-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-solutions-slides');
  container.append(slidesWrapper);

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);
    row.remove();
  });

  block.prepend(container);

  if (!isSingleSlide) {
    // footer: slide counter (01 / 07) on the left, prev/next arrows on the right
    const footer = document.createElement('div');
    footer.classList.add('carousel-solutions-footer');

    const counter = document.createElement('div');
    counter.classList.add('carousel-solutions-counter');
    counter.innerHTML = `
      <span class="carousel-solutions-counter-current">01</span>
      <span class="carousel-solutions-counter-sep">/</span>
      <span class="carousel-solutions-counter-total">${pad(rows.length)}</span>
    `;

    const navButtons = document.createElement('div');
    navButtons.classList.add('carousel-solutions-navigation-buttons');
    navButtons.setAttribute('role', 'group');
    navButtons.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel navigation');
    navButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}" disabled></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    footer.append(counter, navButtons);
    block.append(footer);

    block.dataset.activeSlide = 0;
    bindEvents(block);
  }
}
