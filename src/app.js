import {
  Bot,
  DEFAULT_BOT,
  RIGHT,
  TOP,
  LEFT,
  BOTTOM,
} from './domain/bot';
import {
  WorldCreator, World, WIDTH, HEIGHT,
} from './domain/world';
import { Drawer } from './drawer';

// const DEFAULT_CELL = {
// 	resources: {},
// };

// const FPS = 1;

// Groups of bots for testing purposes. They can be used in populate()
const TEST_CASES = [
  [
    {
      ...DEFAULT_BOT, x: 42, y: 20, direction: 90, id: '0.99', rotate: 1, program: { commands: [1, 1, 0, 0, 1] }, options: {},
    },
    {
      ...DEFAULT_BOT, x: 42, y: 21, direction: 90, id: '0.10', rotate: 1, program: { commands: [0, 1, 1, 1, 0] }, options: {},
    },
  ],
  [
    {
      ...DEFAULT_BOT, x: 10, y: 10, direction: 270, id: '0.99', rotate: 1, program: { commands: [0, 1] }, options: {}, processing: false,
    },
    {
      ...DEFAULT_BOT, x: 10, y: 11, direction: 90, id: '0.10', rotate: 1, program: { commands: [0, 1] }, options: {}, processing: false,
    },
  ],
  [
    {
      ...DEFAULT_BOT, x: 10, y: 10, direction: 270, id: '0.99', rotate: 1, program: { commands: [5] }, options: {}, processing: false,
    },
  ],
];

/** ***********************************************
 * Infrastructure level
 ************************************************ */

function debug(msg) {
  console.log(msg);
}

let counter = 0;
class GamePerformer {
  constructor(world) {
    if (!world) throw Error('Invalid argument world');
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

    window.debugInfo1 = `${counter} ${Date.now()} perf: ${t0}, ${t1} milliseconds`;

    requestAnimationFrame(() => this.step());
    // requestAnimationFrame(() => setTimeout(()=>this.step(), 1000));
  }

  stepBusinessLogic() {
    return new Promise((resolve, _) => {
      this.world.step();
      this.drawer.redraw();
      resolve();
    }).then((res) => {
      this.stepBusinessLogic();
    });
  }

  stepRedraw() {

  }

  run() {
    // this.stepBusinessLogic();

    requestAnimationFrame(() => this.step());

    setInterval(() => {
      console.log(Date.now(), window.debugInfo1);
    }, 1000);

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

      if (!bot) {
        bot = {
          x: '',
          y: '',
          xp: '',
          program: '',
          id: '',
        };
      }

      let content = '';

      // `${jsonPretty}`
      // const jsonPretty = JSON.stringify(bot);
      content += `x: ${bot.x}</br>`;
      content += `y: ${bot.y}</br>`;
      content += `xp: ${Math.floor(bot.xp)}</br>`;
      content += `program: ${bot.program.commands}</br>`;
      content += `id: ${bot.id}</br>`;

      info.innerHTML = content;

      // info.innerHTML = `${botX}:${botY}:${jsonPretty}`;
      // info.style.left = e.x + 'px';
      // info.style.top = e.y + 'px';
    }

    requestAnimationFrame(() => this.updateDebugWindow());
  }
}

function run() {
  const world = WorldCreator.create();
  const game = new GamePerformer(world);
  game.run();
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
};

run();
