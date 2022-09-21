import {
  createWorld,
  step as worldStep,
} from './domain/world';

function perform() {
  const world = createWorld();

  setInterval(() => { worldStep(world); }, 100);

  addEventListener('message', (_event) => {
    // event is an ExtendableMessageEvent object
    // console.log(`The client sent me a messaga`, event);
    self.postMessage(world);
  });
}

perform();
