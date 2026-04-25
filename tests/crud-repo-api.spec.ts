import { test as base, request } from "@playwright/test";
import { test, expect } from "@playwright/test";

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
