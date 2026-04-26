import { test as base, request } from "@playwright/test";
import { test, expect } from "@playwright/test";

test("Create repo", async ({ request }) => {
  const endpoint = "https://api.github.com/user/repos";

  const response = await request.post(endpoint, {
    headers: {
      Authorization: process.env.TOKEN!,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },

    data: {
      name: "test-api-repo-" + Date.now(),
      description: "Repository created from Playwright",
      private: false,
      auto_init: true,
    },
  });

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody.id).toBeDefined();
  expect(responseBody.name).toContain("test-api-repo");
  expect(responseBody.full_name).toContain("/");
  expect(responseBody.private).toBe(false);
});
