"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebScraper = void 0;
const axios_1 = require("axios");
const cheerio_1 = require("cheerio");
class WebScraper {
    constructor() {
        this.playerBaseUrl = "https://ddnet.tw/players/";
        this.mapBaseUrl = "https://ddnet.tw/maps/";
    }
    async getMapPage(mapName) {
        mapName = mapName.split(" ").join("-32-");
        let { data } = await axios_1.default.get(this.mapBaseUrl + mapName);
        return data;
    }
    async getMapStats(mapName) {
        const mapData = cheerio_1.default.load(await this.getMapPage(mapName));
        let mapType = mapData("div#global > h2 > a").text().split(" ")[0];
        let info = mapData("div#global > div.info");
        let teamRecords = mapData("div#global > div.teamrecords > table > tbody");
        let records = mapData("div#global > div.records > table > tbody");
        let finishes = mapData("div#global > div.finishes > table > tbody");
        let infoArr = [];
        let teamRecordsArr = [];
        let recordsArr = [];
        let finishesArr = [];
        teamRecords
            .children()
            .toArray()
            .forEach((child) => {
            let loaded = cheerio_1.default.load(child);
            let rank = parseInt(loaded("td.rank").text());
            let time = loaded("td.time").text();
            let player = loaded("td > a").parent().text();
            teamRecordsArr.push({ rank, time, player });
        });
        records
            .children()
            .toArray()
            .forEach((child) => {
            let loaded = cheerio_1.default.load(child);
            let rank = parseInt(loaded("td.rank").text());
            let time = loaded("td.time").text();
            let player = loaded("td > a").parent().text();
            recordsArr.push({ rank, time, player });
        });
        finishes
            .children()
            .toArray()
            .forEach((child) => {
            let loaded = cheerio_1.default.load(child);
            let rank = parseInt(loaded("td.rank").text());
            let finishes = parseInt(loaded("td.time").text());
            let player = loaded("td > a").text();
            finishesArr.push({ rank, finishes, player });
        });
        info.children()[0].children.forEach((child) => {
            if (child["type"] && child["type"] == "text") {
                infoArr.push(child.data);
            }
            else if (child?.firstChild &&
                child.firstChild["type"] == "text")
                infoArr.push(child.firstChild.data);
        });
        infoArr = infoArr.filter((x) => x.trim() != "");
        //Not all maps have "Released" date in their info blocks (maybe just oldschool servers),
        //So this is used to decide what indexes should be used to get information from the array.
        let p = infoArr[0].includes("Released") ? 1 : 0;
        let mapInfo = {
            difficulty: mapType,
            stars: infoArr[0 + p].split(",")[0].split(" ")[1],
            points: parseInt(infoArr[0 + p].split(",")[1].split(" ")[2]),
            finishes: parseInt(infoArr[1 + p].split(" ")[0]),
            teamFinishes: parseInt(infoArr[2 + p].split(" ")[0]),
            biggestTeam: parseInt(infoArr[2 + p].split(" ")[5]),
            medianTime: infoArr[1 + p].split(" ")[5].replaceAll(")", ""),
        };
        return {
            info: mapInfo,
            timeRanks: recordsArr,
            teamRanks: teamRecordsArr,
            finishRanks: finishesArr,
        };
    }
    async getPlayerPage(playerName) {
        playerName = playerName.split(" ").join("-32-");
        let { data } = await axios_1.default.get(this.playerBaseUrl + playerName);
        return data;
    }
    parseMaps(mapData, mapDifficulty) {
        let data = cheerio_1.default.load(mapData.html());
        let x = data("h3").toArray();
        let mapsTable = data("div > table > tbody").children();
        let completeMapDataArray = [];
        let points = 0;
        mapsTable.toArray().forEach((child) => {
            let $ = cheerio_1.default.load(child);
            let mapData = [];
            // $("tr").text() could be possible, but no way to split name / points etc..
            // example output from this ^: Chinatown27402 (name /points etc.. all clumped into one word)
            $("tr")
                .children()
                .toArray()
                .forEach((inner) => {
                if (inner.firstChild)
                    mapData.push(cheerio_1.default.load(inner.firstChild).text());
            });
            //  console.log($("tr").text());
            // console.log(mapData);
            // Uncompleted maps have less data, ie: finish time
            if (mapData.length == 3) {
                let mapObject = {
                    name: mapData[0],
                    finished: false,
                    points: parseInt(mapData[1]),
                    difficulty: mapDifficulty,
                };
                completeMapDataArray.push(mapObject);
            }
            else {
                let mapObject = {
                    name: mapData[0],
                    difficulty: mapDifficulty,
                    points: parseInt(mapData[1]),
                    finished: true,
                };
                // No team rank provided for the map
                if (mapData.length == 6) {
                    mapObject.teamRank = -1;
                    mapObject.rank = parseInt(mapData[2]);
                    mapObject.time = mapData[3];
                    mapObject.finishes = parseInt(mapData[4]);
                    mapObject.firstFinish = new Date(mapData[5].split(",").join(""));
                }
                else {
                    mapObject.teamRank = parseInt(mapData[2]);
                    mapObject.rank = parseInt(mapData[3]);
                    mapObject.time = mapData[4];
                    mapObject.finishes = parseInt(mapData[5]);
                    mapObject.firstFinish = new Date(mapData[6].split(",").join(""));
                }
                points += parseInt(mapData[1]);
                completeMapDataArray.push(mapObject);
            }
        });
        let cm = x[0].children[0]?.data;
        let completedMapCount = parseInt(cm.split("/")[0].slice(1));
        let totalMapCount = parseInt(cm.split("/")[1].split(" ")[0]);
        let totalPoints = parseInt(x[1].children[0]?.data.split("(")[1].split(" ")[0]);
        return {
            difficulty: mapDifficulty,
            points: points,
            totalPoints: totalPoints,
            totalMaps: totalMapCount,
            completedMaps: completedMapCount,
            maps: completeMapDataArray,
        };
    }
    async getNoviceMaps(playerName, data = null) {
        let $ = cheerio_1.default.load(data ?? (await this.getPlayerPage(playerName)));
        let parsed = this.parseMaps($("div#Novice"), "Novice");
        return parsed;
    }
    async getModerateMaps(playerName, data = null) {
        let $ = cheerio_1.default.load(data ?? (await this.getPlayerPage(playerName)));
        let parsed = this.parseMaps($("div#Moderate"), "Moderate");
        return parsed;
    }
    async getBrutalMaps(playerName, data = null) {
        let $ = cheerio_1.default.load(data ?? (await this.getPlayerPage(playerName)));
        let parsed = this.parseMaps($("div#Brutal"), "Brutal");
        return parsed;
    }
    async getInsaneMaps(playerName, data = null) {
        let $ = cheerio_1.default.load(data ?? (await this.getPlayerPage(playerName)));
        let parsed = this.parseMaps($("div#Insane"), "Insane");
        return parsed;
    }
    async getDummyMaps(playerName, data = null) {
        let $ = cheerio_1.default.load(data ?? (await this.getPlayerPage(playerName)));
        let parsed = this.parseMaps($("div#Dummy"), "Dummy");
        return parsed;
    }
    async getDDmaXMaps(playerName, data = null) {
        let $ = cheerio_1.default.load(data ?? (await this.getPlayerPage(playerName)));
        let parsed = this.parseMaps($("div#DDmaX"), "DDmaX");
        return parsed;
    }
    async getOldschoolMaps(playerName, data = null) {
        let $ = cheerio_1.default.load(data ?? (await this.getPlayerPage(playerName)));
        let parsed = this.parseMaps($("div#Oldschool"), "Oldschool");
        return parsed;
    }
    async getSoloMaps(playerName, data = null) {
        let $ = cheerio_1.default.load(data ?? (await this.getPlayerPage(playerName)));
        let parsed = this.parseMaps($("div#Solo"), "Solo");
        return parsed;
    }
    async getRaceMaps(playerName, data = null) {
        let $ = cheerio_1.default.load(data ?? (await this.getPlayerPage(playerName)));
        let parsed = this.parseMaps($("div#Race"), "Race");
        return parsed;
    }
    async getFunMaps(playerName, data = null) {
        let $ = cheerio_1.default.load(data ?? (await this.getPlayerPage(playerName)));
        let parsed = this.parseMaps($("div#Brutal"), "Fun");
        return parsed;
    }
    async getPlayerStats(playerName) {
        let data = await this.getPlayerPage(playerName);
        let mapData = [
            await this.getNoviceMaps(playerName, data),
            await this.getModerateMaps(playerName, data),
            await this.getInsaneMaps(playerName, data),
            await this.getBrutalMaps(playerName, data),
            await this.getDummyMaps(playerName, data),
            await this.getDDmaXMaps(playerName, data),
            await this.getOldschoolMaps(playerName, data),
            await this.getSoloMaps(playerName, data),
            await this.getRaceMaps(playerName, data),
            await this.getFunMaps(playerName, data),
        ];
        let totalCompleted = mapData.reduce((p, c) => p + c.completedMaps, 0);
        let totalMaps = mapData.reduce((p, c) => p + c.totalMaps, 0);
        let points = mapData.reduce((p, c) => p + c.points, 0);
        let totalPoints = mapData.reduce((p, c) => p + c.totalPoints, 0);
        return {
            mapData: mapData,
            completedMaps: totalCompleted,
            totalMaps: totalMaps,
            points: points,
            totalPoints: totalPoints,
        };
    }
    async getLatestFavouriteHtml(playerName) {
        let data = await this.getPlayerPage(playerName);
        let $ = cheerio_1.default.load(data);
        let x = [...$("div#global").children()].filter((x) => x.attribs.class == "block6 ladder");
        return cheerio_1.default.load(x);
    }
    async getLatestFinishes(playerName) {
        let data = await this.getLatestFavouriteHtml(playerName);
        let divs = data("div").toArray();
        let table = cheerio_1.default.load(divs[0])("table > tbody").children().toArray();
        let scraped = [];
        table.forEach((child) => {
            let x = cheerio_1.default.load(child);
            let finishInfoString = x("td")
                .children()
                .toArray()
                .map((inner) => {
                if (inner.firstChild)
                    return (inner.firstChild?.data + " " + inner.next?.data);
            })
                .join(" ");
            let finishInfo = finishInfoString
                .trim()
                .split(" ")
                .filter((x) => x != ":" && x != "");
            let date = new Date(finishInfo[0] + " " + finishInfo[1]);
            let mapName = finishInfo.slice(3, finishInfo.length).join(" ");
            let finishInfoObj = {
                date: date,
                mapType: finishInfo[2],
                mapName: mapName,
            };
            scraped.push(finishInfoObj);
        });
        return scraped;
    }
    async getFavouritePartners(playerName) {
        let data = await this.getLatestFavouriteHtml(playerName);
        let divs = data("div").toArray();
        let table = cheerio_1.default.load(divs[1])("table > tbody").children().toArray();
        let scraped = [];
        table.forEach((child) => {
            let x = cheerio_1.default.load(child);
            let favouritePartnersString = x("td")
                .children()
                .toArray()
                .map((inner) => {
                if (inner.firstChild)
                    return (inner.firstChild?.data + " " + inner.next?.data);
            })
                .join("");
            scraped.push({
                name: favouritePartnersString.split(":")[0].trim(),
                finishes: parseInt(favouritePartnersString.split(":")[1]),
            });
        });
        return scraped;
    }
}
exports.WebScraper = WebScraper;
