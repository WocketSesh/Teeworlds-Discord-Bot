"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const Command_1 = require("./Command");
class CommandHandler {
    constructor(client, prefix) {
        this.client = client;
        this.prefix = prefix;
        this.commands = [];
        this.client.on("messageCreate", (message) => {
            if (message.member.user.bot)
                return;
            if (!message.content.startsWith(this.prefix))
                return;
            let [cmd, ...args] = message.content.slice(prefix.length).split(" ");
            let command = this.commands.find((x) => x.name == cmd.toLowerCase() || x.aliases.includes(cmd.toLowerCase()));
            if (!command)
                return;
            command.func(message, command, args);
        });
    }
    register(name, callback, options) {
        let command = new Command_1.Command(name, callback, options);
        this.commands.push(command);
        return command;
    }
}
exports.CommandHandler = CommandHandler;
