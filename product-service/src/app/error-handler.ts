import { ValidationError } from 'joi';

export function errorHandler(error) {
  const statusCode = error instanceof ValidationError ? 400 : 500;
  return {
    statusCode,
    body: JSON.stringify(error),
  };
}
