// Mock for random function to make predictable states history.
// You will get the same evolution every time you run
const rands = [0.05, 0.5, 0.2, 0.7, 0.9, 0.3, 0.9, 0.9999, 0.1, 0.43, 0.31, 0.88, 0.99, 0.8];
let curRand = 0;

Math.random = function () {
  const value = rands[curRand];
  curRand += 1;
  if (curRand > rands.length - 1) {
    curRand = 0;
  }
  return value;
};

export default Math.random;
