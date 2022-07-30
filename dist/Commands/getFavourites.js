"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavourites = void 0;
const discord_js_1 = require("discord.js");
const WebScraper_1 = require("../WebScraper/WebScraper");
const getFavourites = async (message, command, args) => {
    if (!args[0])
        return message.channel.send(`Invalid Command Usage, expected: \`-favourite <player name>\``);
    let playerName = args.join(" ");
    let data;
    try {
        let scraper = new WebScraper_1.WebScraper();
        data = await scraper.getFavouritePartners(playerName);
    }
    catch (e) {
        return message.channel.send("Failed to get user information, are you sure you typed the name correctly");
    }
    let embed = new discord_js_1.EmbedBuilder();
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
exports.getFavourites = getFavourites;
