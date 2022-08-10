import axios, { type AxiosRequestConfig } from 'axios';

import { dev } from '$app/env';

import { API_URL, API_KEY } from './env';

export default async function <T>(url: string, config?: AxiosRequestConfig): Promise<T> {
   const isAPI = url.startsWith('/api');

   if (isAPI) {
      url = `${API_URL ?? ''}${url}`;
   }

   if (isAPI) {
      if (API_KEY) {
         config = { ...config, headers: { Authorization: API_KEY } };
      }
   }
   const response = await axios.get<T>(url, config);
   return response.data;
}
