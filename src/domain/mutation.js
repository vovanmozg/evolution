import { OPERATIONS } from './program';

export class Mutation {
  static MUTATION_PROBABILITY = 0.001;

  static mutate(bot) {
    // Mutations are very rare
    if (Math.random() > Mutation.MUTATION_PROBABILITY) {
      return;
    }

    const mutations = [
      (commands, position) => this.mutateSubstitution(commands, position),
      (commands, position) => this.mutateDeletion(commands, position),
      (commands, position) => this.mutateInsertion(commands, position),
    ];

    const position = Math.floor(Math.random() * bot.program.commands.length);

    mutations.random()(bot.program.commands, position);

    bot.style.h = this.randomChangeStyleComponent(bot.style.h);
    bot.style.s = this.randomChangeStyleComponent(bot.style.s);
    bot.style.v = this.randomChangeStyleComponent(bot.style.v); //  * (bot.xp * 2 / 255)



    // // Substitution
    // bot.program.commands[position] = this.randomOperationCode();
    //
    // // Deletion
    // bot.program.commands.splice(position, 1);
    //
    // // Insertion
    // bot.program.commands.splice(position, 0, this.randomOperationCode());
  }


  static randomChangeStyleComponent(value) {
    const minComponentValue = 0;
    const maxComponentValue = 1;
    const change = maxComponentValue / 100;
    let sign = Math.random() > 0.5 ? 1 : -1;

    if (value + change * sign <= 0 || value + change * sign >= 1) {
      sign *= -1;
    }
    return value + change * sign;
  }

  static mutateSubstitution(commands, position) {
    commands[position] = this.randomOperationCode();
    return commands;
  }


  static mutateDeletion(commands, position) {
    commands.splice(position, 1);
    return commands;
  }

  static mutateInsertion(commands, position) {
    commands.splice(position, 0, this.randomOperationCode());
    return commands;
  }

  static randomOperationsPosition(commands) {
    return Math.floor(Math.random() * bot.program.commands.length);
  }

  static randomOperationCode() {
    return Object.values(OPERATIONS).random();
  }
}
