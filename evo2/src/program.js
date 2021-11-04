import { Command } from './command';

const PROGRAM_LENGTH = 10;

export class Program {


  static generate() {
    const commands = [];
    // Create program with PROGRAM_LENGTH commands
    for(let i = 0; i < PROGRAM_LENGTH; i++) {
      commands.push(Command.rand());
    }

    return {
      commands,
      current: 0,
    };
  }

  static step(bot, world) {
    Command.execute(bot, world);
  }
}

const OPERATIONS = {
  MOVE: 0,
  ROTATE_CLOCKWISE: 1,
  ROTATE_COUNTERCLOCKWISE: 2,
  EAT: 3,
  EAT_SOLAR: 4,
  CLONE: 5,
  OVERPOPULATION: 6,
//		KILL_NEIGHBORS: 7,
};

export {
  OPERATIONS,
};
