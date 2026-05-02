import HeadersApiHelper from "./header-api-helper";

export default class ReposApiHelper {
  async getUserRepos(request: any) {
    const endpoint = "https://api.github.com/user/repos";

    const response = await request.get(endpoint, {
      headers: HeadersApiHelper.getHeaders(),
    });

    return response;
  }
  async createRepo(request: any, repoName: string) {
    const endpoint = "https://api.github.com/user/repos";
    const response = await request.post(endpoint, {
      headers: HeadersApiHelper.getHeaders(),

      data: {
        name: repoName,
        description: "Repository created from Playwright",
        private: false,
        auto_init: true,
      },
    });
    return response;
  }
}
