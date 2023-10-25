import baseApi from './baseApi';
import { session } from './endpoints';

const api = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    ...session(builder),
  }),
});

export default api;

export const { useGetSessionQuery, useLoginMutation } = api;
