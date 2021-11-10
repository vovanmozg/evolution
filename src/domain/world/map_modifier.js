import { getBot } from './bot_finder';
import { validateCoords } from './coords';

const setCellProps = (x, y, value, map) => {
  map[x][y] = { ...map[x][y], ...value };
  return map;
};

const removeBot = (x, y, map) => {
  delete map[x][y].bot;
  return map;
};

function moveBot(bot, dest, map) {
  if (getBot(dest.x, dest.y, map)) {
    throw new Error(`Bot in cell ${dest.x}:${dest.y} already exists`);
  }
  // Write moved bot to new cell and remove this bot from old cell
  setCellProps(dest.x, dest.y, { bot }, map);
  removeBot(bot.x, bot.y, map);
  bot.x = dest.x;
  bot.y = dest.y;
}

function addBot(x, y, bot, map) {
  validateCoords(x, y);

  if (map[x][y].bot) {
    throw new Error(`Bot already exists in cell ${x}:${y}`);
  }
  // debug('addBot');
  map[x][y].bot = bot;

  return map;
}

function getCell(x, y, map) {
  return map[x][y];
}

export {
  addBot,
  getCell,
  moveBot,
  removeBot,
};
