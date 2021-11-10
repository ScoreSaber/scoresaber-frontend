import { writable } from 'svelte/store';
import type { UserData } from '$lib/models/UserData';
import type SearchView from '$lib/components/common/search.svelte';

export const userData = writable(getUser());

function getUser(): UserData | undefined {
   return undefined;
}

export const searchView = writable<SearchView>();
