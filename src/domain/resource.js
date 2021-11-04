import { World } from './world';

export class Resource {
  static add(x, y, resource, map) {
    World.validateCoords(x, y);
    map[x][y].resources = {
      ...map[x][y].resources,
      ...resource
    };
  }

  static generateRandom() {
    return {
      food: {
        type: 'food',
      },
    };
  }
}
