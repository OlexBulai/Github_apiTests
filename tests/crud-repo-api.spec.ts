import { test, expect } from "@playwright/test";

import { GitHubApiHelper } from "../src/helpers/header-api-helper";

import HeadersApiHelper from "../src/helpers/header-api-helper";
import ReposApiHelper from "../src/helpers/repos-api-helper";


test.describe("GitHub Repository CRUD API tests", () => {
  let arr: string[] = [];
  let repoName: string = "";


  let ownerName: string = "";
  const reposHelper = new ReposApiHelper();


  test.beforeEach("Creating a new repository", async ({ request }) => {
    const endpoint = "https://api.github.com/user/repos";
    repoName = "test-api-repo-" + Date.now();

    await request.post(endpoint, {
      headers: GitHubApiHelper.getHeaders(),


    const response = await request.post(endpoint, {
      headers: HeadersApiHelper.getHeaders(),


      data: {
        name: repoName,
        description: "Repository created from Playwright",
        private: false,
        auto_init: true,
      },
    });

    console.log("TOKEN:", process.env.TOKEN);


    const responseBody = await response.json();
    ownerName = responseBody.owner.login;

    arr.push(repoName);
  });

  test("Get all repos from corent user", async ({ request }) => {

    const endpoint = "https://api.github.com/user/repos";
    const response = await request.get(endpoint, {
      headers: GitHubApiHelper.getHeaders(),
    });

    const response = await reposHelper.getUserRepos(request);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    for (const repo of responseBody) {
      expect(repo.id).toBeDefined();
      expect(repo.name).toBeDefined();
      expect(repo.full_name).toContain("/");
      expect(repo.private).toBeDefined();
    }
  });

  test("Creater repo via POST /user/repos", async ({ request }) => {
    const reposHelper = new ReposApiHelper();
    const newRepoName = "test-api-repo-" + Date.now();

    const response = await request.post(endpoint, {
      headers: GitHubApiHelper.getHeaders(),



    const response = await reposHelper.createRepo(request, newRepoName);
    arr.push(newRepoName);

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.id).toBeDefined();
    expect(responseBody.name).toBe(newRepoName);
    expect(responseBody.full_name).toContain("/" + newRepoName);
    expect(responseBody.private).toBe(false);
  });

  test(`Adding a new file to a repository via PUT /repos/${ownerName}/${repoName}/contents/tesst.txt`, async ({
    request,
  }) => {
    const endpoint = `https://api.github.com/repos/${ownerName}/${repoName}/contents/tesst.txt`;
    const response = await request.put(endpoint, {
      headers: GitHubApiHelper.getHeaders(),
      data: {
        message: "Update test file",
        content: "SGVsbG8gZnJvbSBQb3N0bWFuIQ==",
        branch: "main",
      },
    });
    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.content.name).toContain("tesst.txt");
  });

  test("Changing a repository name via PATCH", async ({ request }) => {
    const newRepoName = "updated-api-repo-" + Date.now();

    const endpoint = `https://api.github.com/repos/${ownerName}/${repoName}`;

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = await request.patch(endpoint, {
      headers: GitHubApiHelper.getHeaders(),
      data: {
        name: newRepoName,
        description: "Repository renamed from Playwright",
      },
    });

    const responseBody = await response.json();

    console.log("PATCH STATUS:", response.status());
    console.log("PATCH BODY:", responseBody);

    expect(response.status()).toBe(200);

    arr.push(newRepoName);

    expect(responseBody.id).toBeDefined();
    expect(responseBody.name).toBe(newRepoName);
    expect(responseBody.full_name).toContain(newRepoName);
    expect(responseBody.private).toBe(false);
  });

  test(`Deleting a repository via DELETE /repos/${ownerName}/${repoName}`, async ({
    request,
  }) => {
    const endpoint = `https://api.github.com/repos/${ownerName}/${repoName}`;
    const response = await request.delete(endpoint, {
      headers: GitHubApiHelper.getHeaders(),
    });

    expect(response.status()).toBe(204);
  });
  test.afterAll("Clean-up", async ({ request }) => {
    for (const name of arr) {
      const endpoint = `https://api.github.com/repos/${ownerName}/${name}`;
      await request.delete(endpoint, {
        headers: GitHubApiHelper.getHeaders(),
      });
    }
  });
});
