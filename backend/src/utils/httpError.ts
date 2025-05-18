import { getReasonPhrase } from "http-status-codes";

export class HTTPError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message || getReasonPhrase(statusCode));
    this.statusCode = statusCode;
    this.name = getReasonPhrase(statusCode).replace(/\s/g, "");
  }
}
