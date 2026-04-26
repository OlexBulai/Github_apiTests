import { test as base, request } from "@playwright/test";
import { test, expect } from "@playwright/test";

test("Create repo", async ({ request }) => {
  const endpoint = "https://api.github.com/repos/OlexBulai/test-api-repo";
  const response = await request.delete(endpoint, {
    headers: {
      Authorization: process.env.TOKEN!,
    },
  });
  expect(response.status()).toBe(404);
});
