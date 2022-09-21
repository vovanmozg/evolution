import {
  eachBot, eachCell, HEIGHT, WIDTH,
} from './domain/world';
import Bot from './domain/bot';
import { getCell } from './domain/world/map_modifier';

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
 * https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
*/
function HSVtoRGB(h, s, v) {
  let r; let g; let b;
  if (arguments.length === 1) {
    s = h.s; v = h.v; h = h.h;
  }
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) { // eslint-disable-line default-case
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

const inMouth = (x, y, mouth) => x >= mouth[0] && x <= mouth[2] && y >= mouth[1] && y <= mouth[3];

const CELL_SIZE = 10;

// Generates color depending on program
function getColor(bot) {
  const dots = [
    0,
    0.15,
    0.3,
    0.45,
    0.6,
    0.75,
    0.9,
  ];

  const weights = bot.program.commands.map((operation) => dots[operation]);

  const sum = weights.reduce((a, b) => a + b, 0);
  const avg = (sum / weights.length) || 0;

  return HSVtoRGB(bot.style.h, bot.style.s, avg);

  // if (bot.options.hasBotInFront) {
  // color = { r: 255, g: 0, b: 0 };
  // } else {
  // Bot becomes dark if hungry

  // const g = 128 + parseInt(parseFloat(bot.id) * 128);

  // color = { r: 0, g: g, b: 100 };
  // color = HSVtoRGB(bot.style.h, bot.style.s, bot.style.v);
  // color = {r: bot.style.h * 255, g: bot.style.s * 255, b: bot.style.v * 255}

  // }
  // bot = this.setColor(bot);
}

function writeImageDataPixel(x, y, color, imageData) {
  let index = y * WIDTH * CELL_SIZE * 4 + x * 4;
  imageData.data[index] = color.r;
  index += 1;
  imageData.data[index] = color.g;
  index += 1;
  imageData.data[index] = color.b;
  index += 1;
  imageData.data[index] = color.a === undefined ? 255 : color.a;
}

function writeCenter(mainBodyLeftX, mainBodyRightX, mainBodyTopY, mainBodyBottomY, lmouth, color, imageData) {
  for (let x = mainBodyLeftX; x <= mainBodyRightX; x += 1) {
    for (let y = mainBodyTopY; y <= mainBodyBottomY; y += 1) {
      if (!inMouth(x, y, lmouth)) {
        writeImageDataPixel(x, y, color, imageData);
      }
    }
  }
}

function writeTopBottom(mainBodyLeftX, mainBodyRightX, botTopY, lmouth, color, imageData, botBottomY) {
  for (let x = mainBodyLeftX; x <= mainBodyRightX; x += 1) {
    // Top border
    if (!inMouth(x, botTopY, lmouth)) {
      writeImageDataPixel(x, botTopY, color, imageData); // {r: 255, g: 255, b: 255}
    }

    // Bottom border
    if (!inMouth(x, botBottomY, lmouth)) {
      writeImageDataPixel(x, botBottomY, color, imageData);
    }
  }
}

function writeLeftRight(mainBodyTopY, mainBodyBottomY, botLeftX, lmouth, color, imageData, botRightX) {
  for (let y = mainBodyTopY; y <= mainBodyBottomY; y += 1) {
    // Left border
    if (!inMouth(botLeftX, y, lmouth)) {
      writeImageDataPixel(botLeftX, y, color, imageData);
    }

    // Right border
    if (!inMouth(botRightX, y, lmouth)) {
      writeImageDataPixel(botRightX, y, color, imageData);
    }
  }
}

/**
 *  Bot structure
 *  - main body (X)
 *  - borders (b)
 *
 *  bbbbbbbb
 * bXXXXXXXXb
 * bXXXXXXXXb
 * bXXXXXXX
 * bXXXXXXX  <- mouth
 * bXXXXXXX
 * bXXXXXXX
 * bXXXXXXXXb
 * bXXXXXXXXb
 *  bbbbbbbb
 *
 * @param vx
 * @param vy
 * @param bot
 * @param direction
 * @param color
 * @param imageData
 */

function writeImageDataBot(vx, vy, bot, direction, color, imageData) {
  const mainBodyLeftX = vx + 1;
  const mainBodyRightX = vx + CELL_SIZE - 2;
  const mainBodyTopY = vy + 1;
  const mainBodyBottomY = vy + CELL_SIZE - 2;

  const botLeftX = vx;
  const botRightX = vx + CELL_SIZE - 1;
  const botTopY = vy;
  const botBottomY = vy + CELL_SIZE - 1;

  const mouthMargin = 4;
  const mouthDepth = 1;

  const mouth = {
    [Bot.RIGHT]: [
      botRightX - mouthDepth,
      botTopY + mouthMargin,
      botRightX,
      botBottomY - mouthMargin,
    ],
    [Bot.TOP]: [
      botLeftX + mouthMargin,
      botTopY,
      botRightX - mouthMargin,
      botTopY + mouthDepth,
    ],
    [Bot.LEFT]: [
      botLeftX,
      botTopY + mouthMargin,
      botLeftX + mouthDepth,
      botBottomY - mouthMargin,
    ],
    [Bot.BOTTOM]: [
      botLeftX + mouthMargin,
      botBottomY - mouthDepth,
      botRightX - mouthMargin,
      botBottomY,
    ],
  };

  const lmouth = mouth[direction];

  writeLeftRight(mainBodyTopY, mainBodyBottomY, botLeftX, lmouth, color, imageData, botRightX);
  writeTopBottom(mainBodyLeftX, mainBodyRightX, botTopY, lmouth, color, imageData, botBottomY);
  writeCenter(mainBodyLeftX, mainBodyRightX, mainBodyTopY, mainBodyBottomY, lmouth, color, imageData);
  // this.drawMouth(vx, vy, direction, imageData);
}

function drawBot(bot, imageData) {
  const color = getColor(bot);
  const x = bot.x * CELL_SIZE;
  const y = bot.y * CELL_SIZE;
  writeImageDataBot(x, y, bot, bot.direction, color, imageData);
}

function writeImageDataResource(vx, vy, color, imageData) {
  for (let x = vx + 3; x < vx + CELL_SIZE - 3; x += 1) {
    for (let y = vy + 3; y < vy + CELL_SIZE - 3; y += 1) {
      writeImageDataPixel(x, y, color, imageData);
    }
  }
}

function drawResource(x, y, resources, imageData) {
  if (resources.food) {
    x *= CELL_SIZE;
    y *= CELL_SIZE;
    // const color = Math.random() > 0.5 ? { r: 140, g: 80, b: 0 } : { r: 0, g: 80, b: 0 };
    const color = { r: 140, g: 80, b: 0 };
    writeImageDataResource(x, y, color, imageData);
  }
}

function drawResources(world, imageData) {
  // Draw resources
  eachCell(world, (x, y) => {
    const cell = getCell(x, y, world.map);
    if (cell.resources) {
      drawResource(x, y, cell.resources, imageData);
    }
  });
}

function createDrawer(world) {
  const canvas = document.getElementById('cnv');
  canvas.width = WIDTH * CELL_SIZE;
  canvas.height = HEIGHT * CELL_SIZE;

  const drawer = {
    // world,
    ctx: canvas.getContext('2d'),
  };

  drawer.ctx = canvas.getContext('2d');
  drawer.ctx.imageSmoothingEnabled = false;

  return drawer;
}

// Draw bots
function drawEachBot(bot, options) { drawBot(bot, options.imageData); }

function fill(imageData) {
  imageData.data.fill(0);
  // Fill entire canvas with black
  for (let i = 0; i < WIDTH * CELL_SIZE * HEIGHT * CELL_SIZE * 4; i += 4) {
    // imageData.data[i] = 0;
    // imageData.data[i + 1] = 0;
    // imageData.data[i + 2] = 0;
    imageData.data[i + 3] = 255;
  }
}

function redraw(drawer, world) {
  const imageData = drawer.ctx.createImageData(WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE);

  fill(imageData);

  // Draw resources
  drawResources(world, imageData);

  eachBot(world, drawEachBot, { imageData });

  // Display data on canvas
  drawer.ctx.putImageData(imageData, 0, 0);
}

export {
  createDrawer,
  redraw,
};
