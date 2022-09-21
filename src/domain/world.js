import {
  generateRandom as botGenerateRandom,
  liveStep as botLiveStep,
  tryDie,
} from './bot';
import { add as addResource, generateRandom as generateRandomResource } from './resource';
import { mutate } from './mutation';
import { generate, step as programStep } from './program';
import { HEIGHT, WIDTH } from './world/constants';
import { getBot } from './world/bot_finder';
import { addBot } from './world/map_modifier';

/**
 * Bot has 4 directions: right, up, left, down. Direction stored as code:
 * right - 0, up - 1, left - 2, down - 3. It is angle of rotation counterclockwise divided by 90.
 */

function eachCell(world, performer) {
  for (let x = 0; x < WIDTH; x += 1) {
    for (let y = 0; y < HEIGHT; y += 1) {
      performer(x, y);
    }
  }
}

function eachBot(world, performer, options) {
  eachCell(world, (x, y) => {
    const bot = getBot(x, y, world.map);
    if (bot) {
      performer(bot, options);
    }
  });
}

function populate(world) {
  eachCell(world, (x, y) => {
    if (Math.random() > 0.90) {
      addBot(x, y, botGenerateRandom(x, y, generate), world.map);
    }
  });
}

function flushBotsProcessing(world) {
  // Bots perform sequentially, cell by cell, so if bot perform in one cell and moved to other
  // cell, it can lead to repeated performing. On the world step we mark bot as processing and
  // bot will not performed again on this step. After processing bots we should flush bots
  // locks.
  eachBot(world, (bot) => {
    bot.processing = false;
  });
}

function initCell(x, y, map, value = { resources: {} }) {
  if (map[x] === undefined) {
    map[x] = [];
  }

  map[x][y] = value;
}

// function destroyBot(bot, world) {
//   delete world.getCell(bot.x, bot.y).bot;
// }

/* PRIVATE */
function initCells(world) {
  eachCell(world, (x, y) => {
    initCell(x, y, world.map);
  });
}

function initResources(world) {
  eachCell(world, (x, y) => {
    if (Math.random() > 0.9) {
      const resource = generateRandomResource();
      addResource(x, y, resource, world.map);
    }
    const resourceLight = { light: { type: 'light', power: 1 - y / HEIGHT } };
    addResource(x, y, resourceLight, world.map);
  });
}

function step(world) {
  // localStorage.world = JSON.stringify(this.map);

  // Perform next action for every Bot
  eachBot(world, (bot) => {
    mutate(bot);
    programStep(bot, world);
    botLiveStep(bot);

    const onDie = (deadBot, map) => {
      // if (Math.random() > 0.3) {
      const resource = generateRandomResource();
      addResource(deadBot.x, deadBot.y, resource, map);
      // }
    };
    tryDie(bot, world, onDie);
  });
  // debug(this.map[0][0].resources);

  flushBotsProcessing(world);
}

// print() {
//   let s = '';
//   for (let y = 0; y < this.height; y += 1) {
//     for (let x = 0; x < this.width; x += 1) {
//       s += this.map[x][y].bot ? 1 : '.';
//     }
//     s += '\n';
//   }
//   debug(s);
// }

// Creates world with population
function createWorld() {
  // Create world as matrix
  const world = {
    map: [],
  };
  initCells(world);

  // Create bots in world
  populate(world);
  initResources(world);

  // window.debugWorld = world;
  return world;
}

export {
  WIDTH,
  HEIGHT,
  createWorld,
  eachBot,
  eachCell,
  getBot,
  populate,
  step,
};
