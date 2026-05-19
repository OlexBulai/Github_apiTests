import { test, expect } from "../src/fixtures/api-fixture";

import ReposApiHelper from "..//src/helpers/repos-api-helper";

import RetryHelper from "..//src/helpers/retry-helper";
import PullsApiHelper from "..//src/helpers/repos-PR-helper";
import ReposContentApiHelper from "..//src/helpers/repos-content-api-helper";

test.describe("Pull Request API tests", () => {
  let repoName: string = "";
  let ownerName: string = "";
  let pullNumber: number;
  let fileName: string = "";
  let branchName: string = "";

  const reposHelper = new ReposApiHelper();
  const pullHelper = new PullsApiHelper();
  const ReposContentHelper = new ReposContentApiHelper();

  test.beforeEach("Creating a new repository", async ({ apiRequest }) => {
    repoName = "test-api-repo-" + Date.now();

    branchName = "test-branch-" + Date.now();
    fileName = "test-file-" + Date.now() + ".txt";

    const createResponse = await reposHelper.createRepo(apiRequest, repoName);

    expect(createResponse.status()).toBe(201);

    const createResponseBody = await createResponse.json();

    ownerName = createResponseBody.owner.login;
    const response = await reposHelper.getBranches(
      apiRequest,
      ownerName,
      repoName,
    );

    expect(response.status()).toBe(200);

    const branchesBody = await response.json();
    const sha = branchesBody[0].commit.sha;
    const ref = `refs/heads/${branchName}`;

    expect(sha).toBeTruthy();

    const branchResponse = await reposHelper.createBranch(
      apiRequest,
      ownerName,
      repoName,
      sha,
      ref,
    );
    expect(branchResponse.status()).toBe(201);

    const putresponse = await ReposContentHelper.addFileToRepo(
      apiRequest,
      ownerName,
      repoName,
      fileName,
      undefined,
      undefined,
      branchName,
    );

    expect(putresponse.status()).toBe(201);
  });

  test("Create PR", async ({ apiRequest }) => {
    const pullsresponse = await reposHelper.pullsrequest(
      apiRequest,
      ownerName,
      repoName,
      branchName,
    );
    expect(pullsresponse.status()).toBe(201);
  });

  test("Get PR files", async ({ apiRequest }) => {
    const pullsresponse = await reposHelper.pullsrequest(
      apiRequest,
      ownerName,
      repoName,
      branchName,
    );
    expect(pullsresponse.status()).toBe(201);

    const pullBody = await pullsresponse.json();
    pullNumber = pullBody.number;

    const pullrequest = await pullHelper.getPrFile(
      apiRequest,
      ownerName,
      repoName,
      pullNumber,
    );

    expect(pullrequest.status()).toBe(200);
    const prFilesBody = await pullrequest.json();

    expect(prFilesBody[0].filename).toBe(fileName);
  });

  test("Get PR", async ({ apiRequest }) => {
    const pullsresponse = await reposHelper.pullsrequest(
      apiRequest,
      ownerName,
      repoName,
      branchName,
    );
    expect(pullsresponse.status()).toBe(201);

    const pullBody = await pullsresponse.json();
    pullNumber = pullBody.number;

    const prResponse = await pullHelper.getPr(
      apiRequest,
      ownerName,
      repoName,
      pullNumber,
    );
    expect(prResponse.status()).toBe(200);
  });

  test.afterEach("Clean-up", async ({ apiRequest }) => {
    if (ownerName && repoName) {
      await RetryHelper.deleteRepoWithRetry(apiRequest, ownerName, repoName);
    }
  });
});
