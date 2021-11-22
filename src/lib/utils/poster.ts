import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { dev } from '$app/env';
import { API_URL, API_KEY } from './env';

export default async function (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
   const isAPI = url.startsWith('/api');
   if (dev) {
      if (isAPI) {
         url = `${API_URL}${url}`;
      }
   }

   if (isAPI) {
      if (API_KEY) {
         config = { ...config, headers: { Authorization: API_KEY } };
      }
   }
   const response = await axios.post(url, data, config);
   return response;
}
