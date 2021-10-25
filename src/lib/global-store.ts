import { writable } from 'svelte/store';
import type { UserData } from '$lib/models/UserData';

export const userData = writable(getUser());

function getUser(): UserData | undefined {
   return undefined;
}
