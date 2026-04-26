import { test as base, request } from "@playwright/test";
import { test, expect } from "@playwright/test";

test("Create repo", async ({ request }) => {
  const endpoint =
    "https://api.github.com/repos/OlexBulai/test-api-repo/contents/tesst.txt";
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
      sha: "6b5aa93874cf915203707b65bfea12baaa1c59f3",
    },
  });
  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.content.name).toContain("tesst.txt");
});
