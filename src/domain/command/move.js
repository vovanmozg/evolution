import { frontPosition, getBot } from '../world/bot_finder';
import { moveBot } from '../world/map_modifier';

function execute(bot, world) {
  const position = frontPosition(bot);
  bot.options.hasBotInFront = !!getBot(position.x, position.y, world.map);

  if (!bot.options.hasBotInFront) {
    moveBot(bot, position, world.map);
  }
}

export default {
  execute,
};
