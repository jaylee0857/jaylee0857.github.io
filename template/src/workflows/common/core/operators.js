const _toOperator = (id, creator) => {
  return {
    id,
    creator,
  };
};

export const withPayload = () => {
  return _toOperator("withPayload", (passport) => {
    let _payloads = [];
    passport.on("payload", (payload) => {
      _payloads = [..._payloads, payload];
    });

    return (previous) => {
      return previous(_payloads.shift());
    };
  });
};
