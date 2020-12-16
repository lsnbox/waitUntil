const sleep = (ms = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(1000, ms));
  });
};

module.exports = {
  sleep,
};
