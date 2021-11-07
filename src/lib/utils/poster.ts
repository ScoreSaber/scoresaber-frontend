import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { dev } from '$app/env';
import { API_URL } from './env';

export default async function (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
   if (dev) {
      if (url.startsWith('/api')) {
         url = `${API_URL}${url}`;
      }
   }
   const response = await axios.post(url, data, config);
   return response;
}
