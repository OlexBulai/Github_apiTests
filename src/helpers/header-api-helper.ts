export default class HeadersApiHelper {
  static getHeaders() {
    return {
      Authorization: process.env.TOKEN!,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    };
  }
}
