// const DEFAULT_CELL = {
// 	resources: {},
// };

const DEFAULT_BOT = {
	x: 0,
	y: 0,
	direction: 0,
	id: null,
	rotate: 1,
	program: { commands: [] }, // TODO: ссылка на общий объект
	options: {}, // TODO: ссылка на общий объект
	xp: 127,
};

const TEST_CASES = [
	[
		{ ...DEFAULT_BOT, x: 42, y: 20, direction: 90, id: '0.99', rotate: 1, program: { commands: [1, 1, 0, 0, 1] }, options: {} },
		{ ...DEFAULT_BOT, x: 42, y: 21, direction: 90, id: '0.10', rotate: 1, program: { commands: [0, 1, 1, 1, 0] }, options: {} },
	],
	[
		{ ...DEFAULT_BOT, x: 10, y: 10, direction: 270, id: '0.99', rotate: 1, program: { commands: [0,1] }, options: {}, processing: false },
		{ ...DEFAULT_BOT, x: 10, y: 11, direction: 90, id: '0.10', rotate: 1, program: { commands: [0,1] }, options: {}, processing: false },
	],
];

const WIDTH = 100;
const HEIGHT = 50;

const FPS = 10;

const OPERATIONS = {
	MOVE: 0,
	ROTATE_CLOCKWISE: 1,
	ROTATE_COUNTERCLOCKWISE: 2,
	EAT: 3,
};

/*************************************************
 * Domain level
 *************************************************/
class Command {
	// Generates random operations sequence
	static rand() {
		const items = [
			OPERATIONS.MOVE,
			OPERATIONS.ROTATE_CLOCKWISE,
			OPERATIONS.ROTATE_COUNTERCLOCKWISE,
			OPERATIONS.EAT,
		];

		return items[Math.floor(Math.random() * items.length)];
	}

	static execute(bot, world) {
		if (bot.processing === true) {
			return;
		}

		bot.processing = true;
		//debug(bot);

		const commands = {
			[OPERATIONS.MOVE]: CommandMove,
			[OPERATIONS.ROTATE_CLOCKWISE]: CommandRotateClockwise,
			[OPERATIONS.ROTATE_COUNTERCLOCKWISE]: CommandRotateCounterclockwise,
			[OPERATIONS.EAT]: CommandEat,
		};


		const command = bot.program.commands.shift();
		bot.program.commands.push(command);


		commands[command].execute(bot, world);
	}
}

class CommandMove {
	static execute(bot, world) {
		let xNew = 0, yNew = 0;

		if (bot.direction === 0) {
			xNew = bot.x + 1;
			yNew = bot.y;
		}
		if (bot.direction === 90) {
			xNew = bot.x;
			yNew = bot.y - 1;
		}
		if (bot.direction === 180) {
			xNew = bot.x - 1;
			yNew = bot.y;
		}
		if (bot.direction === 270) {
			xNew = bot.x;
			yNew = bot.y + 1;
		}

		if (xNew < 0) xNew = WIDTH - 1;
		if (xNew > WIDTH - 1) xNew = 0;
		if (yNew < 0) yNew = HEIGHT - 1;
		if (yNew > HEIGHT - 1) yNew = 0;

		const cell = world.getCell(xNew, yNew);
		const botInFront = Bot.get(cell);

		if (botInFront) {

			bot.options = { ...bot.options, hasBotInFront: true };

		} else {
			world.setCellProps(xNew, yNew, { bot }, world.map)
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
			delete cell.resources.food;
		}
	}
}

class Program {
	static generate() {
		const commands = [];
		// Create program with 20 commands
		for(let i = 0; i < 10; i++) {
			const command = Command.rand();
			commands.push(command);
		}

		return {
			commands,
		};
	}

	static step(bot, world) {
		Command.execute(bot, world);
	}
}

class Bot {
	static generateRandom(x, y) {
		return {
			...DEFAULT_BOT,
			id: '' + Math.random(),
			x: x,
			y: y,
			direction: 0,
			rotate: Math.random() > 0.5 ? 1 : -1,
			program: Program.generate(),
		};
	}

	static get(cell) {
		return cell.bot;
	}
}

class Resource {
	static add(x, y, resource, map) {
		World.validateCoords(x, y);
		map[x][y].resources.food = resource;
	}

	static generateRandom() {
		return {
			type: 'food',
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

	populate() {
		//this.populateTest1(); return;

		this.eachCell((x, y) => {
			if (Math.random() > 0.90) {
				this.addBot(x, y, Bot.generateRandom(x, y));
			}
		});
	}

	populateTest1() {
		TEST_CASES[1].forEach((botOptions) => {
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
		})
		debug(a)
	}

	step() {
		// localStorage.world = JSON.stringify(this.map);

		// Perform next action for every Bot
		this.eachBot( bot => Program.step(bot, this));

		this.eachBot( bot => {
			bot.xp--;
			if (bot.xp <= 0) {
				this.destroyBot(bot);

				let resource = Resource.generateRandom();
				Resource.add(bot.x, bot.y, resource, this.map);
			}
		});

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
		debug(s);
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
	//console.log(msg);
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
		for (let x = 0; x < WIDTH * this.size; x++) {
			for (let y = 0; y < HEIGHT * this.size; y++) {
				const color = { r: 0, g: 0, b: 0 };
				this.writeImageDataPixel(x, y, color, imageData);
			}
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
		debug(`cells: ${a}`)

		// Draw bots
		this.world.eachBot((bot) => {
			let color;
			if (bot.options.hasBotInFront) {
				color = { r: 255, g: 0, b: 0 };
			} else {
				// Bot becomes dark if hungry
				const g = bot.xp * 2;
				// const g = 128 + parseInt(parseFloat(bot.id) * 128);

				color = { r: 0, g: g, b: 100 };
			}
			this.drawBot(bot.x, bot.y, bot.direction, color, imageData);
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

	drawBot(x, y, direction, color = { r: 0, g: 100, b: 100 }, imageData) {
		x = x * this.size;
		y = y * this.size;

		this.writeImageDataBot(x, y, direction, color, imageData)

	}

	writeImageDataBot(vx, vy, direction, color, imageData) {
		for (let x = vx; x < vx + this.size; x++) {
			for (let y = vy; y < vy + this.size; y++) {
				this.writeImageDataPixel(x, y, color, imageData);
			}
		}

		const faceColor = { r: 0, g: 0, b: 0 };
		if (direction == 0) {
			for (let x = vx + this.size - 5; x < vx + this.size; x++) {
				for (let y = vy + 2; y < vy + this.size - 2; y++) {
					this.writeImageDataPixel(x, y, faceColor, imageData);
				}
			}
		}
		if (direction == 90) {
			for (let x = vx + 2; x < vx + this.size - 2; x++) {
				for (let y = vy; y < vy + 5; y++) {
					this.writeImageDataPixel(x, y, faceColor, imageData);
				}
			}
		}
		if (direction == 180) {
			for (let x = vx; x < vx + 5; x++) {
				for (let y = vy + 2; y < vy + this.size - 2; y++) {
					this.writeImageDataPixel(x, y, faceColor, imageData);
				}
			}
		}
		if (direction == 270) {
			for (let x = vx + 2; x < vx + this.size - 2; x++) {
				for (let y = vy + this.size - 5; y < vy + this.size; y++) {
					this.writeImageDataPixel(x, y, faceColor, imageData);
				}
			}
		}

	}

	writeImageDataPixel(x, y, color, imageData) {
		imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 0] = color.r;
		imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 1] = color.g;
		imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 2] = color.b;
		imageData.data[((y * (imageData.width * 4)) + (x * 4)) + 3] = 255;
	}
}

class GamePerformer {
	constructor(world) {
		if(!world) throw Error('Invalid argument world');
		this.world = world;
		this.drawer = new Drawer(world);
	}

	run() {
		setInterval( () => {
			this.world.step();
			this.drawer.redraw();
		}, 1000 / FPS );
	}
}

function run() {
	const world = WorldCreator.create();
	const game = new GamePerformer(world);
	game.run();
}


// class Drawer2 {
// 	constructor(world) {
// 		this.world = world;
// 		this.svg = Snap("#svg");
// 		this.size = 10; // size of shulker
// 		this.splines = {};
// 	}
//
// 	redraw() {
// 		this.world.eachBot((bot) => {
// 			if (!this.splines[bot.id]) {
// 				const spline = this.svg.rect(0, 0, this.size, this.size);
// 				const randomColor = Math.floor(Math.random()*16777215).toString(16);
// 				spline.attr({ fill: this.svg.gradient("l(0, 0, 1, 0)#000-#" + randomColor) });
// 				this.splines[bot.id] = spline;
// 			}
// 			this.splines[bot.id].attr({
// 				x: bot.x * 10,
// 				y: bot.y * 10,
// 			});
// 		});
// 	}
// }
