const { sleep } = require("./utils");
const axios = require("axios");

const {
  GL_TOKEN,
  CI_SERVER_URL,
  CI_PROJECT_ID,
  CI_JOB_TOKEN,
  CI_COMMIT_REF_NAME,
  GITLAB_USER_ID,
  GITLAB_PRIVATE_TOKEN,
} = process.env;

async function index(opts) {
  if (!opts.targetBranch) {
    throw new Error("missing arguments");
  }
  // https://gitlab.inlabs.app/
  // $CI_SERVER_URL/projects/$CI_PROJECT_ID/merge_requests
  const url = `${CI_SERVER_URL}/api/v4/projects/${CI_PROJECT_ID}/merge_requests`;
  const data = {
    id: CI_PROJECT_ID,
    source_branch: CI_COMMIT_REF_NAME,
    target_branch: opts.targetBranch,
    remove_source_branch: !!opts.removeSourceBranch,
    title: `${CI_COMMIT_REF_NAME}`,
    assignee_id: GITLAB_USER_ID,
  };
  const mrs = await axios({
    method: "get",
    url,
    headers: {
      "PRIVATE-TOKEN": "1aTXFY9yrzo1WVi7Uhgu",
      // "PRIVATE-TOKEN": "-yqbgdHm8-YeMTxQQTNL",
    },
  }).then((res) => res.data);

  let alreadyExistsMergeRequest = false;
  if (mrs.length) {
    const hasTargetAndSourceOpenedMR = mrs.find((mr) => {
      return (
        mr.state === "opened" &&
        mr.title === data.title &&
        mr.target_branch === data.target_branch &&
        mr.source_branch === data.source_branch
      );
    });
    alreadyExistsMergeRequest = !!hasTargetAndSourceOpenedMR;
  }

  console.log("url", url);
  console.log("data", data);

  if (!alreadyExistsMergeRequest) {
    const result = await axios({
      method: "post",
      url,
      data,
      headers: {
        "PRIVATE-TOKEN": GL_TOKEN,
      },
    });
    console.log("result", result);
  }
}

module.exports = index;
