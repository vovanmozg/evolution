import { Bot } from './domain/bot';
import { HEIGHT, WIDTH } from './domain/world';

const debugOptions = {};
let world;
let counter = 0;

// global vars for this module
const cnv = document.getElementById('cnv');
const info = document.getElementById('info');
const botWidth = cnv.clientWidth / WIDTH;
const botHeight = cnv.clientHeight / HEIGHT;

const updateDebugOptions = () => {
  if (debugOptions.botX === undefined) return;
  if (debugOptions.botY === undefined) return;

  debugOptions.bot = Bot.get(
    world.getCell(
      debugOptions.botX,
      debugOptions.botY,
    ),
  );
};

const handleClick = (e) => {
  debugOptions.botX = parseInt(e.x / botWidth, 10);
  debugOptions.botY = parseInt(e.y / botHeight, 10);
  updateDebugOptions();
};

function updateDebugWindow() {
  const { bot } = debugOptions;
  // When bot dies we should load new info
  if (bot === undefined || (bot && bot.xp <= 0)) {
    updateDebugOptions();
    return;
  }

  info.innerHTML = `x: ${bot.x}</br>`
    + `y: ${bot.y}</br>`
    + `xp: ${parseInt(bot.xp, 10)}</br>`
    + `program: ${bot.program.commands}</br>`
    + `id: ${bot.id}</br>`;
}

function initDebugWindow(worldObject) {
  world = worldObject;
  cnv.addEventListener('mousedown', handleClick);

  setInterval(updateDebugWindow, 1000);
  // requestAnimationFrame(() => updateDebugWindow());
}

function onTick(times) {
  counter += 1;
  window.debugInfo1 = `${counter} ${Date.now()} perf: ${times[0]}, ${times[1]} milliseconds`;
}

export {
  initDebugWindow,
  onTick,
};
