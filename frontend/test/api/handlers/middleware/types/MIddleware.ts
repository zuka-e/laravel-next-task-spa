import type { ResponseTransformer, RestRequest } from 'msw';

type Middleware = (req: RestRequest) => ResponseTransformer[];

export default Middleware;
