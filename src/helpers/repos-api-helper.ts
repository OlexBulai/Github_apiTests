import HeadersApiHelper from "./header-api-helper";

export default class ReposApiHelper {
  private description: string = "Repository created from Playwright";

  constructor(description: string) {
    this.description = description;
  }
  async getUserRepos(request: any) {
    const endpoint = "https://api.github.com/user/repos";

    const response = await request.get(endpoint, {
      headers: HeadersApiHelper.getHeaders(),
    });

    return response;
  }

  async createRepo(
    request: any,
    repoName: string,
    description: string = this.description,
    privacy: boolean = false,
    auto_init: boolean = true,
  ) {
    const endpoint = "https://api.github.com/user/repos";

    const response = await request.post(endpoint, {
      headers: HeadersApiHelper.getHeaders(),
      data: {
        name: repoName,
        description: description,
        private: privacy,
        auto_init: auto_init,
      },
    });

    return response;
  }

  async addFileToRepo(
    request: any,
    ownerName: string,
    repoName: string,
    message: string = "Update test file",
  ) {
    const endpoint = `https://api.github.com/repos/${ownerName}/${repoName}/contents/tesst.txt`;

    const response = await request.put(endpoint, {
      headers: HeadersApiHelper.getHeaders(),
      data: {
        message: message,
        content: "SGVsbG8gZnJvbSBQb3N0bWFuIQ==",
        branch: "main",
      },
    });

    return response;
  }

  async updateRepoName(
    request: any,
    ownerName: string,
    repoName: string,
    newRepoName: string,
    description: string = "Repository created from Playwright",
  ) {
    const endpoint = `https://api.github.com/repos/${ownerName}/${repoName}`;
    const response = await request.patch(endpoint, {
      headers: HeadersApiHelper.getHeaders(),
      data: {
        name: newRepoName,
        description: description,
      },
    });
    return response;
  }

  async deleteRepo(request: any, ownerName: string, repoName: string) {
    const endpoint = `https://api.github.com/repos/${ownerName}/${repoName}`;
    const response = await request.delete(endpoint, {
      headers: HeadersApiHelper.getHeaders(),
    });
    return response;
  }
}
