import { Client, GatewayIntentBits } from "discord.js";

import { CommandHandler } from "./CommandHandler/CommandHandler";
import { getFavourites } from "./Commands/getFavourites";
import { getLatest } from "./Commands/getLatest";
import { help } from "./Commands/help";
import { map } from "./Commands/map";
import { stats } from "./Commands/stats";

/* eslint-disable import/first */
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

export const commandHandler = new CommandHandler(client, "-");

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log(`Client logged in as ${client.user.tag}`);
});
commandHandler.register("favourites", getFavourites, {
  aliases: ["f"],
  expectedUsage: "-favourites <playername> [-flags]",
});
commandHandler.register("latest", getLatest, {
  aliases: ["l"],
  expectedUsage: "-latest <playername> [-flags]",
});
commandHandler.register("stats", stats, {
  aliases: ["s"],
  flags: ["map", "difficulty"],
  expectedUsage: "-stats <playername> [-flags]",
});
commandHandler.register("map", map, {
  aliases: ["m"],
  expectedUsage: "-map <mapname> [-flags]",
});
commandHandler.register("help", help, {
  aliases: ["h"],
  expectedUsage: "-help [commandname]",
});
