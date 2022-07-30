import { PermissionResolvable, Message } from "discord.js";

export type CommandCallback = (
  message: Message,
  command: Command,
  args?: string[]
) => any;

export interface Command {
  func: CommandCallback;
  name: string;
  permission?: PermissionResolvable;
  flags: string[];
  aliases: string[];
  description: string;
  expectedUsage: string;
}

export class Command {
  constructor(
    name: string,
    func: CommandCallback,
    options?: {
      permission?: PermissionResolvable;
      aliases?: string[];
      flags?: string[];
      description?: string;
      expectedUsage?: string;
    }
  ) {
    this.name = name;
    this.func = func;

    if (options) {
      this.permission = options.permission ?? null;
      this.aliases = options.aliases ?? [];
      this.flags = options.flags ?? [];
      this.description = options.description ?? null;
      this.expectedUsage = options.expectedUsage ?? null;
    } else {
      this.permission = null;
      this.aliases = [];
      this.flags = [];
      this.description = null;
      this.expectedUsage = null;
    }
  }
}
