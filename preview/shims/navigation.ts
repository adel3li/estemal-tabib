export class NotFoundError extends Error {}

export function notFound(): never {
  throw new NotFoundError();
}
