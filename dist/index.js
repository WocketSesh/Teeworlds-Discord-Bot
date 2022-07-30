"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandHandler_1 = require("./CommandHandler/CommandHandler");
const getFavourites_1 = require("./Commands/getFavourites");
const getLatest_1 = require("./Commands/getLatest");
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
const commandHandler = new CommandHandler_1.CommandHandler(client, "-");
client.login(process.env.TOKEN);
client.on("ready", () => {
    console.log(`Client logged in as ${client.user.tag}`);
});
commandHandler.register("favourites", getFavourites_1.getFavourites, { aliases: ["f"] });
commandHandler.register("latest", getLatest_1.getLatest, { aliases: ["l"] });
commandHandler.register("stats", stats_1.stats, { aliases: ["s"] });
commandHandler.register("map", map_1.map, { aliases: ["m"] });
