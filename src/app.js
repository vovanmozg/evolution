import { Drawer } from './drawer';
import { createWorld, step as worldStep } from './domain/world';
import { initDebugWindow, onTick } from './debug_window';

let redraw;

function debugPerformance(performer, param = undefined) {
  const time = performance.now();
  performer(param);
  return performance.now() - time;
}

function step(world) {
  const t0 = debugPerformance(worldStep, world);
  const t1 = debugPerformance(redraw);
  // Print performance debug information
  onTick([t0, t1]);

  requestAnimationFrame(() => step(world));
}

function run(world, drawer) {
  // worldStep = world.step.bind(world);
  redraw = drawer.redraw.bind(drawer);

  // this.stepBusinessLogic();

  requestAnimationFrame(() => step(world));

  setInterval(() => {
    console.log(Date.now(), window.debugInfo1); // eslint-disable-line no-console
  }, 1000);

  initDebugWindow(world);
}

function perform() {
  const world = createWorld();
  const drawer = new Drawer(world);
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
