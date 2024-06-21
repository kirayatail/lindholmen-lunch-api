
export default function Restaurant({title, link, url, parser}) {
  let dishes = [];
  let expires = 0;
  const update = async () => {
    return await fetch(url).then(res => res.text()).then(async (data) => {
      dishes = await parser(data);
      expires = Date.now() + 3600000;
      return dishes;
    });
  }

  const get = async () => {
    let localDishes = dishes;
    if (Date.now() > expires) {
      localDishes = await update();
    }
    return {
      title,
      link,
      dishes: localDishes
    }
  }
  return {
    get
  }
}