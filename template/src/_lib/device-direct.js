export const getVersion = () => {
  let version = navigator.userAgent.split("(");
  version = version[1].split(")")[0];
  version = version.split(";")[1];
  return version;
};

export const getModel = () => {
  let model = navigator.userAgent.split("(");
  model = model[1].split(")")[0];
  let device = model.split(";")[0];
  if (device === "iPhone") {
    model = "iPhone";
  } else {
    model = model.split(";")[2];
  }
  return model;
};

export const getPlatform = () => {
  let model = navigator.userAgent.split("(");
  model = model[1].split(")")[0];
  let device = model.split(";")[0];
  return device;
};

export const generateUuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
