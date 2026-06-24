export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  const heading = cell.querySelector('h1, h2, h3');
  const paragraph = cell.querySelector('p');

  const headingCell = document.createElement('div');
  headingCell.className = 'hero-intro-heading';
  if (heading) headingCell.append(heading);

  // Decorative brand gradient quadrants (top-right + bottom-left).
  const mediaTopRight = document.createElement('div');
  mediaTopRight.className = 'hero-intro-media hero-intro-media-tr';
  mediaTopRight.setAttribute('aria-hidden', 'true');

  const mediaBottomLeft = document.createElement('div');
  mediaBottomLeft.className = 'hero-intro-media hero-intro-media-bl';
  mediaBottomLeft.setAttribute('aria-hidden', 'true');

  const descCell = document.createElement('div');
  descCell.className = 'hero-intro-desc';
  if (paragraph) descCell.append(paragraph);

  block.textContent = '';
  block.append(headingCell, mediaTopRight, mediaBottomLeft, descCell);
}
