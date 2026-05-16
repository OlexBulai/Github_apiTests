import { test, expect } from "../src/fixtures/api-fixture";

import ReposApiHelper from "..//src/helpers/repos-api-helper";

import RetryHelper from "..//src/helpers/retry-helper";
import PullsApiHelper from "..//src/helpers/repos-PR-helper";
import ReposContentApiHelper from "..//src/helpers/repos-content-api-helper";

test.describe("GitHub Repository CRUD API tests", () => {
  let repoName: string = "";
  let ownerName: string = "";
  let pullNumber: number;
  let fileName: string = "";

  const reposHelper = new ReposApiHelper();
  const pullHelper = new PullsApiHelper();
  const ReposContentHelper = new ReposContentApiHelper();

  test.beforeEach("Creating a new repository", async ({ apiRequest }) => {
    repoName = "test-api-repo-" + Date.now();

    const createResponse = await reposHelper.createRepo(apiRequest, repoName);

    expect(createResponse.status()).toBe(201);

    const createResponseBody = await createResponse.json();

    ownerName = createResponseBody.owner.login;
  });

  test("Get all repos from corent user", async ({ apiRequest }) => {
    const response = await reposHelper.getUserRepos(apiRequest);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    for (const repo of responseBody) {
      expect.soft(repo.id).toBeDefined();
      expect.soft(repo.name).toBeDefined();
      expect.soft(repo.full_name).toContain("/");
      expect.soft(repo.private).toBeDefined();
    }
  });

  test("Get branch", async ({ apiRequest }) => {
    const response = await reposHelper.getBranches(
      apiRequest,
      ownerName,
      repoName,
    );

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody[0].name).toBe("main");
  });

  test("Get commits", async ({ apiRequest }) => {
    const response = await reposHelper.getCommits(
      apiRequest,
      ownerName,
      repoName,
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    expect(responseBody[0].commit.message).toContain("Initial commit");
  });

  test("Get PR file", async ({ apiRequest }) => {
    const branchName = "test-branch-" + Date.now();
    const fileName = "test-file-" + Date.now() + ".txt";

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

  test("Creater repo via POST /user/repos", async ({ apiRequest }) => {
    const newRepoName = "test-api-repo-" + Date.now();

    const response = await reposHelper.createRepo(apiRequest, newRepoName);

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.id).toBeDefined();
    expect(responseBody.name).toBe(newRepoName);
    expect(responseBody.full_name).toContain("/" + newRepoName);
    expect(responseBody.private).toBe(false);

    await reposHelper.deleteRepo(apiRequest, ownerName, newRepoName);
  });

  test("Get repository by owner and repo name", async ({ apiRequest }) => {
    const getRepoResponse = await reposHelper.getRepoByName(
      apiRequest,
      ownerName,
      repoName,
    );

    expect(getRepoResponse.status()).toBe(200);

    const getRepoResponseBody = await getRepoResponse.json();

    expect(getRepoResponseBody.name).toBe(repoName);
    expect(getRepoResponseBody.full_name).toBe(`${ownerName}/${repoName}`);
  });
  // TODO: To move to the Negative tests suite
  /* test("Get non-existing repository", async ({ apiRequest }) => {
    const fakeRepoName = "fake-repo-" + Date.now();

    const response = await reposHelper.getRepoByName(
      apiRequest,
      ownerName,
      fakeRepoName,
    );

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.message).toBe("Not Found");
  }); */

  test("Changing a repository name via PATCH", async ({ apiRequest }) => {
    const newRepoName = "updated-api-repo-" + Date.now();

    const repoResponse = await reposHelper.updateRepoName(
      apiRequest,
      ownerName,
      repoName,
      newRepoName,
    );

    /* const response = await RetryHelper.updateRepoNameWithRetry(
      apiRequest,
      ownerName,
      repoName,
      newRepoName,
    ); */

    const responseBody = await RetryHelper.waitUntilStatus(repoResponse);

    repoName = newRepoName;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.name).toBe(newRepoName);
    expect(responseBody.full_name).toContain(newRepoName);
    expect(responseBody.private).toBe(false);
  });

  test(`Deleting a repository via DELETE /repos/${ownerName}/${repoName}`, async ({
    apiRequest,
  }) => {
    const response = await reposHelper.deleteRepo(
      apiRequest,
      ownerName,
      repoName,
    );

    expect(response.status()).toBe(204);
  });

  test.afterEach("Clean-up", async ({ apiRequest }) => {
    if (ownerName && repoName) {
      await RetryHelper.deleteRepoWithRetry(apiRequest, ownerName, repoName);
    }
  });
});
