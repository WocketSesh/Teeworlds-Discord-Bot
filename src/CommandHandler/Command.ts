import { PermissionResolvable, Message } from "discord.js";

export type CommandCallback = (
  message: Message,
  command: Command,
  args?: string[]
) => any;

export interface Command {
  func: CommandCallback;
  name: String;
  permission?: PermissionResolvable;
  aliases: String[];
}

export class Command {
  constructor(
    name: String,
    func: CommandCallback,
    options?: { permission?: PermissionResolvable; aliases?: String[] }
  ) {
    this.name = name;
    this.func = func;

    if (options) {
      this.permission = options.permission ?? null;
      this.aliases = options.aliases ?? [];
    } else {
      this.permission = null;
      this.aliases = [];
    }
  }
}
