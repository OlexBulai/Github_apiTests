export default class PullsApiHelper {
  async getPrFile(
    request: any,
    ownerName: string,
    repoName: string,
    pullNumber: number,
  ) {
    const endpoint = `/repos/${ownerName}/${repoName}/pulls/${pullNumber}/files`;
    const response = await request.get(endpoint);
    return response;
  }
}
