import { Command } from './command';

export class Program {
  static OPERATIONS = {
    MOVE: 0,
    ROTATE_CLOCKWISE: 1,
    ROTATE_COUNTERCLOCKWISE: 2,
    EAT: 3,
    EAT_SOLAR: 4,
    CLONE: 5,
    OVERPOPULATION: 6,
//		KILL_NEIGHBORS: 7,
  };
  static PROGRAM_LENGTH = 10;

  static generate() {
    const commands = [];
    // Create program with PROGRAM_LENGTH commands
    for(let i = 0; i < Program.PROGRAM_LENGTH; i++) {
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
