import { Client, GatewayIntentBits } from "discord.js";

import { CommandHandler } from "./CommandHandler/CommandHandler";
import { getFavourites } from "./Commands/getFavourites";
import { getLatest } from "./Commands/getLatest";
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

const commandHandler = new CommandHandler(client, "-");

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log(`Client logged in as ${client.user.tag}`);
});
commandHandler.register("favourites", getFavourites, { aliases: ["f"] });
commandHandler.register("latest", getLatest, { aliases: ["l"] });
commandHandler.register("stats", stats, { aliases: ["s"] });
commandHandler.register("map", map, { aliases: ["m"] });
