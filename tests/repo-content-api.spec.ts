import { test, expect } from "../src/fixtures/api-fixture";
import ReposContentApiHelper from "..//src/helpers/repos-content-api-helper";
import ReposApiHelper from "..//src/helpers/repos-api-helper";

test.describe("GitHub Repository Content API tests", () => {
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

  test("Get file from repository", async ({ apiRequest }) => {
    const createFileResponse = await ReposContentHelper.addFileToRepo(
      apiRequest,
      ownerName,
      repoName,
    );
    expect(createFileResponse.status()).toBe(201);

    const response = await ReposContentHelper.getFileFromRepo(
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
  test(`Adding a new file to a repository via PUT /repos/${ownerName}/${repoName}/contents/tesst.txt`, async ({
    apiRequest,
  }) => {
    const response = await ReposContentHelper.addFileToRepo(
      apiRequest,
      ownerName,
      repoName,
    );

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.content.name).toContain("tesst.txt");
  });

  test.afterEach("Clean-up", async ({ apiRequest }) => {
    if (ownerName && repoName) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await reposHelper.deleteRepo(apiRequest, ownerName, repoName);
    }
  });
});
