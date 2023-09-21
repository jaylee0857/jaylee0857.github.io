export const getDateForamt = (second) => {
  let day = new Date(second);
  return `${day.getFullYear()}-${addzero(day.getMonth() + 1)}-${addzero(
    day.getDate()
  )}`;
}; //給予日期標準格式 參數丟入毫秒數、日期

export const addzero = (num) => {
  return num < 10 ? "0" + num : num;
}; //個位數以下給予0

export const getInterval = (today, num) => {
  //取得日期區間
  const list = [];
  list.push(today); //先上傳當天日期
  for (let index = 0; index < num; index++) {
    let temp = getDateForamt(
      new Date(today).getTime() - (index + 1) * 86400000
    ); //依照num傳入的天數，num每跑一次就減去一天
    list.push(temp);
  }
  return list;
};
