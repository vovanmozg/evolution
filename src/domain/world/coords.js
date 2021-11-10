import { HEIGHT, WIDTH } from './constants';

function normalizeCoords(x, y) {
  if (x < 0) x = WIDTH - 1;
  if (x > WIDTH - 1) x = 0;
  if (y < 0) y = HEIGHT - 1;
  if (y > HEIGHT - 1) y = 0;

  return { x, y };
}

const validateCoords = (x, y) => {
  if (x >= WIDTH || x < 0) {
    throw new Error(`x should be from 0 to ${WIDTH}`);
  }

  if (y >= HEIGHT || y < 0) {
    throw new Error(`x should be from 0 to ${WIDTH}`);
  }
};

export {
  normalizeCoords,
  validateCoords,
};
