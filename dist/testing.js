"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebScraper_1 = require("./WebScraper/WebScraper");
const main = async () => {
    let scraper = new WebScraper_1.WebScraper();
    let x = await scraper.getMapStats("Just Fly 1");
    console.log(x);
};
main();
