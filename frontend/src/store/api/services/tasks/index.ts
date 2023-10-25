import baseApi from './baseApi';
import { taskBoards } from './endpoints';

const api = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    ...taskBoards(builder),
  }),
});

export default api;

export const { useGetTaskBoardsQuery } = api;
