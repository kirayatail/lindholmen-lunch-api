import xml2js from "xml2js";
import Restaurant from "./Restaurant.js";

const xmlParser = new xml2js.Parser();

const restaurant = Restaurant({
  title: "Uni3 World of Food",
  link: "https://www.compass-group.se/restauranger-och-menyer/ovriga-restauranger/uni3-world-of-food/",
  url: "https://www.compass-group.se/menuapi/feed/rss/current-week?costNumber=448305&language=sv",
  parser: async (data) => {
    const res = await xmlParser.parseStringPromise(data);
    return res.rss.channel
      .map((c) => c.item.map((item) => item.description[0]))
      .flat()
      .filter((c) => c !== "")
      .map((desc, index) => ({
        day: index,
        dishes: desc
          .split("<br />&nbsp;<br />")
          .map((dish) => dish.split("&nbsp;<br />")[0].replace(/<\/?p>/g, "")),
      }));
  },
});
console.time("benchmark");
const content = await restaurant.get();
console.log(content);
console.timeLog("benchmark");
const dishes = (await restaurant.get()).dishes.map((day) => day.dishes);
console.log(dishes);
console.timeEnd("benchmark");

export default restaurant;
