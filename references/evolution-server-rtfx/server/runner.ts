import { World } from './evolution/world';
import config from './config';

const world: any = new World(config.WIDTH, config.HEIGHT);

world.populate();
world.initResources(world.map);
world.runTimeout();

export default {
  world,
};
