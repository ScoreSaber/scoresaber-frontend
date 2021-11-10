import { writable } from 'svelte/store';
import type { UserData } from '$lib/models/UserData';
import axios from 'axios';

export const userData = writable(getUser());
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
export const requestCancel = writable(source);

function getUser(): UserData | undefined {
   return undefined;
}
