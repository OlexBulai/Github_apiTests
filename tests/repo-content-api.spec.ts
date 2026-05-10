import { test, expect } from "../src/fixtures/api-fixture";
import ReposContentApiHelper from "..//src/helpers/repos-content-api-helper";
import ReposApiHelper from "..//src/helpers/repos-api-helper";
import RetryHelper from "..//src/helpers/retry-helper";
import { faker } from "@faker-js/faker";
import { Buffer } from "buffer";

test.describe("GitHub Repository Content API tests", () => {
  let repoName: string = "";
  let ownerName: string = "";
  let fileName: string = "";

  const reposHelper = new ReposApiHelper();
  const ReposContentHelper = new ReposContentApiHelper();

  test.beforeEach("Creating a new repository", async ({ apiRequest }) => {
    repoName = "test-api-repo-" + Date.now();
    fileName = faker.string.uuid() + ".txt";

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

  test("Update file", async ({ apiRequest }) => {
    const response = await ReposContentHelper.addFileToRepo(
      apiRequest,
      ownerName,
      repoName,
      fileName,
    );
    expect(response.status()).toBe(201);

    const fileInfo = await ReposContentHelper.getFileFromRepo(
      apiRequest,
      ownerName,
      repoName,
      fileName,
    );

    expect(fileInfo.status()).toBe(200);

    const fileInfoBody = await fileInfo.json();
    const sha = fileInfoBody.sha;
    const updatedContent = faker.string.uuid();
    const base64Content = Buffer.from(updatedContent).toString("base64");

    const updateFileResponse = await ReposContentHelper.updateFileRepo(
      apiRequest,
      ownerName,
      repoName,
      fileName,
      sha,
      base64Content,
    );
    expect(updateFileResponse.status()).toBe(200);
  });

  test.afterEach("Clean-up", async ({ apiRequest }) => {
    if (ownerName && repoName) {
      await RetryHelper.deleteRepoWithRetry(apiRequest, ownerName, repoName);
    }
  });
});
