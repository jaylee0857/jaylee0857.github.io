const response = {
  install: (register) => {
    register.response.use(async function (response) {
      return response.data;
    });
  },
};

export default response;
