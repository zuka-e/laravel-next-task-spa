import { type Method } from 'axios';

type HttpMethod = Uppercase<Method>;

/**
 * Determine if the HTTP request uses a ‘read’ verb.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php - isReading()
 */
const isReadRequest = (method: HttpMethod): boolean => {
  const readMethods: HttpMethod[] = ['HEAD', 'GET', 'OPTIONS'];
  return (readMethods as string[]).includes(method.toUpperCase());
};

export default isReadRequest;
