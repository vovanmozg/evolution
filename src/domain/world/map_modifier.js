import { getBot } from './bot_finder';

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

export {
  moveBot,
};
