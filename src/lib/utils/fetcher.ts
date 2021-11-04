import axios, { AxiosRequestConfig } from 'axios';
import { dev } from '$app/env';
import { API_URL } from './env';

export default async function <T>(url: string, config?: AxiosRequestConfig): Promise<T> {
   if (dev) {
      if (url.startsWith('/api')) {
         url = `${API_URL}${url}`;
      }
   }
   const response = await axios.get<T>(url, config);
   return response.data;
}
