import Bot, { DEFAULT_BOT } from './bot';
import { WorldCreator } from './world';

import { World } from './world';

// const DEFAULT_CELL = {
// 	resources: {},
// };

// const FPS = 1;



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
		canvas.width = World.WIDTH * this.size;
		canvas.height = World.HEIGHT * this.size;
		//canvas.style.width = WIDTH * 10;
		//canvas.style.height = HEIGHT * 10;
		this.ctx = canvas.getContext('2d');
		//this.ctx.imageSmoothingEnabled = false;

	}

	redraw() {
		const imageData = this.ctx.createImageData(World.WIDTH * this.size, World.HEIGHT * this.size);

		// Fill entire canvas with black
    for(let i = 0; i < World.WIDTH * this.size * World.HEIGHT * this.size * 4; i+=4) {
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
		let index = ((y * (World.WIDTH * this.size * 4)) + (x * 4)) + 0;
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

			const botWidth = cnv.clientWidth / World.WIDTH;
			const botHeight = cnv.clientHeight / World.HEIGHT;


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

run();
