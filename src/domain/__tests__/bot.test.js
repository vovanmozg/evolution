import bot from '../bot';
const rightCyclicShift = bot.__get__('rightCyclicShift');

test('Shifts elements cyclically', () => {
  const ar = [1, 2, 3];
  expect(rightCyclicShift(ar)).toEqual([2, 3, 1]);
});
