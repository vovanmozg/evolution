import Bot from '../bot';
import { backPosition, getBot } from '../world/bot_finder';
import { addBot } from '../world/map_modifier';

const CLONE_RATE = 2;

const turn = (direction) => (direction + 2) & 3;

function execute(bot, world) {
  const position = backPosition(bot);
  const botInBack = getBot(position.x, position.y, world.map);
  if (botInBack) {
    return;
  }

  if (bot.xp < Bot.DEFAULT_XP * CLONE_RATE) {
    return;
  }

  // Old bot lost half xp
  bot.xp /= 2;

  // New bot stays behind old, has default XP
  const newBot = Bot.cloneBot(
    bot,
    {
      ...position,
      id: Bot.generateId(),
      direction: turn(bot.direction),
      xp: Bot.DEFAULT_XP,
    },
  );

  addBot(newBot.x, newBot.y, newBot, world.map);
}

export default {
  execute,
};
