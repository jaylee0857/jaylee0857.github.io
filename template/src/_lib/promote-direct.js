const domainCodeMapping = {
  br588vip: 111,
  br688vip: 112,
  vietvippro: 113,
  vietvipro: 113,
  vietvip: 113,
  vietvip888: 114,
  vietvip666: 115,
  vietvip365: 118,
};

export const getPromoteCode = () => {
  let url = new URL(window.location.href);

  /** 有 code 拿 code */
  let code = url.searchParams.get("code");
  if (code) {
    if (code.indexOf("/") !== 1) {
      code = code.split("/")[0];
    }
    if (code.indexOf("#") !== 1) {
      code = code.split("#")[0];
    }
    return code;
  }

  /** 沒 code 用 domain 判斷 */
  let domain = "";
  if (url.host.startsWith("www") || url.host.startsWith("vh5")) {
    [, domain] = url.host.split(".");
  } else {
    [domain] = url.host.split(".");
  }
  return domainCodeMapping[domain];
};
