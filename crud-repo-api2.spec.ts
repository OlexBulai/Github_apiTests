import { test as base, request } from "@playwright/test";
import { test, expect } from "@playwright/test";

test("Get all repos from corent post", async ({ request }) => {
  const endpoint = "https://api.github.com/user/repos";
});
