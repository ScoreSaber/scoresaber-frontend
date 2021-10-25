import axios from 'axios';
import { dev } from '$app/env';
import { API_URL } from './env';

export default async function (url: string): Promise<any> {
   if (dev) {
      if (url.startsWith('/api')) {
         url = `${API_URL}${url}`;
      }
   }
   const response = await axios.get(url);
   return response.data;
}
