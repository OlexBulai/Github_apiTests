import { test, expect } from "../src/fixtures/api-fixture";

import ReposApiHelper from "..//src/helpers/repos-api-helper";
import ReposContentApiHelper from "..//src/helpers/repos-content-api-helper";

test.describe("GitHub Repository CRUD API tests", () => {
  let repoName: string = "";
  let ownerName: string = "";

  const reposHelper = new ReposApiHelper();
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
      expect(repo.id).toBeDefined();
      expect(repo.name).toBeDefined();
      expect(repo.full_name).toContain("/");
      expect(repo.private).toBeDefined();
    }
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

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = await reposHelper.updateRepoName(
      apiRequest,
      ownerName,
      repoName,
      newRepoName,
    );

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

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
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await reposHelper.deleteRepo(apiRequest, ownerName, repoName);
    }
  });
});
