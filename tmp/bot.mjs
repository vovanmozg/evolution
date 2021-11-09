import { neighbors } from './world.mjs';

function tickBot(bot, world) {
  console.log('neighbors:', neighbors(bot, world));
}

export {
  tickBot,
};
