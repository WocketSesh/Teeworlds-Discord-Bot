"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stats = void 0;
const discord_js_1 = require("discord.js");
const ArgsParser_1 = require("../ArgsParser/ArgsParser");
const WebScraper_1 = require("../WebScraper/WebScraper");
const difficulties = [
    "novice",
    "moderate",
    "brutal",
    "insane",
    "dummy",
    "solo",
    "race",
    "fun",
    "ddmax",
    "oldschool",
];
const stats = async (message, command, _) => {
    let args = (0, ArgsParser_1.parseArgs)(_.join(" "));
    let flags = args.map((x) => x.flag);
    if (!args.find((x) => x.flag == "default"))
        return message.channel.send(`Invalid Command Usage; expected: \`-stats <player name>\``);
    let playerName = args.find((x) => x.flag == "default").arg;
    let data;
    try {
        let scraper = new WebScraper_1.WebScraper();
        data = await scraper.getPlayerStats(playerName);
    }
    catch (e) {
        console.error(e);
        return message.channel.send("Failed to get user information, are you sure you typed the name correctly.");
    }
    let novice = data.mapData.find((x) => x.difficulty == "Novice");
    let moderate = data.mapData.find((x) => x.difficulty == "Moderate");
    let brutal = data.mapData.find((x) => x.difficulty == "Brutal");
    let insane = data.mapData.find((x) => x.difficulty == "Insane");
    let dummy = data.mapData.find((x) => x.difficulty == "Dummy");
    let solo = data.mapData.find((x) => x.difficulty == "Solo");
    let race = data.mapData.find((x) => x.difficulty == "Race");
    let fun = data.mapData.find((x) => x.difficulty == "Fun");
    let ddmax = data.mapData.find((x) => x.difficulty == "DDmaX");
    let oldschool = data.mapData.find((x) => x.difficulty == "Oldschool");
    let maps = [
        novice,
        moderate,
        brutal,
        insane,
        dummy,
        solo,
        race,
        fun,
        ddmax,
        oldschool,
    ];
    if (flags.includes("-map") || flags.includes("-m")) {
        let mapName = args.find((x) => x.flag == "-map" || x.flag == "-m").arg;
        let map;
        let didYouMean = [];
        // Providing difficulty flag alongside map flag will only slightly speed up
        // the process Since it will only need to search through one array before
        // either failing or succeeding
        if (flags.includes("-difficulty") || flags.includes("-d")) {
            let difficulty = args.find((x) => x.flag == "-difficulty" || x.flag == "-d").arg;
            if (!difficulties.includes(difficulty.toLowerCase()))
                return message.channel.send("Incorrect difficulty provided.");
            let x = maps.find((x) => x.difficulty.toLowerCase() == difficulty.toLowerCase());
            map = x.maps.find((y) => y.name.toLowerCase() == mapName.toLowerCase());
            didYouMean.push(...maps
                .find((x) => x.difficulty.toLowerCase() == difficulty.toLowerCase())
                .maps.filter((x) => x.name.toLowerCase().startsWith(mapName.toLowerCase()))
                .map((x) => x.name));
        }
        else {
            for (let i = 0; i < maps.length; i++) {
                let x = maps[i].maps.find((x) => x.name.toLowerCase() == mapName.toLowerCase());
                if (x) {
                    map = x;
                    break;
                }
                didYouMean.push(...maps[i].maps
                    .filter((x) => x.name.toLowerCase().startsWith(mapName.toLowerCase()))
                    .map((x) => x.name));
            }
        }
        if (!map)
            return message.channel.send({
                content: `I could not find that map, are you sure you spelt it correctly. ${didYouMean.length ? `\n\nDid You Mean:\n${didYouMean.join("\n")}` : ""}`,
            });
        let embed = new discord_js_1.EmbedBuilder();
        embed.setTitle(`${playerName}'s Stats'`);
        embed.setColor("#32167a");
        embed.addFields([
            {
                name: "Map",
                value: `${map.difficulty} - ${map.name}`,
            },
            {
                name: "Finished",
                value: "" + map.finished,
                inline: true,
            },
            {
                name: "Points",
                value: "" + map.points,
                inline: true,
            },
        ]);
        if (map.finished) {
            embed.addFields([
                {
                    name: "First Finish",
                    value: `<t:${map.firstFinish.getTime() / 1000}:R>`,
                    inline: true,
                },
                { name: "Best Time", value: map.time, inline: true },
                {
                    name: "Rank | Team Rank",
                    value: `${map.rank} | ${map.teamRank}`,
                    inline: true,
                },
                {
                    name: "Finishes",
                    value: "" + map.finishes,
                    inline: true,
                },
            ]);
        }
        return message.channel.send({ embeds: [embed] });
    }
    else if (flags.includes("-difficulty") || flags.includes("-d")) {
        let difficulty = args
            .find((x) => x.flag == "-difficulty" || x.flag == "-d")
            .arg.split(" ");
        if (difficulty.some((x) => !difficulties.includes(x)))
            return message.channel.send("Invalid Difficulty Provided.");
        let x = maps.filter((x) => difficulty.includes(x.difficulty.toLowerCase()));
        let embed = new discord_js_1.EmbedBuilder();
        embed.setTitle(`${playerName}'s Stats`);
        x.forEach((y) => {
            embed.addFields([
                {
                    name: `${y.difficulty} Maps`,
                    value: `**Completed Maps:** ${y.completedMaps} / ${y.totalMaps}\n**Points:** ${y.points} / ${y.totalPoints}`,
                    inline: true,
                },
            ]);
        });
        embed.setColor("#32167a");
        return message.channel.send({ embeds: [embed] });
    }
    //No extra flags provided, show default stats
    let embed = new discord_js_1.EmbedBuilder();
    embed.setTitle(`${playerName}'s Stats`);
    embed.addFields([
        {
            name: "Total Points",
            value: `${data.points}/${data.totalPoints}`,
            inline: true,
        },
        {
            name: "Completed Maps",
            value: `${data.completedMaps} / ${data.totalMaps}`,
            inline: true,
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: true,
        },
        {
            name: "Novice Maps",
            value: `**Completed Maps:** ${novice.completedMaps} / ${novice.totalMaps}\n**Points:** ${novice.points} / ${novice.totalPoints}`,
            inline: true,
        },
        {
            name: "Moderate Maps",
            value: `**Completed Maps:** ${moderate.completedMaps} / ${moderate.totalMaps}\n**Points:** ${moderate.points} / ${moderate.totalPoints}`,
            inline: true,
        },
        {
            name: "Brutal Maps",
            value: `**Completed Maps:** ${brutal.completedMaps} / ${brutal.totalMaps}\n**Points:** ${brutal.points} / ${brutal.totalPoints}`,
            inline: true,
        },
        {
            name: "Insane Maps",
            value: `**Completed Maps:** ${insane.completedMaps} / ${insane.totalMaps}\n**Points:** ${insane.points} / ${insane.totalPoints}`,
            inline: true,
        },
        {
            name: "Dummy Maps",
            value: `**Completed Maps:** ${dummy.completedMaps} / ${dummy.totalMaps}\n**Points:** ${dummy.points} / ${dummy.totalPoints}`,
            inline: true,
        },
        {
            name: "DDmaX Maps",
            value: `**Completed Maps:** ${ddmax.completedMaps} / ${ddmax.totalMaps}\n**Points:** ${ddmax.points} / ${ddmax.totalPoints}`,
            inline: true,
        },
        {
            name: "Oldschool Maps",
            value: `**Completed Maps:** ${oldschool.completedMaps} / ${oldschool.totalMaps}\n**Points:** ${oldschool.points} / ${oldschool.totalPoints}`,
            inline: true,
        },
        {
            name: "Solo Maps",
            value: `**Completed Maps:** ${solo.completedMaps} / ${solo.totalMaps}\n**Points:** ${solo.points} / ${solo.totalPoints}`,
            inline: true,
        },
        {
            name: "Race Maps",
            value: `**Completed Maps:** ${race.completedMaps} / ${race.totalMaps}\n**Points:** ${race.points} / ${race.totalPoints}`,
            inline: true,
        },
        {
            name: "Fun Maps",
            value: `**Completed Maps:** ${fun.completedMaps} / ${fun.totalMaps}\n**Points:** ${fun.points} / ${fun.totalPoints}`,
            inline: true,
        },
    ]);
    embed.setColor("#32167a");
    message.channel.send({ embeds: [embed] });
};
exports.stats = stats;
