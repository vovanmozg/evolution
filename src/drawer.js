import {
  eachBot, eachCell,
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

class Drawer {
  constructor(world) {
    this.world = world;

    this.size = 10; // size of shulker

    const canvas = document.getElementById('cnv');
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    canvas.width = 100 * this.size;
    canvas.height = 40 * this.size;
  }

  redraw() {
    const imageData = this.ctx.createImageData(100 * this.size, 40 * this.size);

    // Fill entire canvas with black
    for (let i = 0; i < 100 * this.size * 40 * this.size * 4; i += 4) {
      imageData.data[i] = 0;
      imageData.data[i + 1] = 0;
      imageData.data[i + 2] = 0;
      imageData.data[i + 3] = 255;
    }

    // Draw resources
    eachCell(this.world, (x, y) => {
      const cell = getCell(x, y, this.world.map);
      if (cell.resources) {
        this.drawResource(x, y, cell.resources, imageData);
      }
    });

    // Draw bots
    eachBot(this.world, (bot) => {
      this.drawBot(bot, imageData);
    });

    // Display data on canvas
    this.ctx.putImageData(imageData, 0, 0);
  }

  drawResource(x, y, resources, imageData) {
    if (resources.food) {
      x *= this.size;
      y *= this.size;
      // const color = Math.random() > 0.5 ? { r: 140, g: 80, b: 0 } : { r: 0, g: 80, b: 0 };
      const color = { r: 140, g: 80, b: 0 };
      this.writeImageDataResource(x, y, color, imageData);
    }
  }

  writeImageDataResource(vx, vy, color, imageData) {
    for (let x = vx + 3; x < vx + this.size - 3; x += 1) {
      for (let y = vy + 3; y < vy + this.size - 3; y += 1) {
        this.writeImageDataPixel(x, y, color, imageData);
      }
    }
  }

  // Generates color depending on program
  getColor(bot) {
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

  drawBot(bot, imageData) {
    const color = this.getColor(bot);
    const x = bot.x * this.size;
    const y = bot.y * this.size;
    this.writeImageDataBot(x, y, bot, bot.direction, color, imageData);
  }

  setColor(bot) {
    return bot;
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
  writeImageDataBot(vx, vy, bot, direction, color, imageData) {
    const mainBodyLeftX = vx + 1;
    const mainBodyRightX = vx + this.size - 2;
    const mainBodyTopY = vy + 1;
    const mainBodyBottomY = vy + this.size - 2;

    const botLeftX = vx;
    const botRightX = vx + this.size - 1;
    const botTopY = vy;
    const botBottomY = vy + this.size - 1;

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

    for (let y = mainBodyTopY; y <= mainBodyBottomY; y += 1) {
      // Left border
      if (!inMouth(botLeftX, y, lmouth)) {
        this.writeImageDataPixel(botLeftX, y, color, imageData);
      }

      // Right border
      if (!inMouth(botRightX, y, lmouth)) {
        this.writeImageDataPixel(botRightX, y, color, imageData);
      }
    }

    for (let x = mainBodyLeftX; x <= mainBodyRightX; x += 1) {
      // Top border
      if (!inMouth(x, botTopY, lmouth)) {
        this.writeImageDataPixel(x, botTopY, color, imageData); // {r: 255, g: 255, b: 255}
      }

      // Bottom border
      if (!inMouth(x, botBottomY, lmouth)) {
        this.writeImageDataPixel(x, botBottomY, color, imageData);
      }
    }

    for (let x = mainBodyLeftX; x <= mainBodyRightX; x += 1) {
      for (let y = mainBodyTopY; y <= mainBodyBottomY; y += 1) {
        if (!inMouth(x, y, lmouth)) {
          this.writeImageDataPixel(x, y, color, imageData);
        }
      }
    }

    // this.drawMouth(vx, vy, direction, imageData);
  }

  writeImageDataPixel(x, y, color, imageData) {
    let index = y * 100 * this.size * 4 + x * 4;
    imageData.data[index] = color.r;
    index += 1;
    imageData.data[index] = color.g;
    index += 1;
    imageData.data[index] = color.b;
    index += 1;
    imageData.data[index] = color.a === undefined ? 255 : color.a;
  }
}

export {
  Drawer,
};
