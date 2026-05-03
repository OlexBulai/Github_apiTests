import HeadersApiHelper from "./header-api-helper";

export default class ReposApiHelper {
  private description: string;
  private privacy: boolean;
  private auto_init: boolean;
  private message: string;
  private content: string;
  private branch: string;

  constructor(
    description: string = "Repository created from Playwright",
    privacy: boolean = false,
    auto_init: boolean = true,
    message: string = "Update test file",
    content: string = "SGVsbG8gZnJvbSBQb3N0bWFuIQ==",
    branch: string = "main",
  ) {
    this.description = description;
    this.privacy = privacy;
    this.auto_init = auto_init;
    this.message = message;
    this.content = content;
    this.branch = branch;
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
    privacy: boolean = this.privacy,
    auto_init: boolean = this.auto_init,
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
    message: string = this.message,
    content: string = this.content,
    branch: string = this.branch,
  ) {
    const endpoint = `https://api.github.com/repos/${ownerName}/${repoName}/contents/tesst.txt`;

    const response = await request.put(endpoint, {
      headers: HeadersApiHelper.getHeaders(),
      data: {
        message: message,
        content: content,
        branch: branch,
      },
    });

    return response;
  }

  async updateRepoName(
    request: any,
    ownerName: string,
    repoName: string,
    newRepoName: string,
    description: string = this.description,
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
