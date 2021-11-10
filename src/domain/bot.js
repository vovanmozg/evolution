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
    b: 1,
  },
};

const RIGHT = 0;
const TOP = 1;
const LEFT = 2;
const BOTTOM = 3;
const DEFAULT_XP = 10;

/*
* @param direction {Number} can be 0 (right), 90 (top), 180 (left), 270 (bottom)
* @param rotate {Number} can be 1 (clockwise) or -1 (counterclockwise)
*/
// function rotate1(direction, rotate) {
//   return ((direction + rotate) & 3);
// }

/*
* @param direction {Number} can be 0 (right), 90 (top), 180 (left), 270 (bottom)
* @param rotate {Number} can be 1 (clockwise) or -1 (counterclockwise)
*/
// function rotate2(direction, rotate) {
//   return ((direction + rotate) & 3);
// }

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

function cloneBot(bot, changes = {}) {
  return {
    x: changes.x === undefined ? bot.x : changes.x,
    y: changes.y === undefined ? bot.y : changes.y,
    id: changes.id === undefined ? bot.id : changes.id,
    direction: changes.direction === undefined ? bot.direction : changes.direction,
    xp: changes.xp === undefined ? bot.xp : changes.xp,

    rotate: bot.rotate,
    program: {
      commands: bot.program.commands.slice(),
      current: bot.program.current,
    },
    options: { ...bot.options },
    style: {
      h: bot.style.h,
      s: bot.style.s,
      v: bot.style.v,
    },
    processing: bot.processing,
  };
}

function isProcessing(bot) {
  return bot.processing === false;
}
//
// function isDirectionRight(bot) {
//   return bot.direction === 0;
// }
//
// function isDirectionLeft(bot) {
//   return bot.direction === 2;
// }
//
// function isDirectionTop(bot) {
//   return bot.direction === 1;
// }
//
// function isDirectionBottom(bot) {
//   return bot.direction === 3;
// }

function generateId() {
  return `${Math.random()}`;
}

function generateRandom(x, y, generateProgram) {
  return {
    ...DEFAULT_BOT,
    id: generateId(),
    x,
    y,
    direction: Math.floor(Math.random() * 4),
    rotate: Math.random() > 0.5 ? 1 : -1,
    program: generateProgram(),
    options: {},
    style: {
      h: Math.random(),
      s: Math.random(),
      v: Math.random(),
    },
  };
}

// tick of the bot live
function liveStep(bot) {
  bot.xp -= 1;
}

function tryDie(bot, world, onDie) {
  if (bot.xp <= 0) {
    world.destroyBot(bot);
    onDie(bot, world.map);
  }
}

export {
  isProcessing,
  generateRandom,
  liveStep,
  tryDie,
};

export default {
  generateId,
  generateRandom,
  liveStep,
  tryDie,
  cloneBot,
  isProcessing,
  DEFAULT_BOT,
  RIGHT,
  TOP,
  LEFT,
  BOTTOM,
  DEFAULT_XP,
};
