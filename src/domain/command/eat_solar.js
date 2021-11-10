function execute(bot, world) {
  const cell = world.getCell(bot.x, bot.y);

  bot.xp += cell.resources.light.power * 3;
}

export default {
  execute,
};
