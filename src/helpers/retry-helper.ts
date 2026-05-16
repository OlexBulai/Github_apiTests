import { APIResponse, expect } from "@playwright/test";
import ReposApiHelper from "./repos-api-helper";

const reposHelper = new ReposApiHelper();

export default class RetryHelper {
  static async updateRepoNameWithRetry(
    apiRequest: any,
    ownerName: string,
    repoName: string,
    newRepoName: string,
  ) {
    let repoResponse;
    for (let attempt = 1; attempt <= 10; attempt++) {
      repoResponse = await reposHelper.updateRepoName(
        apiRequest,
        ownerName,
        repoName,
        newRepoName,
      );
      if (repoResponse.status() === 200) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return repoResponse;
  }
  static async waitUntilStatus(
    repoResponse: APIResponse,
    expectedStatus: number = 200,
    maxAttempts: number = 10,
    delay: number = 250,
  ) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = repoResponse;
      if (repoResponse.status() === expectedStatus) {
        expect(response.status()).toBe(expectedStatus);
        return response.json();
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  static async deleteRepoWithRetry(
    apiRequest: any,
    ownerName: string,
    repoName: string,
  ) {
    let repoResponse;
    for (let attempt = 1; attempt <= 10; attempt++) {
      repoResponse = await reposHelper.deleteRepo(
        apiRequest,
        ownerName,
        repoName,
      );
      if (repoResponse.status() === 204) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return repoResponse;
  }
}
