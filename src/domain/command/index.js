import { OPERATIONS } from '../program/constants';
import Move from './move';
import RotateClockwise from './rotate_clockwise';
import RotateCounterclockwise from './rotate_counterclockwise';
import Eat from './eat';
import EatSolar from './eat_solar';
import Clone from './clone';
import Overpopulation from './overpopulation';

// Generates random operations sequence
function rand() {
  const items = [
    OPERATIONS.MOVE,
    OPERATIONS.ROTATE_CLOCKWISE,
    OPERATIONS.ROTATE_COUNTERCLOCKWISE,
    OPERATIONS.EAT,
    OPERATIONS.EAT_SOLAR,
    OPERATIONS.CLONE,
    // OPERATIONS.OVERPOPULATION,
    // OPERATIONS.KILL_NEIGHBORS,
  ];

  // if (Math.random() > 0.99) {
  // items.push(OPERATIONS.CLONE);
  // }

  return items[Math.floor(Math.random() * items.length)];
}

function execute(bot, world) {
  if (bot.processing === true) {
    return;
  }

  bot.processing = true;
  // debug(bot);

  const commands = {
    [OPERATIONS.MOVE]: Move,
    [OPERATIONS.ROTATE_CLOCKWISE]: RotateClockwise,
    [OPERATIONS.ROTATE_COUNTERCLOCKWISE]: RotateCounterclockwise,
    [OPERATIONS.EAT]: Eat,
    [OPERATIONS.EAT_SOLAR]: EatSolar,
    [OPERATIONS.CLONE]: Clone,
    // [OPERATIONS.OVERPOPULATION]: Overpopulation,
    // [OPERATIONS.KILL_NEIGHBORS]: CommandKillNeighbors,
  };

  // const operation = bot.program.commands.shift();
  // if (operation === undefined) { return; }
  // bot.program.commands.push(operation);

  if (bot.program.current >= bot.program.commands.length) {
    bot.program.current = bot.program.commands.length - 1;
  }

  const operation = bot.program.commands[bot.program.current];
  if (operation === undefined) {
    return;
  }

  bot.program.current += 1;
  if (bot.program.current >= bot.program.commands.length) {
    bot.program.current = 0;
  }

  commands[operation].execute(bot, world);

  if (operation === OPERATIONS.EAT_SOLAR) {
    Overpopulation.execute(bot, world);
  }
}

export default {
  execute,
  rand,
};
