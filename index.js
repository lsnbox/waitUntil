#!/usr/bin/env node

const minimist = require("minimist");
const opts = minimist(process.argv.slice(2));
const gitlabMergeRequest = require("./gitlabMergeRequest");
const watch_http_until_match = require("./watchHttpUntilMatch");
const commands = ["watch_http_until_match", "gitlab_merge_request"];

if (opts.debug) console.log("opts", opts);
if (!opts._.length || !commands.includes(opts._[0])) {
  console.error("missing command");
  process.exit(-1);
}

const [command] = opts._;

let commandFunc;
switch (command) {
  case "watch_http_until_match":
    commandFunc = watch_http_until_match;
  case "gitlab_merge_request":
    commandFunc = gitlabMergeRequest;
}

commandFunc(opts)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e.message);
    process.exit(-1);
  });
