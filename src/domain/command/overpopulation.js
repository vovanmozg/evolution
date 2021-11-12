import { isProcessing } from '../bot';
import { eachNeighborBot } from '../world/bot_finder';

const xpReduction = (neighbors) => neighbors / 3;

function execute(bot, world) {
  return;
  let neighbors = 0;

  eachNeighborBot(bot, world, (_) => {
    neighbors += 1;
  }, isProcessing);

  bot.xp -= xpReduction(neighbors);
}

export default {
  execute,
};
