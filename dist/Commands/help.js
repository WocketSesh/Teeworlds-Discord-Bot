"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = void 0;
const discord_js_1 = require("discord.js");
const __1 = require("..");
const help = (message, command, args) => {
    if (!args[0]) {
        let embed = new discord_js_1.EmbedBuilder();
        embed.setTitle("Help");
        embed.setDescription("Use `-help <command name>` for help about a specific command.");
        embed.setColor("#32167a");
        embed.addFields([
            {
                name: "Commands",
                value: __1.commandHandler.commands.map((x) => x.name).join("\n"),
            },
        ]);
        message.channel.send({ embeds: [embed] });
    }
    else {
        let cmdName = args[0];
        let cmdInfo = __1.commandHandler.commands.find((x) => x.name == cmdName);
        if (!cmdInfo)
            return message.channel.send(`A command with the name ${cmdName} does not exist.`);
        let embed = new discord_js_1.EmbedBuilder();
        embed.setColor("#32167a");
        embed.setTitle("Help " + cmdName);
        embed.addFields([
            {
                name: "Name",
                value: cmdInfo.name,
                inline: true,
            },
            {
                name: "Description",
                value: cmdInfo.description ?? "None Set",
                inline: true,
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: true,
            },
            {
                name: "Expected Usage",
                value: cmdInfo.expectedUsage ?? "None Set",
                inline: true,
            },
            {
                name: "Aliases",
                value: cmdInfo.aliases.length ? cmdInfo.aliases.join("\n") : "None Set",
                inline: true,
            },
            {
                name: "Possible Flags",
                value: cmdInfo.flags.length ? cmdInfo.flags.join("\n") : "None Set",
                inline: true,
            },
        ]);
        message.channel.send({ embeds: [embed] });
    }
};
exports.help = help;
