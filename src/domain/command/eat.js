import { getCell } from '../world/map_modifier';

function execute(bot, world) {
  const cell = getCell(bot.x, bot.y, world.map);
  if (cell.resources.food) {
    bot.xp += 100;
    if (bot.xp > 255) bot.xp = 255;
    delete cell.resources.food;
  }
}

export default {
  execute,
};
