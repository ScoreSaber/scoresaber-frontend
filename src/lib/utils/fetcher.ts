import axios, { type AxiosRequestConfig } from 'axios';

import { API_URL } from './env';

export default async function <T>(url: string, config?: AxiosRequestConfig): Promise<T> {
   const isAPI = url.startsWith('/api');

   if (isAPI) {
      url = `${API_URL ?? ''}${url}`;
   }

   const response = await axios.get<T>(url, config);
   return response.data;
}
