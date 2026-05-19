import {
  APIRequestContext,
  test as baseTest,
  expect as baseExpect,
  request,
} from "@playwright/test";
import { z, ZodSchema } from "zod";
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

export const expect = baseExpect.extend({
  toMatchSchema(received: unknown, schema: ZodSchema) {
    const result = schema.safeParse(received);

    if (result.success) {
      return {
        pass: true,
        message: () => "Expected response not to match schema",
      };
    }

    return {
      pass: false,
      message: () => {
        const errors = result.error.issues
          .map((issue) => {
            const path = issue.path.length > 0 ? issue.path.join(".") : "root";

            return `${path}: ${issue.message}`;
          })
          .join("\n");

        return `Response does not match schema:\n\n${errors}`;
      },
    };
  },
});
