export default class ReposApiHelper {
  private description: string;
  private privacy: boolean;
  private auto_init: boolean;

  constructor(
    description: string = "Repository created from Playwright",
    privacy: boolean = false,
    auto_init: boolean = true,
  ) {
    this.description = description;
    this.privacy = privacy;
    this.auto_init = auto_init;
  }
  async getUserRepos(request: any) {
    const endpoint = "/user/repos";

    const response = await request.get(endpoint);

    return response;
  }

  async createRepo(
    request: any,
    repoName: string,
    description: string = this.description,
    privacy: boolean = this.privacy,
    auto_init: boolean = this.auto_init,
  ) {
    const endpoint = "/user/repos";

    const response = await request.post(endpoint, {
      data: {
        name: repoName,
        description: description,
        private: privacy,
        auto_init: auto_init,
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
      data: {
        name: newRepoName,
        description: description,
      },
    });
    return response;
  }

  async deleteRepo(request: any, ownerName: string, repoName: string) {
    const endpoint = `https://api.github.com/repos/${ownerName}/${repoName}`;
    const response = await request.delete(endpoint);
    return response;
  }

  async getRepoByName(request: any, ownerName: string, repoName: string) {
    const endpoint = `/repos/${ownerName}/${repoName}`;
    return await request.get(endpoint);
  }
  async getBranches(request: any, ownerName: string, repoName: string) {
    const endpoint = `https://api.github.com/repos/${ownerName}/${repoName}/branches`;
    const response = await request.get(endpoint);
    return response;
  }
}
