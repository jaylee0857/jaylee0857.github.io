onmessage = (event) => {
  const { origin, payload } = event.data;

  const request = new XMLHttpRequest();
  request.open("POST", origin, true);
  request.setRequestHeader("Accept", "application/json, text/plain, */*");
  request.onload = () => {
    if (request.status !== 200) {
      self.postMessage({
        code: -1,
      });
      self.close();
      return;
    }
    const response = JSON.parse(request.responseText);
    self.postMessage(response);
    self.close();
  };
  request.ontimeout = function () {
    self.postMessage({
      code: -1,
    });
  };

  const formData = new FormData();
  for (let key in payload) {
    formData.append(key, payload[key]);
  }
  request.send(formData);
};
