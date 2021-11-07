import { Drawer } from './drawer';
import { WorldCreator } from './domain/world';
import { initDebugWindow, onTick } from './debug_window';

let worldStep;
let redraw;

function debugPerformance(performer) {
  const time = performance.now();
  performer();
  return performance.now() - time;
}

function step(world) {
  const t0 = debugPerformance(worldStep);
  const t1 = debugPerformance(redraw);
  // Print performance debug information
  onTick([t0, t1]);

  requestAnimationFrame(() => step(world));
}

function run(world, drawer) {
  worldStep = world.step.bind(world);
  redraw = drawer.redraw.bind(drawer);

  // this.stepBusinessLogic();

  requestAnimationFrame(() => step(world));

  setInterval(() => {
    console.log(Date.now(), window.debugInfo1); // eslint-disable-line no-console
  }, 1000);

  initDebugWindow(world);
}

function perform() {
  const world = WorldCreator.create();
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
