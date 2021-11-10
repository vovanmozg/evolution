/*
* @param direction {Number} can be 0 (right), 1 (top), 2 (left), 3 (bottom)
* @param rotate {Number} can be 1 (clockwise) or -1 (counterclockwise)
*/
// TODO: code duplication with rotate_clockwise.js
const rotate = (direction, rotateCounts) => (direction + rotateCounts) & 3;

function execute(bot, _world) {
  bot.direction = rotate(bot.direction, -1);
}

export default {
  execute,
};
