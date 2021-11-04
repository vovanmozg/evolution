import { Program } from '../program';
import { Bot } from "../bot";
// import Move from './command/move';
// import RotateClockwise from './rotate_clockwise';
// import RotateCounterclockwise from './rotate_counterclockwise';
// import Eat from './eat';

const CLONE_RATE = 2;

export class Command {
  // Generates random operations sequence
  static rand() {
    const items = [
      Program.OPERATIONS.MOVE,
      Program.OPERATIONS.ROTATE_CLOCKWISE,
      Program.OPERATIONS.ROTATE_COUNTERCLOCKWISE,
      Program.OPERATIONS.EAT,
      Program.OPERATIONS.EAT_SOLAR,
      Program.OPERATIONS.CLONE,
      Program.OPERATIONS.OVERPOPULATION,
//			Program.OPERATIONS.KILL_NEIGHBORS,
    ];

    //if (Math.random() > 0.99) {
    //items.push(Program.OPERATIONS.CLONE);
    //}

    return items[Math.floor(Math.random() * items.length)];
  }

  static execute(bot, world) {
    if (bot.processing === true) { return; }

    bot.processing = true;
    //debug(bot);

    const commands = {
      [Program.OPERATIONS.MOVE]: CommandMove,
      [Program.OPERATIONS.ROTATE_CLOCKWISE]: CommandRotateClockwise,
      [Program.OPERATIONS.ROTATE_COUNTERCLOCKWISE]: CommandRotateCounterclockwise,
      [Program.OPERATIONS.EAT]: CommandEat,
      [Program.OPERATIONS.EAT_SOLAR]: CommandEatSolar,
      [Program.OPERATIONS.CLONE]: CommandClone,
      [Program.OPERATIONS.OVERPOPULATION]: CommandOverpopulation,
//			[Program.OPERATIONS.KILL_NEIGHBORS]: CommandKillNeighbors,
    };

    // const operation = bot.program.commands.shift();
    // if (operation === undefined) { return; }
    // bot.program.commands.push(operation);

    if (bot.program.current >= bot.program.commands.length) {
      bot.program.current = bot.program.commands.length - 1;
    }

    const operation = bot.program.commands[bot.program.current];
    if (operation === undefined) { return; }

    bot.program.current++;
    if (bot.program.current >= bot.program.commands.length ) {
      bot.program.current = 0;
    }

    commands[operation].execute(bot, world);

    if (operation === Program.OPERATIONS.EAT_SOLAR) {
      CommandOverpopulation.execute(bot, world);
    }
  }
}


class CommandMove {
  static execute(bot, world) {
    let { x: xNew, y: yNew } = Bot.frontPosition(bot);

    const cell = world.getCell(xNew, yNew);
    const botInFront = Bot.get(cell);

    if (botInFront) {
      bot.options = { ...bot.options, hasBotInFront: true };
    } else {
      // Write moved bot to new cell and remove this bot from old cell
      world.setCellProps(xNew, yNew, { bot }, world.map);
      delete world.getCell(bot.x, bot.y).bot;
      bot.x = xNew;
      bot.y = yNew;
      bot.options = { ...bot.options, hasBotInFront: false };
    }
  }
}

class CommandRotateClockwise {
  static execute(bot, world) {
    bot.direction = CommandRotateClockwise.rotate(bot.direction, 1);
  }

  /*
  * @param direction {Number} can be 0 (right), 90 (top), 180 (left), 270 (bottom)
  * @param rotate {Number} can be 1 (clockwise) or -1 (counterclockwise)
  */
  static rotate(direction, rotate) {
    return (((direction / 90) + rotate) & 3) * 90;
  }
}

class CommandRotateCounterclockwise {
  static execute(bot, world) {
    bot.direction = CommandRotateCounterclockwise.rotate(bot.direction, -1);
  }

  /*
  * @param direction {Number} can be 0 (right), 90 (top), 180 (left), 270 (bottom)
  * @param rotate {Number} can be 1 (clockwise) or -1 (counterclockwise)
  */
  static rotate(direction, rotate) {
    return (((direction / 90) + rotate) & 3) * 90;
  }
}

class CommandEat {
  static execute(bot, world) {
    const cell = world.getCell(bot.x, bot.y);
    if (cell.resources.food) {

      bot.xp += 100;
      if (bot.xp > 255) bot.xp = 255;
      delete cell.resources.food;
    }
  }
}

class CommandEatSolar {
  static execute(bot, world) {
    const cell = world.getCell(bot.x, bot.y);

    bot.xp += cell.resources.light.power * 3;
  }
}

class CommandClone {
  static execute(bot, world) {
    const position = Bot.backPosition(bot);
    const backCell = world.getCell(position.x, position.y);
    const botInBack = Bot.get(backCell);
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
        direction: CommandClone.turn(bot.direction),
        xp: Bot.DEFAULT_XP,
      },
    );

    world.addBot(newBot.x, newBot.y, newBot);
  }

  static turn(direction) {
    return (((direction / 90) + 2) & 3) * 90;
  }
}

class CommandOverpopulation {
  static execute(bot, world) {
    const bots = [];
    let coords;

    let neighbors = 0;

    world.eachNeighborBot(bot, world, (neighborBot) => {
      neighbors++;
    });
    console.log(neighbors)

    // for(let x = -1; x <= 1; x++) {
    // 	for(let y = -1; y <= 1; y++) {
    // 		if (x !== 0 && y !== 0) {
    // 			coords = World.normalizeCoords(bot.x + x, bot.y + y);
    // 			const cell = world.getCell(coords.x, coords.y);
    // 			if(Bot.get(cell)) {
    // 				neighbors++;
    // 			}
    // 		}
    // 	}
    // }
    bot.xp -= neighbors/3;
  }
}

class CommandKillNeighbors {
  static execute(bot, world) {
    let { x: xNew, y: yNew } = Bot.frontPosition(bot);
    const cell = world.getCell(xNew, yNew);
    const botInFront = Bot.get(cell);
    if (botInFront) {
      world.destroyBot(botInFront);
    }


    return

    world.eachNeighborBot(bot, world, (neighborBot) => {
      world.destroyBot(neighborBot);
    });
  }
}
