import { Bot, isProcessing } from './bot';
import { Resource } from './resource';
import { Mutation } from './mutation';
import { Program } from './program';

/**
 * Bot has 4 directions: right, up, left, down. Direction stored as code:
 * right - 0, up - 90, left - 180, down - 270. It is angle of rotation counterclockwise.
 */

const WIDTH = 100;
const HEIGHT = 50;

export class World {
  constructor(width, height) {
    this.width = width; // cols
    this.height = height; // rows
    this.initCells();
    // For debug
    window.debugWorld = this;
  }

  static validateCoords(x, y) {
    if (x >= WIDTH || x < 0) {
      throw `x should be from 0 to ${WIDTH}`;
    }

    if (y >= HEIGHT || y < 0) {
      throw `x should be from 0 to ${WIDTH}`;
    }
  }

  static normalizeCoords(x, y) {
    if (x < 0) x = WIDTH - 1;
    if (x > WIDTH - 1) x = 0;
    if (y < 0) y = HEIGHT - 1;
    if (y > HEIGHT - 1) y = 0;

    return { x, y };
  }

  eachCell(performer) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        performer(x, y);
      }
    }
  }

  eachBot(performer) {
    this.eachCell((x, y) => {
      const bot = Bot.get(this.getCell(x, y));
      // debug(bot)
      if (bot) {
        performer(bot);
      }
    });
  }

  eachNeighborBot(bot, world, performer) {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x !== 0 && y !== 0) {
          const coords = World.normalizeCoords(bot.x + x, bot.y + y);
          const cell = world.getCell(coords.x, coords.y);
          const neighborBot = Bot.get(cell);
          if (neighborBot && isProcessing(neighborBot)) {
            performer(neighborBot);
          }
        }
      }
    }
  }

  populate() {
    // this.populateTest1(); return;

    this.eachCell((x, y) => {
      if (Math.random() > 0.90) {
        this.addBot(x, y, Bot.generateRandom(x, y));
      }
    });
  }

  populateTest1() {
    TEST_CASES[2].forEach((botOptions) => {
      this.addBot(botOptions.x, botOptions.y, botOptions);
    });
  }

  initResources(map) {
    let a = 0;
    this.eachCell((x, y) => {
      if (Math.random() > 0.9) {
        a++;
        const resource = Resource.generateRandom();
        Resource.add(x, y, resource, map);
      }
      const resourceLight = { light: { type: 'light', power: 1 - y / HEIGHT } };
      Resource.add(x, y, resourceLight, map);
    });
    // debug(a)
  }

  step() {
    // localStorage.world = JSON.stringify(this.map);

    // Perform next action for every Bot
    this.eachBot((bot) => {
      Mutation.mutate(bot);
      Program.step(bot, this);
      Bot.liveStep(bot);
      Bot.tryDie(bot, this);
    });
    // debug(this.map[0][0].resources);

    this.flushBotsProcessing();
  }

  flushBotsProcessing() {
    // Bots perform sequentially, cell by cell, so if bot perform in one cell and moved to other cell,
    // it can lead to repeated performing. On the world step we mark bot as processing and bot will not
    // performed again on this step. After processing bots we should flush bots locks.
    this.eachBot((bot) => bot.processing = false);
  }

  destroyBot(bot) {
    delete this.getCell(bot.x, bot.y).bot;
  }

  getCell(x, y) {
    return this.map[x][y];
  }

  setCellProps(x, y, value, map) {
    map[x][y] = { ...map[x][y], ...value };
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
    World.validateCoords(x, y);

    if (this.map[x][y].bot) {
      throw `Bot already exists in cell ${x}:${y}`;
    }
    // debug('addBot');
    this.map[x][y].bot = bot;
  }

  print() {
    let s = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        s += this.map[x][y].bot ? 1 : '.';
      }
      s += '\n';
    }
    // debug(s);
  }
}

// Creates world with population
export class WorldCreator {
  static create() {
    // Create world as matrix
    const world = new World(WIDTH, HEIGHT);
    // Create bots in world
    world.populate();
    world.initResources(world.map);

    return world;
  }
}

export {
  WIDTH,
  HEIGHT,
};
