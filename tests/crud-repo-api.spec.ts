import { test, expect } from "../src/fixtures/api-fixture";

import ReposApiHelper from "../src/helpers/repos-api-helper";

test.describe("GitHub Repository CRUD API tests", () => {
  let arr: string[] = [];
  let repoName: string = "";
  let ownerName: string = "";

  const reposHelper = new ReposApiHelper();

  test.beforeEach("Creating a new repository", async ({ apiRequest }) => {
    repoName = "test-api-repo-" + Date.now();

    const createResponse = await reposHelper.createRepo(apiRequest, repoName);

    expect(createResponse.status()).toBe(201);

    const createResponseBody = await createResponse.json();

    ownerName = createResponseBody.owner.login;

    const getRepoResponse = await reposHelper.getRepoByName(
      apiRequest,
      ownerName,
      repoName,
    );

    expect(getRepoResponse.status()).toBe(200);

    const getRepoResponseBody = await getRepoResponse.json();

    expect(getRepoResponseBody.name).toBe(repoName);
    expect(getRepoResponseBody.full_name).toBe(`${ownerName}/${repoName}`);

    const createFileResponse = await reposHelper.addFileToRepo(
      apiRequest,
      ownerName,
      repoName,
    );

    expect(createFileResponse.status()).toBe(201);

    arr.push(repoName);
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
  test("Get file from repository", async ({ apiRequest }) => {
    const response = await reposHelper.getFileFromRepo(
      apiRequest,
      ownerName,
      repoName,
    );

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.name).toBeDefined();
    expect(responseBody.type).toBe("file");
    expect(responseBody.name).toContain("tesst.txt");
  });

  test("Creater repo via POST /user/repos", async ({ apiRequest }) => {
    const newRepoName = "test-api-repo-" + Date.now();

    const response = await reposHelper.createRepo(apiRequest, newRepoName);

    arr.push(newRepoName);

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.id).toBeDefined();
    expect(responseBody.name).toBe(newRepoName);
    expect(responseBody.full_name).toContain("/" + newRepoName);
    expect(responseBody.private).toBe(false);
  });

  test("Get non-existing repository", async ({ apiRequest }) => {
    const fakeRepoName = "fake-repo-" + Date.now();

    const response = await reposHelper.getRepoByName(
      apiRequest,
      ownerName,
      fakeRepoName,
    );

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.message).toBe("Not Found");
  });

  test(`Adding a new file to a repository via PUT /repos/${ownerName}/${repoName}/contents/tesst.txt`, async ({
    apiRequest,
  }) => {
    const response = await reposHelper.addFileToRepo(
      apiRequest,
      ownerName,
      repoName,
    );

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.content.name).toContain("tesst.txt");
  });

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

    arr.push(newRepoName);

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

  test.afterAll("Clean-up", async ({ apiRequest }) => {
    for (const name of arr) {
      await reposHelper.deleteRepo(apiRequest, ownerName, name);
    }
  });
});
