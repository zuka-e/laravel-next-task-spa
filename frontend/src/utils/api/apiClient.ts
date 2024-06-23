import axios from 'axios';

import { API_HOST, API_ROUTE } from '@/config/api';

type ApiClientOption = {
  apiRoute?: boolean;
};

export const apiClient = (options?: ApiClientOption) => {
  /** @returns `true` even if the param is `undefined` (default) */
  const isNonApiRoute = () => options?.apiRoute === false;

  const apiClient = axios.create({
    baseURL: isNonApiRoute() ? API_HOST : API_ROUTE,
    withCredentials: true,
  });

  return apiClient;
};
