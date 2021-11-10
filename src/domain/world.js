import {
  generateRandom as botGenerateRandom,
  liveStep as botLiveStep,
  tryDie,
} from './bot';
import { add as addResource, generateRandom as generateRandomResource } from './resource';
import { Mutation } from './mutation';
import { generate, step as programStep } from './program';
import { HEIGHT, WIDTH } from './world/constants';
import { getBot } from './world/bot_finder';

/**
 * Bot has 4 directions: right, up, left, down. Direction stored as code:
 * right - 0, up - 1, left - 2, down - 3. It is angle of rotation counterclockwise divided by 90.
 */

const validateCoords = (x, y) => {
  if (x >= WIDTH || x < 0) {
    throw new Error(`x should be from 0 to ${WIDTH}`);
  }

  if (y >= HEIGHT || y < 0) {
    throw new Error(`x should be from 0 to ${WIDTH}`);
  }
};

// const getBot = (cell) => cell.bot;

export class World {
  constructor(width, height) {
    this.width = width; // cols
    this.height = height; // rows
    this.initCells();
    // For debug
    window.debugWorld = this;
  }

  eachCell(performer) {
    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        performer(x, y);
      }
    }
  }

  eachBot(performer) {
    this.eachCell((x, y) => {
      const bot = getBot(x, y, this.map);
      // debug(bot)
      if (bot) {
        performer(bot);
      }
    });
  }

  populate() {
    // this.populateTest1(); return;

    this.eachCell((x, y) => {
      if (Math.random() > 0.90) {
        this.addBot(x, y, botGenerateRandom(x, y, generate));
      }
    });
  }

  initResources(map) {
    this.eachCell((x, y) => {
      if (Math.random() > 0.9) {
        const resource = generateRandomResource();
        addResource(x, y, resource, map);
      }
      const resourceLight = { light: { type: 'light', power: 1 - y / HEIGHT } };
      addResource(x, y, resourceLight, map);
    });
  }

  step() {
    // localStorage.world = JSON.stringify(this.map);

    // Perform next action for every Bot
    this.eachBot((bot) => {
      Mutation.mutate(bot);
      programStep(bot, this);
      botLiveStep(bot);

      const onDie = (deadBot, map) => {
        // if (Math.random() > 0.3) {
        const resource = generateRandomResource();
        addResource(deadBot.x, deadBot.y, resource, map);
        // }
      };
      tryDie(bot, this, onDie);
    });
    // debug(this.map[0][0].resources);

    this.flushBotsProcessing();
  }

  flushBotsProcessing() {
    // Bots perform sequentially, cell by cell, so if bot perform in one cell and moved to other
    // cell, it can lead to repeated performing. On the world step we mark bot as processing and
    // bot will not performed again on this step. After processing bots we should flush bots
    // locks.
    this.eachBot((bot) => {
      bot.processing = false;
    });
  }

  destroyBot(bot) {
    delete this.getCell(bot.x, bot.y).bot;
  }

  getCell(x, y) {
    return this.map[x][y];
  }

  initCell(x, y, value = undefined) {
    if (value === undefined) {
      value = {
        resources: {},
      };
    }

    if (this.map[x] === undefined) {
      this.map[x] = [];
    }

    this.map[x][y] = value;
  }

  /* PRIVATE */
  initCells() {
    // debug('initCells');
    this.map = [];
    this.eachCell((x, y) => {
      this.initCell(x, y);
    });
  }

  addBot(x, y, bot) {
    validateCoords(x, y);

    if (this.map[x][y].bot) {
      throw new Error(`Bot already exists in cell ${x}:${y}`);
    }
    // debug('addBot');
    this.map[x][y].bot = bot;
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
}

// Creates world with population
function createWorld() {
  // Create world as matrix
  const world = new World(WIDTH, HEIGHT);
  // Create bots in world
  world.populate();
  world.initResources(world.map);

  return world;
}

export {
  WIDTH,
  HEIGHT,
  createWorld,
  validateCoords,
  getBot,
};
