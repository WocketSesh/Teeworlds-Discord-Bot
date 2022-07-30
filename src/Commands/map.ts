import { EmbedBuilder } from "discord.js";

import { parseArgs } from "../ArgsParser/ArgsParser";
import { CommandCallback } from "../CommandHandler/Command";
import { MapStats, WebScraper } from "../WebScraper/WebScraper";

export const map: CommandCallback = async (message, command, _) => {
  const args = parseArgs(_.join(" "));
  const flags = args.map((x) => x.flag);

  if (!flags.includes("default"))
    return message.channel.send(
      "Invalid Command Usage; expected: `-map <map name>`"
    );
  let mapName = args.find((x) => x.flag == "default").arg;

  let data: MapStats;

  try {
    let scraper = new WebScraper();
    data = await scraper.getMapStats(mapName);
  } catch (e) {
    console.log(e);
    return message.channel.send(
      "Failed to get map information, are you sure you typed the name correctly."
    );
  }

  let embed = new EmbedBuilder();
  embed.setTitle(`${mapName} Info`);
  embed.setColor("#32167a");

  embed.addFields([
    {
      name: "Difficulty",
      value: data.info.difficulty + "(" + data.info.stars + ")",
      inline: true,
    },
    {
      name: "Finishes",
      value: `Solo: ${data.info.finishes}\nTeam: ${data.info.teamFinishes}`,
      inline: true,
    },
    {
      name: "Misc",
      value: `Points: ${data.info.points}\nMedian Time: ${data.info.medianTime}\nBiggest Team: ${data.info.biggestTeam}`,
      inline: true,
    },
    {
      name: "Records",
      value: data.timeRanks
        .map((x) => `${x.rank}. ${x.player} (${x.time})`)
        .join("\n"),
      inline: true,
    },
    {
      name: "Team Records",
      value: data.teamRanks
        .map((x) => `${x.rank}. ${x.player} (${x.time})`)
        .join("\n"),
      inline: true,
    },
    {
      name: "Finishes",
      value: data.finishRanks
        .map((x) => `${x.rank}. ${x.player} (${x.finishes}) `)
        .join("\n"),
      inline: true,
    },
  ]);

  message.channel.send({ embeds: [embed] });
};
