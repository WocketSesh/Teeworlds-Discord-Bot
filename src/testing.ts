import { WebScraper } from "./WebScraper/WebScraper";

const main = async () => {
  let scraper = new WebScraper();
  let x = await scraper.getMapStats("Just Fly 1");
  console.log(x);
};

main();
