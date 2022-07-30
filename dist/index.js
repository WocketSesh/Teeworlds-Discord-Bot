"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandHandler = void 0;
const discord_js_1 = require("discord.js");
const CommandHandler_1 = require("./CommandHandler/CommandHandler");
const getFavourites_1 = require("./Commands/getFavourites");
const getLatest_1 = require("./Commands/getLatest");
const help_1 = require("./Commands/help");
const map_1 = require("./Commands/map");
const stats_1 = require("./Commands/stats");
/* eslint-disable import/first */
require("dotenv").config();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
exports.commandHandler = new CommandHandler_1.CommandHandler(client, "-");
client.login(process.env.TOKEN);
client.on("ready", () => {
    console.log(`Client logged in as ${client.user.tag}`);
});
exports.commandHandler.register("favourites", getFavourites_1.getFavourites, {
    aliases: ["f"],
    expectedUsage: "-favourites <playername> [-flags]",
});
exports.commandHandler.register("latest", getLatest_1.getLatest, {
    aliases: ["l"],
    expectedUsage: "-latest <playername> [-flags]",
});
exports.commandHandler.register("stats", stats_1.stats, {
    aliases: ["s"],
    flags: ["map", "difficulty"],
    expectedUsage: "-stats <playername> [-flags]",
});
exports.commandHandler.register("map", map_1.map, {
    aliases: ["m"],
    expectedUsage: "-map <mapname> [-flags]",
});
exports.commandHandler.register("help", help_1.help, {
    aliases: ["h"],
    expectedUsage: "-help [commandname]",
});
