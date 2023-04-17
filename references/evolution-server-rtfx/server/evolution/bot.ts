import { Program } from './program';
import { Resource } from './resource';
import { World } from './world';

const DEFAULT_BOT = {
  x: 0,
  y: 0,
  direction: 0,
  id: null,
  rotate: 1,
  program: { commands: [], current: 0 }, // TODO: ссылка на общий объект
  options: {}, // TODO: ссылка на общий объект
  xp: 127,
  style: {
    h: 1,
    s: 1,
    b: 1
  }

};


function shifts() {
  return [[1, 0], [0, -1], [-1, 0], [0, 1]];
  //      left    top      right    bottom
}

function rightCyclicShift(ar) {
  // Mutates ar for performance purposes
  ar.push(ar.shift());
  return ar;
}

/*
* @param direction {Number} can be 0 (right), 90 (top), 180 (left), 270 (bottom)
* @param rotate {Number} can be 1 (clockwise) or -1 (counterclockwise)
*/
function rotate1(direction, rotate) {
  return (((direction) + rotate) & 3);
}

/*
* @param direction {Number} can be 0 (right), 90 (top), 180 (left), 270 (bottom)
* @param rotate {Number} can be 1 (clockwise) or -1 (counterclockwise)
*/
function rotate2(direction, rotate) {
  return (((direction) + rotate) & 3);
}

// function rightPosition(bot) {
//   return World.normalizeCoords(bot.x + 1, bot.y + 0);
// }
//
// function topPosition(bot) {
//   return World.normalizeCoords(bot.x + 0, bot.y - 1);
// }
//
// function leftPosition(bot) {
//   return World.normalizeCoords(bot.x - 1, bot.y + 0);
// }
//
// function bottomPosition(bot) {
//   return World.normalizeCoords(bot.x + 0, bot.y + 1);
// }

class Bot {
  static DEFAULT_XP = 10;

  static generateRandom(x, y) {
    return {
      ...DEFAULT_BOT,
      id: Bot.generateId(),
      x: x,
      y: y,
      direction: Math.floor(Math.random() * 4),
      rotate: Math.random() > 0.5 ? 1 : -1,
      program: Program.generate(),
      options: {},
      style: {
        h: Math.random(),
        s: Math.random(),
        v: Math.random(),
      }
    };
  }

  static get(cell) {
    return cell.bot;
  }

  // Returns coordinates behind the back of the bot
  static frontPosition(bot) {
    const shift = shifts()[bot.direction];
    return World.normalizeCoords(bot.x + shift[0], bot.y + shift[1]);
  }

  // Returns coordinates behind the back of the bot
  static backPosition(bot) {
    const shift = rightCyclicShift(rightCyclicShift(shifts()))[bot.direction];
    //const shift = [[-1, 0], [0, 1], [1, 0], [0, -1]][bot.direction];
    return World.normalizeCoords(bot.x + shift[0], bot.y + shift[1]);
  }

  static cloneBot(bot, changes = {}) {
    const newBot = JSON.parse(JSON.stringify(bot));
    return {
      ...newBot,
      ...changes,
    }
  }

  static generateId() {
    return '' + Math.random();
  }

  // tick of the bot live
  static liveStep(bot) {
    bot.xp--;
  }

  static tryDie(bot, world) {
    if (bot.xp <= 0) {
      world.destroyBot(bot);

      const resource = Resource.generateRandom();

      Resource.add(bot.x, bot.y, resource, world.map);
    }
  }

  static isProcessing(bot) {
    return bot.processing === false
  }
}

export { Bot, DEFAULT_BOT };
