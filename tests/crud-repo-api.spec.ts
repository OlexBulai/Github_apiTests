import { test as base, request } from "@playwright/test";
import { test, expect } from "@playwright/test";

test.describe("All crud", () => {
  let arr: string[] = [];
  let repoName: string = "";
  test.beforeEach("Creating a new repository", async ({ request }) => {
    const endpoint = "https://api.github.com/user/repos";
    repoName = "test-api-repo-" + Date.now();
    await request.post(endpoint, {
      headers: {
        Authorization: process.env.TOKEN!,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },

      data: {
        name: repoName,
        description: "Repository created from Playwright",
        private: false,
        auto_init: true,
      },
    });
    console.log("TOKEN:", process.env.TOKEN);
    arr.push(repoName);
  });

  test("Get all repos from corent user", async ({ request }) => {
    const endpoint = "https://api.github.com/user/repos";
    const response = await request.get(endpoint, {
      headers: {
        Authorization: process.env.TOKEN!,
        Accept: "application/vnd.github+json",
      },
    });

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
    const endpoint = "https://api.github.com/user/repos";
    const newRepoName = "test-api-repo-" + Date.now();
    const response = await request.post(endpoint, {
      headers: {
        Authorization: process.env.TOKEN!,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },

      data: {
        name: newRepoName,
        description: "Repository created from Playwright",
        private: false,
        auto_init: true,
      },
    });
    arr.push(newRepoName);

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.id).toBeDefined();
    expect(responseBody.name).toContain("test-api-repo");
    expect(responseBody.full_name).toContain("/");
    expect(responseBody.private).toBe(false);
  });

  test("Adding a new file to a repository via PUT /repos/OlexBulai/test-api-repo/contents/tesst.txt", async ({
    request,
  }) => {
    const endpoint = `https://api.github.com/repos/OlexBulai/${repoName}/contents/tesst.txt`;
    const response = await request.put(endpoint, {
      headers: {
        Authorization: process.env.TOKEN!,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
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

  test("Changing a repository name via PATCH /repos/OlexBulai/updated-api-repo123", async ({
    request,
  }) => {
    const newRepoName = "updated-api-repo-" + Date.now();
    const endpoint = `https://api.github.com/repos/OlexBulai/${repoName}`;
    const response = await request.patch(endpoint, {
      headers: {
        Authorization: process.env.TOKEN!,
      },
      data: {
        name: newRepoName,
        description: "Repository renamed from Postman",
      },
    });
    arr.push(newRepoName);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.id).toBeDefined();
    expect(responseBody.name).toBe(newRepoName);
    expect(responseBody.full_name).toContain(newRepoName);
    expect(responseBody.private).toBe(false);
  });

  test("Deleting a repository via DELETE /repos/OlexBulai/${repoName}", async ({
    request,
  }) => {
    const endpoint = `https://api.github.com/repos/OlexBulai/${repoName}`;
    const response = await request.delete(endpoint, {
      headers: {
        Authorization: process.env.TOKEN!,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
    });
    console.log("DELETE STATUS:", response.status());
    console.log("DELETE BODY:", await response.text());

    expect(response.status()).toBe(204);
  });
  test.afterAll("Clean-up", async ({ request }) => {
    for (const name of arr) {
      const endpoint = `https://api.github.com/repos/OlexBulai/${name}`;
      await request.delete(endpoint, {
        headers: {
          Authorization: process.env.TOKEN!,
        },
      });
    }
  });
});
