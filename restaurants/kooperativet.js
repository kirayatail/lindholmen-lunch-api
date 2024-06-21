import { parse } from "node-html-parser";
import Restaurant from "./Restaurant.js";

const restaurant = Restaurant({
  title: "Kooperativet",
  link: "https://www.kooperativet.se/",
  url: "https://kooperativet.se/",
  parser: async (data) => {
    const doc = parse(data);
    const res = doc
      .querySelectorAll("#monday, #tuesday, #wednesday, #thursday, #friday")
      .map((root, index) => {
        return {
          day: index,
          dishes: root
            .querySelectorAll("section p")
            .map((node) => node.childNodes.map(node => node.toString()).join(''))
            .map((dish) => {
              return dish.replace(/[\s]+/g, " ").trim().replace(/vecka \d{1,2}<br> /, '');
            }),
        };
      });
    return res;
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

// ( /<pre[\s\S]*?<\/pre>/gm );
