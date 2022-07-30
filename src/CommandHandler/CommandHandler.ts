import { Client, PermissionResolvable } from "discord.js";

import { Command, CommandCallback } from "./Command";

export interface CommandHandler {
  client: Client;
  commands: Command[];
  prefix: string;
}

export class CommandHandler {
  constructor(client: Client, prefix: string) {
    this.client = client;
    this.prefix = prefix;
    this.commands = [];

    this.client.on("messageCreate", (message) => {
      if (message.member.user.bot) return;
      if (!message.content.startsWith(this.prefix)) return;

      let [cmd, ...args] = message.content.slice(prefix.length).split(" ");

      let command = this.commands.find(
        (x) =>
          x.name == cmd.toLowerCase() || x.aliases.includes(cmd.toLowerCase())
      );

      if (!command) return;

      command.func(message, command, args);
    });
  }

  register(
    name: string,
    callback: CommandCallback,
    options?: {
      permission?: PermissionResolvable;
      aliases?: string[];
      flags?: string[];
      description?: string;
      expectedUsage?: string;
    }
  ): Command {
    let command = new Command(name, callback, options);
    this.commands.push(command);
    return command;
  }
}
