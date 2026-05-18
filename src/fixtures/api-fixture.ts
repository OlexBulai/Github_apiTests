import {
  APIRequestContext,
  test as baseTest,
  expect,
  request,
} from "@playwright/test";
import HeadersApiHelper from "../helpers/header-api-helper";

type ApiFixtures = {
  apiRequest: APIRequestContext;
};
export const test = baseTest.extend<ApiFixtures>({
  apiRequest: async ({}, use) => {
    const apiRequest = await request.newContext({
      baseURL: "https://api.github.com",
      extraHTTPHeaders: HeadersApiHelper.getHeaders(),
    });
    await use(apiRequest);
    await apiRequest.dispose();
  },
});

export { expect } from "@playwright/test";
