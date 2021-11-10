//import { 40, 100 } from './constants';

function normalizeCoords(x, y) {
  if (x < 0) x = 100 - 1;
  if (x > 100 - 1) x = 0;
  if (y < 0) y = 40 - 1;
  if (y > 40 - 1) y = 0;

  return { x, y };
}

const validateCoords = (x, y) => {
  if (x >= 100 || x < 0) {
    throw new Error(`x should be from 0 to ${100}`);
  }

  if (y >= 40 || y < 0) {
    throw new Error(`x should be from 0 to ${100}`);
  }
};

export {
  normalizeCoords,
  validateCoords,
};
