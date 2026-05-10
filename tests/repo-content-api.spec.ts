import { test, expect } from "../src/fixtures/api-fixture";
import ReposContentApiHelper from "..//src/helpers/repos-content-api-helper";
import ReposApiHelper from "..//src/helpers/repos-api-helper";
import RetryHelper from "..//src/helpers/retry-helper";
import { faker } from "@faker-js/faker";

test.describe("GitHub Repository Content API tests", () => {
  let repoName: string = "";
  let ownerName: string = "";
  let fileName = faker.string.uuid() + ".txt";

  const reposHelper = new ReposApiHelper();
  const ReposContentHelper = new ReposContentApiHelper();

  test.beforeEach("Creating a new repository", async ({ apiRequest }) => {
    repoName = "test-api-repo-" + Date.now();

    const createResponse = await reposHelper.createRepo(apiRequest, repoName);

    expect(createResponse.status()).toBe(201);

    const createResponseBody = await createResponse.json();

    ownerName = createResponseBody.owner.login;
  });

  test("Get file from repository", async ({ apiRequest }) => {
    const createFileResponse = await ReposContentHelper.addFileToRepo(
      apiRequest,
      ownerName,
      repoName,
      fileName,
    );
    expect(createFileResponse.status()).toBe(201);

    const response = await ReposContentHelper.getFileFromRepo(
      apiRequest,
      ownerName,
      repoName,
      fileName,
    );

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.name).toBeDefined();
    expect(responseBody.type).toBe("file");
    expect(responseBody.name).toBe(`${fileName}`);
  });
  test(`Adding a new file to a repository via PUT /repos/${ownerName}/${repoName}/contents/${fileName}`, async ({
    apiRequest,
  }) => {
    const response = await ReposContentHelper.addFileToRepo(
      apiRequest,
      ownerName,
      repoName,
      fileName,
    );

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.content.name).toBe(`${fileName}`);
  });

  test.afterEach("Clean-up", async ({ apiRequest }) => {
    if (ownerName && repoName) {
      await RetryHelper.deleteRepoWithRetry(apiRequest, ownerName, repoName);
    }
  });
});
