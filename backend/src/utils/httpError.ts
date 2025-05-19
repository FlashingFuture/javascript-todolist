import { getReasonPhrase } from 'http-status-codes';

export class HTTPError extends Error {
  statusCode: number;

  constructor(statusCode: number, message?: string) {
    const defaultMessage = getReasonPhrase(statusCode);
    super(message || defaultMessage);
    this.statusCode = statusCode;
    this.name = defaultMessage.replace(/\s/g, '');
  }
}
