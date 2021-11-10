import { eachNeighborBot } from '../world/bot_finder';

const xpReduction = (neighbors) => neighbors / 3;

function execute(bot, world) {
  let neighbors = 0;

  eachNeighborBot(bot, world, (_) => {
    neighbors += 1;
  });

  bot.xp -= xpReduction(neighbors);
}

export default {
  execute,
};
