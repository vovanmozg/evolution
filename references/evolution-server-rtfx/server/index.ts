import { WebSocketServer } from 'ws';
import Runner from './runner';

const wss = new WebSocketServer({ port: 8080 });

setInterval(() => {
  console.log(`perf: Steps in one second: ${Runner.world.steps}`);
  Runner.world.steps = 0;
}, 1000);

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});
