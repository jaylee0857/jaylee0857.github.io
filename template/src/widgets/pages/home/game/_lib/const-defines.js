import chess from "@/assets/images/game/api_placeholder_boardgame.png";
import chess_rec from "@/assets/images/game/api_placeholder_boardgame_single.png";
import live from "@/assets/images/game/api_placeholder_casino.png";
import live_rec from "@/assets/images/game/api_placeholder_casino_single.png";
import esport from "@/assets/images/game/api_placeholder_esport.png";
import esport_rec from "@/assets/images/game/api_placeholder_esport_single.png";
import lottery from "@/assets/images/game/api_placeholder_lottery.png";
import lottery_rec from "@/assets/images/game/api_placeholder_lottery_single.png";
import electronic from "@/assets/images/game/api_placeholder_slot.png";
import electronic_rec from "@/assets/images/game/api_placeholder_slot_single.png";
import fish from "@/assets/images/game/api_placeholder_fishing.png";
import fish_rec from "@/assets/images/game/api_placeholder_fishing_single.png";
import sport from "@/assets/images/game/api_placeholder_sport.png";
import sport_rec from "@/assets/images/game/api_placeholder_sport_single.png";

import { map, keys } from "ramda";

const CATEGORY = {
  LIVE: "live",
  SPORT: "sport",
  CHESS: "chess",
  ESPORT: "esport",
  LOTTERY: "lottery",
  ELECTRONIC: "electronic",
  FISH: "fish",
};

const CATEGORY_ICON = {
  LIVE: "realMan",
  SPORT: "football",
  CHESS: "cards",
  ESPORT: "gaming",
  LOTTERY: "lottery",
  ELECTRONIC: "electronic",
  FISH: "fishing",
};

export const categories = map(
  (key) => ({
    id: CATEGORY[key],
    icon: CATEGORY_ICON[key],
  }),
  keys(CATEGORY)
);
// map第一個參數為return的function，第二個為傳入的obj or array 下方為範例 keys將物件中的key抓出來
// const double = x => x * 2;
// R.map(double, [1, 2, 3]); //=> [2, 4, 6]
// R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}

export const defaultImages = [
  {
    [CATEGORY.LIVE]: live_rec,
    [CATEGORY.SPORT]: sport_rec,
    [CATEGORY.CHESS]: chess_rec,
    [CATEGORY.ESPORT]: esport_rec,
    [CATEGORY.LOTTERY]: lottery_rec,
    [CATEGORY.ELECTRONIC]: electronic_rec,
    [CATEGORY.FISH]: fish_rec,
  },
  {
    [CATEGORY.LIVE]: live,
    [CATEGORY.SPORT]: sport,
    [CATEGORY.CHESS]: chess,
    [CATEGORY.ESPORT]: esport,
    [CATEGORY.LOTTERY]: lottery,
    [CATEGORY.ELECTRONIC]: electronic,
    [CATEGORY.FISH]: fish,
  },
];
