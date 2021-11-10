function execute(bot, world) {
  const cell = world.getCell(bot.x, bot.y);
  if (cell.resources.food) {
    bot.xp += 100;
    if (bot.xp > 255) bot.xp = 255;
    delete cell.resources.food;
  }
}

export default {
  execute,
};
