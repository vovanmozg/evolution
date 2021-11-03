// const DEFAULT_CELL = {
// 	resources: {},
// };
const WIDTH = 120;
const HEIGHT = 60;
// const FPS = 1;
const PROGRAM_LENGTH = 10;
const CLONE_RATE = 2;
const DEFAULT_BOT = {
	x: 0,
	y: 0,
	direction: 0,
	id: null,
	rotate: 1,
	program: { commands: [], current: 0 }, // TODO: ссылка на общий объект
	options: {}, // TODO: ссылка на общий объект
	xp: 127,
  style: {
    h: 1,
    s: 1,
    b: 1
  }

};

// Groups of bots for testing purposes. They can be used in populate()
const TEST_CASES = [
	[
		{ ...DEFAULT_BOT, x: 42, y: 20, direction: 90, id: '0.99', rotate: 1, program: { commands: [1, 1, 0, 0, 1] }, options: {} },
		{ ...DEFAULT_BOT, x: 42, y: 21, direction: 90, id: '0.10', rotate: 1, program: { commands: [0, 1, 1, 1, 0] }, options: {} },
	],
	[
		{ ...DEFAULT_BOT, x: 10, y: 10, direction: 270, id: '0.99', rotate: 1, program: { commands: [0,1] }, options: {}, processing: false },
		{ ...DEFAULT_BOT, x: 10, y: 11, direction: 90, id: '0.10', rotate: 1, program: { commands: [0,1] }, options: {}, processing: false },
	],
  [
    { ...DEFAULT_BOT, x: 10, y: 10, direction: 270, id: '0.99', rotate: 1, program: { commands: [5] }, options: {}, processing: false },
  ],
];


/*************************************************
 * Domain level
 *************************************************/
class Command {
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

class Mutation {
	static MUTATION_PROBABILITY = 0.001;

	static mutate(bot) {
		// Mutations are very rare
		if (Math.random() > Mutation.MUTATION_PROBABILITY) {
			return;
		}

		const mutations = [
			(commands, position) => this.mutateSubstitution(commands, position),
			(commands, position) => this.mutateDeletion(commands, position),
			(commands, position) => this.mutateInsertion(commands, position),
		];

		const position = Math.floor(Math.random() * bot.program.commands.length);

		mutations.random()(bot.program.commands, position);

		bot.style.h = this.randomChangeStyleComponent(bot.style.h);
		bot.style.s = this.randomChangeStyleComponent(bot.style.s);
		bot.style.v = this.randomChangeStyleComponent(bot.style.v); //  * (bot.xp * 2 / 255)



		// // Substitution
		// bot.program.commands[position] = this.randomOperationCode();
		//
		// // Deletion
		// bot.program.commands.splice(position, 1);
		//
		// // Insertion
		// bot.program.commands.splice(position, 0, this.randomOperationCode());
	}


	static randomChangeStyleComponent(value) {
		const minComponentValue = 0;
		const maxComponentValue = 1;
		const change = maxComponentValue / 100;
		let sign = Math.random() > 0.5 ? 1 : -1;

		if (value + change * sign <= 0 || value + change * sign >= 1) {
			sign *= -1;
		}
		return value + change * sign;
	}

	static mutateSubstitution(commands, position) {
		commands[position] = this.randomOperationCode();
		return commands;
	}


	static mutateDeletion(commands, position) {
		commands.splice(position, 1);
		return commands;
	}

	static mutateInsertion(commands, position) {
		commands.splice(position, 0, this.randomOperationCode());
		return commands;
	}

	static randomOperationsPosition(commands) {
		return Math.floor(Math.random() * bot.program.commands.length);
	}

	static randomOperationCode() {
		return Object.values(Program.OPERATIONS).random();
	}
}

class Program {
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

class Bot {
  static DEFAULT_XP = 10;

	static generateRandom(x, y) {
		return {
			...DEFAULT_BOT,
			id: Bot.generateId(),
			x: x,
			y: y,
			direction: Math.floor(Math.random() * 4) * 90,
			rotate: Math.random() > 0.5 ? 1 : -1,
			program: Program.generate(),
      options: {},
      style: {
			  h: Math.random(),
        s: Math.random(),
        v: Math.random(),
      }
		};
	}

	static get(cell) {
		return cell.bot;
	}

	// Returns coordinates behind the back of the bot
	static frontPosition(bot) {
    const shift = [[1, 0], [0, -1], [-1, 0], [0, 1]][bot.direction/90];
    return World.normalizeCoords(bot.x + shift[0], bot.y + shift[1]);
  }

  // Returns coordinates behind the back of the bot
  static backPosition(bot) {
    const shift = [[-1, 0], [0, 1], [1, 0], [0, -1]][bot.direction/90];
    return World.normalizeCoords(bot.x + shift[0], bot.y + shift[1]);
  }

  static cloneBot(bot, changes = {}) {
    const newBot = JSON.parse(JSON.stringify(bot));
    return {
    	...newBot,
			...changes,
		}
  }

  static generateId() {
    return '' + Math.random();
  }

  // tick of the bot live
  static liveStep(bot) {
		bot.xp--;
	}

	static tryDie(bot, world) {
		if (bot.xp <= 0) {
			world.destroyBot(bot);

			const resource = Resource.generateRandom();

			Resource.add(bot.x, bot.y, resource, world.map);
		}
	}

	static isProcessing(bot) {
		return bot.processing == false
	}
}

class Resource {
	static add(x, y, resource, map) {
		World.validateCoords(x, y);
		map[x][y].resources = {
		  ...map[x][y].resources,
      ...resource
    };
	}

	static generateRandom() {
		return {
			food: {
        type: 'food',
      },
		};
	}
}

class World {
	constructor(width, height) {
		this.width = width; // cols
		this.height = height; // rows
		this.initCells();
		// For debug
		window.debugWorld = this;
	}

	static validateCoords(x, y) {
		if (x >= WIDTH || x < 0) {
			throw `x should be from 0 to ${WIDTH}`;
		}

		if (y >= HEIGHT || y < 0) {
			throw `x should be from 0 to ${WIDTH}`;
		}
	}

	static normalizeCoords(x, y) {
    if (x < 0) x = WIDTH - 1;
    if (x > WIDTH - 1) x = 0;
    if (y < 0) y = HEIGHT - 1;
    if (y > HEIGHT - 1) y = 0;

    return { x: x, y: y };
  }

	eachCell(performer) {
		for(let x = 0; x < this.width; x++) {
			for(let y = 0; y < this.height; y++) {
				performer(x, y);
			}
		}
	}

	eachBot(performer) {
		this.eachCell((x, y) => {
			const bot = Bot.get(this.getCell(x, y));
			//debug(bot)
			if (bot) {
				performer(bot);
			}
		});
	}

	eachNeighborBot(bot, world, performer) {
		for(let x = -1; x <= 1; x++) {
			for(let y = -1; y <= 1; y++) {
				if (x !== 0 && y !== 0) {

					const coords = World.normalizeCoords(bot.x + x, bot.y + y);
					const cell = world.getCell(coords.x, coords.y);
					const neighborBot = Bot.get(cell);
					if(neighborBot && Bot.isProcessing(neighborBot)) {
						performer(neighborBot);
					}
				}
			}
		}
	}

	populate() {
		//this.populateTest1(); return;

		this.eachCell((x, y) => {
			if (Math.random() > 0.90) {
				this.addBot(x, y, Bot.generateRandom(x, y));
			}
		});
	}

	populateTest1() {
		TEST_CASES[2].forEach((botOptions) => {
			this.addBot(botOptions.x, botOptions.y, botOptions);
		});
	}

	initResources(map) {
		let a = 0;
		this.eachCell((x, y) => {
			if (Math.random() > 0.9) {
				a ++;
				let resource = Resource.generateRandom();
				Resource.add(x, y, resource, map);
			}
      let resourceLight = { light: { type: 'light', power: 1 - y / HEIGHT } };
      Resource.add(x, y, resourceLight, map);
		});
		//debug(a)
	}

	step() {
		// localStorage.world = JSON.stringify(this.map);

		// Perform next action for every Bot
		this.eachBot( (bot) => {
			Mutation.mutate(bot);
			Program.step(bot, this);

			Bot.liveStep(bot);
			Bot.tryDie(bot, this);
		});
    //debug(this.map[0][0].resources);

		// this.eachBot( bot => {
		//
		// });

		// Bots perform sequentially, cell by cell, so if bot perform in one cell and moved to other cell,
		// it can lead to repeated performing. On the world step we mark bot as processing and bot will not
		// performed again on this step. After processing bots we should flush bots locks.
		this.eachBot( bot => bot.processing = false);
	}



	destroyBot(bot) {
		delete this.getCell(bot.x, bot.y).bot;
	}

	getCell(x, y) {
		return this.map[x][y];
	}

	setCellProps(x, y, value, map) {
		map[x][y] = { ...map[x][y], ...value };
	}

	initCell(x, y, value = undefined) {
		if (value === undefined) {
			value = {
				resources: {},
			};
		}

		if (this.map[x] === undefined) {
			this.map[x] = [];
		}

		this.map[x][y] = value;
	}

	/* PRIVATE */
	initCells() {
		//debug('initCells');
		this.map = [];
		this.eachCell((x, y) => {
			this.initCell(x, y);
		});
	}

	addBot(x, y, bot) {
		World.validateCoords(x, y);

		if (this.map[x][y].bot) {
			throw `Bot already exists in cell ${x}:${y}`;
		}
		//debug('addBot');
		this.map[x][y].bot = bot;
	}

	print() {
		let s = '';
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				s += this.map[x][y].bot ? 1 : '.';
			}
			s += "\n";
		}
		//debug(s);
	}
}

// Creates world with population
class WorldCreator {
	static create() {
		// Create world as matrix
		const world = new World(WIDTH, HEIGHT);
		// Create bots in world
		world.populate();
		world.initResources(world.map);

		return world;
	}
}

/*************************************************
 * Infrastructure level
 *************************************************/

function debug(msg) {
	console.log(msg);
}

class Drawer {
	constructor(world) {
		this.world = world;
		this.size = 10; // size of shulker

		const canvas = document.getElementById('cnv');
		canvas.width = WIDTH * this.size;
		canvas.height = HEIGHT * this.size;
		//canvas.style.width = WIDTH * 10;
		//canvas.style.height = HEIGHT * 10;
		this.ctx = canvas.getContext('2d');
		//this.ctx.imageSmoothingEnabled = false;

	}

	redraw() {
		const imageData = this.ctx.createImageData(WIDTH * this.size, HEIGHT * this.size);

		// Fill entire canvas with black
    for(let i = 0; i < WIDTH * this.size * HEIGHT * this.size * 4; i+=4) {
      imageData.data[i] = 0;
      imageData.data[i + 1] = 0;
      imageData.data[i + 2] = 0;
      imageData.data[i + 3] = 255;
    }

		// Draw resources
		let a = 0;
		this.world.eachCell((x, y) => {

			const cell = this.world.getCell(x, y);
			if (cell.resources) {
				if (cell.resources.food) {

					a ++;
				}

				this.drawResource(x, y, cell.resources, imageData);
			}
		});
		//debug(`cells: ${a}`)

		// Draw bots
		this.world.eachBot((bot) => {
			this.drawBot(bot, imageData);
		});


		// Display data on canvas
		this.ctx.putImageData(imageData, 0, 0);
	}

	drawResource(x, y, resources, imageData) {
		if (resources.food) {
			x = x * this.size;
			y = y * this.size;
			//const color = Math.random() > 0.5 ? { r: 140, g: 80, b: 0 } : { r: 0, g: 80, b: 0 };
			const color = { r: 140, g: 80, b: 0 };
			this.writeImageDataResource(x, y, color, imageData);
		}
	}

	writeImageDataResource(vx, vy, color, imageData) {
		for (let x = vx + 2; x < vx + this.size - 2; x++) {
			for (let y = vy + 2; y < vy + this.size - 2; y++) {
				this.writeImageDataPixel(x, y, color, imageData);
			}
		}
	}

	drawBot(bot, imageData) {
    let color;
    //if (bot.options.hasBotInFront) {
    //	color = { r: 255, g: 0, b: 0 };
    //} else {
    // Bot becomes dark if hungry

    // const g = 128 + parseInt(parseFloat(bot.id) * 128);

    //color = { r: 0, g: g, b: 100 };
    color = HSVtoRGB(bot.style.h, bot.style.s, bot.style.v);


    //}
    bot = this.setColor(bot);

		const x = bot.x * this.size;
    const y = bot.y * this.size;

		this.writeImageDataBot(x, y, bot.direction, color, imageData)

	}

  setColor(bot) {

	  return bot;
  }

	writeImageDataBot(vx, vy, direction, color, imageData) {
		for (let x = vx; x < vx + this.size; x++) {
			for (let y = vy; y < vy + this.size; y++) {
				this.writeImageDataPixel(x, y, color, imageData);
			}
		}

		// //Draw mouth (face)
		// const mouthDeep = 1;
		// const mouthMargins = 3;
		// const faceColor = { r: 0, g: 0, b: 0 };
		// if (direction == 0) {
		// 	for (let x = vx + this.size - mouthDeep; x < vx + this.size; x++) {
		// 		for (let y = vy + mouthMargins; y < vy + this.size - mouthMargins; y++) {
		// 			this.writeImageDataPixel(x, y, faceColor, imageData);
		// 		}
		// 	}
		// }
		// if (direction == 90) {
		// 	for (let x = vx + mouthMargins; x < vx + this.size - mouthMargins; x++) {
		// 		for (let y = vy; y < vy + mouthDeep; y++) {
		// 			this.writeImageDataPixel(x, y, faceColor, imageData);
		// 		}
		// 	}
		// }
		// if (direction == 180) {
		// 	for (let x = vx; x < vx + mouthDeep; x++) {
		// 		for (let y = vy + mouthMargins; y < vy + this.size - mouthMargins; y++) {
		// 			this.writeImageDataPixel(x, y, faceColor, imageData);
		// 		}
		// 	}
		// }
		// if (direction == 270) {
		// 	for (let x = vx + mouthMargins; x < vx + this.size - mouthMargins; x++) {
		// 		for (let y = vy + this.size - mouthDeep; y < vy + this.size; y++) {
		// 			this.writeImageDataPixel(x, y, faceColor, imageData);
		// 		}
		// 	}
		// }

	}

	writeImageDataPixel(x, y, color, imageData) {
		let index = ((y * (WIDTH * this.size * 4)) + (x * 4)) + 0;
		imageData.data[index] = color.r;
		index++;
		imageData.data[index] = color.g;
		index++;
		imageData.data[index] = color.b;
		index++;
		imageData.data[index] = 255;
	}
}

var counter = 0;
class GamePerformer {
	constructor(world) {
		if(!world) throw Error('Invalid argument world');
		this.world = world;
		this.drawer = new Drawer(world);
	}

	step() {
    let t0 = performance.now();

    this.world.step();
    t0 = performance.now() - t0;


    counter++;
		let t1 = performance.now();
		this.drawer.redraw();
		t1 = performance.now() - t1;

		if(counter%11 === 0) {

			console.log(`perf: ${t0}, ${t1} milliseconds.`);
    }



    requestAnimationFrame(() => this.step());
  }

	run() {
    requestAnimationFrame(() => this.step());
    this.initDebugWindow();
	}

	initDebugWindow() {
		const cnv = document.getElementById('cnv');
		const info = document.getElementById('info');

		const handleMouse = (e) => {
			// const width = cnv.clientLeft;
			// const height = cnv.clientHeight;

			const botWidth = cnv.clientWidth / WIDTH;
			const botHeight = cnv.clientHeight / HEIGHT;


			const botX = parseInt(e.x / botWidth);
			const botY = parseInt(e.y / botHeight);

			this.debugOptions = {
				botX,
				botY,
			};

		};
		cnv.addEventListener('mousedown', handleMouse);

		requestAnimationFrame(() => this.updateDebugWindow());

	}

	updateDebugWindow() {
		if (this.debugOptions) {

			const info = document.getElementById('info');

			const cell = debugWorld.getCell(this.debugOptions.botX, this.debugOptions.botY);
			let bot = Bot.get(cell);

			if(!bot) {
				bot = {
					x: '',
					y: '',
					xp: '',
					program: '',
					id: '',
				}
			}

			let content = '';

			//`${jsonPretty}`
			//const jsonPretty = JSON.stringify(bot);
			content += `x: ${bot.x}</br>`;
			content += `y: ${bot.y}</br>`;
			content += `xp: ${Math.floor(bot.xp)}</br>`;
			content += `program: ${bot.program.commands}</br>`;
			content += `id: ${bot.id}</br>`;




			info.innerHTML = content;



			// info.innerHTML = `${botX}:${botY}:${jsonPretty}`;
			//info.style.left = e.x + 'px';
			//info.style.top = e.y + 'px';
		}


		requestAnimationFrame(() => this.updateDebugWindow());
	}
}

function run() {
	const world = WorldCreator.create();
	const game = new GamePerformer(world);
	game.run();
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
 * https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
*/
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

Array.prototype.random = function () {
	return this[Math.floor((Math.random() * this.length))];
};
