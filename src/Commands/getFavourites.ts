import { EmbedBuilder } from "discord.js";
import { CommandCallback } from "../CommandHandler/Command";
import { WebScraper } from "../WebScraper/WebScraper";

export interface FavouritePartners {
  name: string;
  finishes: number;
}

export const getFavourites: CommandCallback = async (
  message,
  command,
  args
) => {
  if (!args[0])
    return message.channel.send(
      `Invalid Command Usage, expected: \`-favourite <player name>\``
    );

  let playerName = args.join(" ");

  let data: FavouritePartners[];
  try {
    let scraper = new WebScraper();
    data = await scraper.getFavouritePartners(playerName);
  } catch (e) {
    return message.channel.send(
      "Failed to get user information, are you sure you typed the name correctly"
    );
  }
  let embed = new EmbedBuilder();
  embed.setTitle(`Favourite Partners For ${playerName}`);
  embed.addFields([
    {
      name: "Name",
      value: data.map((x) => x.name).join("\n"),
      inline: true,
    },
    {
      name: "Ranks",
      value: data.map((x) => x.finishes).join("\n"),
      inline: true,
    },
  ]);
  embed.setColor("#32167a");

  message.channel.send({ embeds: [embed] });
};
