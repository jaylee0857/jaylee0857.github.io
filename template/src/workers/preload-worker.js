let cache = {};

onmessage = (payload) => {
  const { base = "", files } = payload.data;
  for (let filePath of files) {
    if (filePath in cache) continue;

    let url = base;
    if (base.endsWith("/")) {
      url = url.slice(1, url.length);
    }

    if (filePath.startsWith(".")) {
      url += filePath.slice(1, filePath.length);
    } else {
      url += filePath;
    }

    url += `?v=${Date.now()}`;
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        cache[filePath] = true;
        self.postMessage("success");
      } else {
        /** 載入失敗 */
        self.postMessage("failed");
      }
    };
    request.send();
  }
};
