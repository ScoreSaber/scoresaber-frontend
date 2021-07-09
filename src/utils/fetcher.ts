/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';

export default async function (args: any) {
   const response = await axios.get(args);
   return response.data;
}
