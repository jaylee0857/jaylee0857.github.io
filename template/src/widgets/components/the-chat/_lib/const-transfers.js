import { MESSAGE_TYPE, MESSAGE_SOURCE } from "./const-defines";

export const toBackEndType = (payload) => {
  const convert = {
    [MESSAGE_TYPE.LIST]: 4,
    [MESSAGE_TYPE.TEXT]: 1,
    [MESSAGE_TYPE.IMAGE]: 2,
    [MESSAGE_TYPE.MEDIA]: 3,
  }[payload];
  if (!convert) throw "toBackEndType: 轉換的類型不正確:" + payload;
  return convert;
};
export const toBackEndSource = (payload) => {
  const convert = {
    [MESSAGE_SOURCE.BOT]: "cs",
    [MESSAGE_SOURCE.USER]: "user",
  }[payload];
  if (!convert) throw "toBackEndSource: 轉換的來源不正確:" + payload;
  return convert;
};
export const toFrontEndType = (payload) => {
  const convert = [
    null,
    MESSAGE_TYPE.TEXT,
    MESSAGE_TYPE.IMAGE,
    MESSAGE_TYPE.MEDIA,
    MESSAGE_TYPE.LIST,
  ][payload];
  if (!convert) throw "toFrontEndType: 轉換的類型不正確:" + payload;
  return convert;
};
export const toFrontEndSource = (payload) => {
  const convert = {
    user: MESSAGE_SOURCE.USER,
    cs: MESSAGE_SOURCE.BOT,
  }[payload];
  if (!convert) throw "toFrontEndSource: 轉換的來源不正確:" + payload;
  return convert;
};
