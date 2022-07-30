"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
const discord_js_1 = require("discord.js");
const ArgsParser_1 = require("../ArgsParser/ArgsParser");
const WebScraper_1 = require("../WebScraper/WebScraper");
const map = async (message, command, _) => {
    const args = (0, ArgsParser_1.parseArgs)(_.join(" "));
    const flags = args.map((x) => x.flag);
    if (!flags.includes("default"))
        return message.channel.send("Invalid Command Usage; expected: `-map <map name>`");
    let mapName = args.find((x) => x.flag == "default").arg;
    let data;
    try {
        let scraper = new WebScraper_1.WebScraper();
        data = await scraper.getMapStats(mapName);
    }
    catch (e) {
        console.log(e);
        return message.channel.send("Failed to get map information, are you sure you typed the name correctly.");
    }
    let embed = new discord_js_1.EmbedBuilder();
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
exports.map = map;
