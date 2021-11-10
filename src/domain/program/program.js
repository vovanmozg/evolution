import Command from '../command';

const PROGRAM_LENGTH = 10;

function generate() {
  const commands = [];
  // Create program with PROGRAM_LENGTH commands
  for (let i = 0; i < PROGRAM_LENGTH; i += 1) {
    commands.push(Command.rand());
  }

  return {
    commands,
    current: 0,
  };
}

function step(bot, world) {
  Command.execute(bot, world);
}

export {
  generate,
  step,
};
