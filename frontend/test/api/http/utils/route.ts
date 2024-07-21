import { API_ROUTE, paths } from '@/config/api';

export const url = (pathName: keyof typeof paths) => {
  return API_ROUTE + paths[pathName];
};
