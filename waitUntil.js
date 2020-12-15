const minimist = require("minimist");
const opts = minimist(process.argv.slice(2));
const axios = require("axios");

if (!opts.url || !opts.text) throw new Error("missing arguments");

const delay = (ms = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(1000, ms));
  });
};

async function waitUntil() {
  let done = false;

  while (!done) {
    let response = await axios.get(opts.url).then(function (response) {
      // handle success
      return response.data;
    });
    console.log("response", response);
    if (typeof response === "object") {
      response = JSON.stringify(response);
    }

    done = response.includes(opts.text);
    await delay();
  }
}

waitUntil()
  .then("done!")
  .catch((e) => console.error(e));
