// Returns coordinates behind the back of the bot
// Returns coordinates behind the back of the bot
import { normalizeCoords } from './coords';

//              left    top      right    bottom
const SHIFTS = [[1, 0], [0, -1], [-1, 0], [0, 1]];

const getBot = (x, y, map) => map && map[x] && map[x][y] && map[x][y].bot;

function rightCyclicShift(ar) {
  // Mutates ar for performance purposes
  ar.push(ar.shift());
  return ar;
}

function frontPosition(bot) {
  const shift = SHIFTS[bot.direction];
  return normalizeCoords(bot.x + shift[0], bot.y + shift[1]);
}

function backPosition(bot) {
  const shift = rightCyclicShift(rightCyclicShift(SHIFTS))[bot.direction];
  return normalizeCoords(bot.x + shift[0], bot.y + shift[1]);
}

// function aheadBotByBot(bot, world) {
//   const position = frontPosition(bot);
//   return aheadBotByPosition(position, world);
// }

// const aheadBotByPosition = (position, world) => {
//   getBot(position.x, position.y, world.map);
// };
// const behindBotByPosition = (position, world) => getBot(position.x, position.y, world.map);

// function getBehindBot(bot, world) {
//   const position = backPosition(bot);
// }

function eachNeighborBot(bot, world, performer, botIsProcessing) {
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      if (x !== 0 && y !== 0) {
        const coords = normalizeCoords(bot.x + x, bot.y + y);
        const neighborBot = getBot(coords.x, coords.y, world.map);
        if (neighborBot && botIsProcessing(neighborBot)) {
          performer(neighborBot);
        }
      }
    }
  }
}

export {
  eachNeighborBot,
  backPosition,
  frontPosition,
  //  aheadBotByPosition,
  getBot,
};
