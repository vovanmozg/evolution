import { createDrawer, redraw } from './drawer';
import {
  createWorld, step as worldStep,
} from './domain/world';
import { initDebugWindow, onTick } from './debug_window';
// import M from './random.js';

// let redraw;

function debugPerformance(performer, param = undefined) {
  const time = performance.now();
  performer(param);
  return performance.now() - time;
}

function step(world, drawer) {
  worldStep(world);
  redraw(drawer);

  const t0 = debugPerformance(worldStep, world);
  const t1 = debugPerformance(redraw, drawer);
  // // Print performance debug information
  onTick([t0, t1]);

  requestAnimationFrame(() => step(world, drawer));
}

// window.debugInfo2 = {
//   counter: 0,
// };
//
// var canvas = document.getElementById('cnv');
// var ctx = canvas.getContext('2d');
// var W = 2500;
// var H = 2500;
// canvas.width = W;
// canvas.height = H;
//
//
// function test(timestamp) {
//   window.debugInfo2.counter ++;
//
//   const imageData = ctx.createImageData(W, H);
//
//   // Fill entire canvas with black
//   for (let i = 0; i < W * H * 4; i += 4) {
//     imageData.data[i] = 200;
//     imageData.data[i + 1] = 100;
//     imageData.data[i + 2] = 0;
//     imageData.data[i + 3] = 255;
//   }
//
//   ctx.putImageData(imageData, 0, 0);
//
//   requestAnimationFrame(test);
// }

function run(world, drawer) {
  // setInterval(() => {
  //   console.log(Date.now(), window.debugInfo2); // eslint-disable-line no-console
  // }, 1000);
  // requestAnimationFrame(test);
  // return

  // worldStep = world.step.bind(world);
  // redraw = drawer.redraw.bind(drawer);

  // this.stepBusinessLogic();

  requestAnimationFrame(() => step(world, drawer));

  setInterval(() => {
    console.log(Date.now(), window.debugInfo1); // eslint-disable-line no-console
  }, 1000);

  initDebugWindow(world);
}

function perform() {
  const world = createWorld();
  const drawer = createDrawer(world);
  run(world, drawer);
}

function debug(msg) {
  console.log(msg); // eslint-disable-line no-console
}

// stepBusinessLogic() {
//   return new Promise((resolve, _) => {
//     this.world.step();
//     this.drawer.redraw();
//     resolve();
//   }).then((res) => {
//     this.stepBusinessLogic();
//   });
// }

// stepRedraw() {
//
// }

export default {
  debug,
  perform,
};
