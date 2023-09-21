export const fakeBuyers = [
  {
    level: 3,
    account: "nguyenlinh24",
    phone: "0959457386",
  },
  {
    level: 3,
    account: "tuanduc89",
    phone: "0957659870",
  },
  {
    level: 3,
    account: "minhphuc007",
    phone: "0980732183",
  },
  {
    level: 3,
    account: "trungnguyen123",
    phone: "0906310324",
  },
  {
    level: 3,
    account: "linhchi2022",
    phone: "0900996099",
  },
  {
    level: 3,
    account: "thanhdat56",
    phone: "0964497593",
  },
  {
    level: 3,
    account: "phuongvy97",
    phone: "0944572248",
  },
  {
    level: 3,
    account: "khanhhuyen44",
    phone: "0980790565",
  },
  {
    level: 2,
    account: "hoanglong81",
    phone: "0992698745",
  },
  {
    level: 2,
    account: "ngocdiep2023",
    phone: "0974860930",
  },
  {
    level: 2,
    account: "tunglam68",
    phone: "0966451811",
  },
  {
    level: 2,
    account: "nguyenhuy45",
    phone: "0996949770",
  },
  {
    level: 2,
    account: "mylinh2007",
    phone: "0998540866",
  },
  {
    level: 2,
    account: "phucminh88",
    phone: "0985123158",
  },
  {
    level: 2,
    account: "thaonguyen12",
    phone: "0951284849",
  },
  {
    level: 1,
    account: "minhhai1990",
    phone: "0901812075",
  },
  {
    level: 1,
    account: "namluan76",
    phone: "0992100928",
  },
  {
    level: 1,
    account: "hongquyen99",
    phone: "0905840187",
  },
  {
    level: 1,
    account: "nhattruong63",
    phone: "0945897475",
  },
  {
    level: 1,
    account: "binhthanh87",
    phone: "0999432352",
  },
];

/**
 * getRandomIndex
 * @desc 產生隨機序列號
 * @private
 * @returns {Number} 序列號
 */
const getRandomIndex = () => {
  return Math.floor(Math.random() * fakeBuyers.length);
};

/**
 * getNotExistIndex
 * @desc 產生不存在佇列中的序列號
 * @private
 * @param {Array} queue 已存在佇列
 * @returns {Number} 序列號
 */
const getNotExistIndex = (queue) => {
  const currentIndex = getRandomIndex();
  if (queue.includes(currentIndex)) {
    return getNotExistIndex(queue);
  } else {
    return currentIndex;
  }
};

/**
 * getRandomBuyers
 * @desc 從上方列表隨機挑選買家
 * @param {Number} count 筆數
 * @returns {Array}
 */
export const getRandomBuyers = (count) => {
  const returnIndexs = [];

  for (let i = 0; i < count; i++) {
    returnIndexs.push(getNotExistIndex(returnIndexs));
  }

  return returnIndexs.map((idx) => ({
    idx,
    ...fakeBuyers[idx],
  }));
};
