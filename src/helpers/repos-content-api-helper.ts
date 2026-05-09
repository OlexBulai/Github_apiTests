export default class ReposContentApiHelper {
  private message: string;
  private content: string;
  private branch: string;

  constructor(
    message: string = "Update test file",
    content: string = "SGVsbG8gZnJvbSBQb3N0bWFuIQ==",
    branch: string = "main",
  ) {
    this.message = message;
    this.content = content;
    this.branch = branch;
  }

  async addFileToRepo(
    request: any,
    ownerName: string,
    repoName: string,
    message: string = this.message,
    content: string = this.content,
    branch: string = this.branch,
  ) {
    const endpoint = `/repos/${ownerName}/${repoName}/contents/tesst.txt`;

    const response = await request.put(endpoint, {
      data: {
        message: message,
        content: content,
        branch: branch,
      },
    });

    return response;
  }

  async getFileFromRepo(request: any, ownerName: string, repoName: string) {
    const endpoint = `/repos/${ownerName}/${repoName}/contents/tesst.txt`;

    const response = await request.get(endpoint);

    return response;
  }
}
