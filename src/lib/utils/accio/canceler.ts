import axios from 'axios';
import { writable } from 'svelte/store';

export const requestCancel = writable(newCancelToken());

export function newCancelToken() {
   return axios.CancelToken.source();
}

export function updateCancelToken() {
   requestCancel.set(newCancelToken());
}
