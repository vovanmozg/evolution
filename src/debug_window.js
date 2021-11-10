// import { 40, 100 } from './domain/world/constants';
import { getBot } from './domain/world/bot_finder';

const debugOptions = {};
let world;
let counter = 0;

// global vars for this module
const cnv = document.getElementById('cnv');
const info = document.getElementById('info');
const botWidth = cnv.clientWidth / 100;
const botHeight = cnv.clientHeight / 40;

const updateDebugOptions = () => {
  if (debugOptions.botX === undefined) return;
  if (debugOptions.botY === undefined) return;
  debugOptions.bot = getBot(debugOptions.botX, debugOptions.botY, world.map);
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
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function onTick(times) {
  counter += 1;
  const hash = JSON.stringify(window.debugWorld).hashCode();
  window.debugInfo1 = `${counter} ${hash} ${Date.now()} perf: ${times[0]}, ${times[1]} milliseconds`;
  updateDebugWindow()
}

export {
  initDebugWindow,
  onTick,
};
