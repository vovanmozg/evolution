import { tickBot } from './bot.mjs';

function tick(world) {
  world.forEach((place) => place && tickBot(place, world));
}

// Finds bots who stay left and right from bot.
function neighbors(bot, world) {
  const found = [];
  const index = world.findIndex((element) => element && element.id === bot.id);

  if (world[index - 1] !== undefined) {
    found.push(world[index - 1]);
  }
  if (world[index + 1] !== undefined) {
    found.push(world[index + 1]);
  }
  return found;
}

// Generages world and starts processing
function start() {
  const world = [{ id: 1 }, undefined, { id: 2 }, { id: 3 }];

  setInterval(() => tick(world), 1000);
}

export {
  neighbors,
  start,
};
