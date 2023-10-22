/**
 * Determine if the HTTP request uses a ‘read’ verb.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php - isReading()
 */
const isReadRequest = (method: string): boolean => {
  return ['HEAD', 'GET', 'OPTIONS'].includes(method.toUpperCase());
};

export default isReadRequest;
