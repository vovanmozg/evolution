import { getCell } from '../world/map_modifier';

function execute(bot, world) {
  const cell = getCell(bot.x, bot.y, world.map);

  bot.xp += cell.resources.light.power * 3;
}

export default {
  execute,
};
