import { EmbedBuilder } from "discord.js";

import { CommandCallback } from "../CommandHandler/Command";
import { WebScraper } from "../WebScraper/WebScraper";

export const getLatest: CommandCallback = async (message, command, args) => {
  if (!args[0])
    return message.channel.send(
      "Invalid Command Usage, expected: `-latest <player name>`"
    );
  let playerName = args.join(" ");

  let data;

  try {
    let scraper = new WebScraper();
    data = await scraper.getLatestFinishes(playerName);
  } catch (e) {
    return message.channel.send(
      "Failed to get user information, are you sure you typed the name correctly."
    );
  }

  let embed = new EmbedBuilder();
  embed.setTitle(`Latest Finishes For ${playerName}`);
  embed.addFields([
    {
      name: "Completed",
      value: data
        .map((x) => "<t:" + x.date.getTime() / 1000 + ":R>")
        .join("\n"),
      inline: true,
    },
    {
      name: "Map Difficulty",
      value: data.map((x) => x.mapType).join("\n"),
      inline: true,
    },
    {
      name: "Map Name",
      value: data.map((x) => x.mapName).join("\n"),
      inline: true,
    },
  ]);
  embed.setColor("#32167a");

  message.channel.send({ embeds: [embed] });
};
