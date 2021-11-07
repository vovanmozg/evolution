import bot, { cloneBot } from '../bot';

const rightCyclicShift = bot.__get__('rightCyclicShift');

test('Shifts elements cyclically', () => {
  const ar = [1, 2, 3];
  expect(rightCyclicShift(ar)).toEqual([2, 3, 1]);
});

test('Clones bot', () => {
  const actialBot = {
    x: 0,
    y: 75,
    direction: 0,
    id: '0.3375412729217937',
    rotate: -1,
    program: { commands: [5, 1, 5], current: 1 },
    options: {},
    xp: 63.5,
    style: { h: 0.464, s: 0.036, v: 0.737 },
    processing: true,
  };

  const changes = {
    x: 1,
    y: 77,
    direction: 1,
    id: '0.252',
    xp: 42,
  };

  const expectedBot = {
    x: 1,
    y: 77,
    direction: 1,
    id: '0.252',
    rotate: -1,
    program: { commands: [5, 1, 5], current: 1 },
    options: {},
    xp: 42,
    style: { h: 0.464, s: 0.036, v: 0.737 },
    processing: true,
  };

  const newBot = cloneBot(actialBot, changes);

  expect(newBot).toEqual(expectedBot);
});

// Groups of bots for testing purposes. They can be used in populate()
// const TEST_CASES = [
//   [
//     {
//       ...DEFAULT_BOT, x: 42, y: 20, direction: 90, id: '0.99', rotate: 1, program: { commands: [1, 1, 0, 0, 1] }, options: {},
//     },
//     {
//       ...DEFAULT_BOT, x: 42, y: 21, direction: 90, id: '0.10', rotate: 1, program: { commands: [0, 1, 1, 1, 0] }, options: {},
//     },
//   ],
//   [
//     {
//       ...DEFAULT_BOT, x: 10, y: 10, direction: 270, id: '0.99', rotate: 1, program: { commands: [0, 1] }, options: {}, processing: false,
//     },
//     {
//       ...DEFAULT_BOT, x: 10, y: 11, direction: 90, id: '0.10', rotate: 1, program: { commands: [0, 1] }, options: {}, processing: false,
//     },
//   ],
//   [
//     {
//       ...DEFAULT_BOT, x: 10, y: 10, direction: 270, id: '0.99', rotate: 1, program: { commands: [5] }, options: {}, processing: false,
//     },
//   ],
// ];
