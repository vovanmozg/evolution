import { OPERATIONS } from './program/constants';

import { arRandom } from '../utils';

const MUTATION_PROBABILITY = 0.001;

function randomOperationCode() {
  return arRandom(Object.values(OPERATIONS));
}

function randomChangeStyleComponent(value) {
  // const minComponentValue = 0;
  const maxComponentValue = 1;
  const change = maxComponentValue / 100;
  let sign = Math.random() > 0.5 ? 1 : -1;

  if (value + change * sign <= 0 || value + change * sign >= 1) {
    sign *= -1;
  }
  return value + change * sign;
}

function mutateSubstitution(commands, position) {
  commands[position] = randomOperationCode();
  return commands;
}

function mutateDeletion(commands, position) {
  commands.splice(position, 1);
  return commands;
}

function mutateInsertion(commands, position) {
  commands.splice(position, 0, randomOperationCode());
  return commands;
}

// function randomOperationsPosition(commands) {
//   return Math.floor(Math.random() * bot.program.commands.length);
// }

function mutate(bot) {
  // Mutations are very rare
  if (Math.random() > MUTATION_PROBABILITY) {
    return;
  }

  const mutations = [
    (commands, position) => mutateSubstitution(commands, position),
    (commands, position) => mutateDeletion(commands, position),
    (commands, position) => mutateInsertion(commands, position),
  ];

  const position = Math.floor(Math.random() * bot.program.commands.length);

  arRandom(mutations)(bot.program.commands, position);

  bot.style.h = randomChangeStyleComponent(bot.style.h);
  bot.style.s = randomChangeStyleComponent(bot.style.s);
  bot.style.v = randomChangeStyleComponent(bot.style.v); //  * (bot.xp * 2 / 255)

  // // Substitution
  // bot.program.commands[position] = randomOperationCode();
  //
  // // Deletion
  // bot.program.commands.splice(position, 1);
  //
  // // Insertion
  // bot.program.commands.splice(position, 0, randomOperationCode());
}

export {
  mutate,
};
