import { test as base, request } from "@playwright/test";
import { test, expect } from "@playwright/test";

test("Create repo", async ({ request }) => {
  const endpoint = "https://api.github.com/repos/OlexBulai/updated-api-repo123";
  const response = await request.patch(endpoint, {
    headers: {
      Authorization: process.env.TOKEN!,
    },
    data: {
      name: "updated-api-repo123",
      description: "Repository renamed from Postman",
    },
  });
  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.id).toBeDefined();
  expect(responseBody.name).toBe("updated-api-repo123");
  expect(responseBody.full_name).toContain("updated-api-repo123");
  expect(responseBody.private).toBe(false);
});
