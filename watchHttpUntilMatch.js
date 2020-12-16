const { sleep } = require("./utils");
const axios = require("axios");

async function index(opts) {
  if (!opts.url || !opts.text) {
    throw new Error("missing arguments");
  }

  let timeout = 600 * 1000;
  if (!isNaN(opts.timeout)) timeout = opts.timeout;

  let done = false;

  setTimeout(() => {
    process.exit(-1);
  }, timeout);

  const headers = {};
  if (opts.header) {
    if (Array.isArray(opts.header)) {
      opts.header.forEach((header) => {
        const split = header.split("=");
        headers[split[0]] = split[1];
      });
    } else {
      const split = opts.header.split("=");
      headers[split[0]] = split[1];
    }

    if (opts.debug) console.log("url", opts.url);
    if (opts.debug) console.log("text", opts.text);
    if (opts.debug) console.log("headers", headers);
  }
  while (!done) {
    let response = await axios
      .get(opts.url, {
        headers,
      })
      .then(function (response) {
        // handle success
        return response.data;
      })
      .catch((err) => {
        return err.message;
      });

    if (typeof response === "object") {
      response = JSON.stringify(response);
      if (opts.debug) console.log("matched", response);
    } else {
      if (opts.debug) console.log("fail to match", response);
    }

    done = response.includes(opts.text);
    await sleep(10000);
  }
}

module.exports = index;
