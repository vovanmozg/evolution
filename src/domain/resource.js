// import { validateCoords } from './world';

function add(x, y, resource, map) {
  // validateCoords(x, y);
  map[x][y].resources = {
    ...map[x][y].resources,
    ...resource,
  };
}

function generateRandom() {
  return {
    food: {
      type: 'food',
    },
  };
}

export {
  add,
  generateRandom,
};
