import { writable } from 'svelte/store';
import type { UserData } from '$lib/models/UserData';
import type SearchView from '$lib/components/common/search.svelte';

export const userData = writable(getUser());

function getUser(): UserData | undefined {
   return undefined;
}

export const snowVisible = writable(false);

export const background = writable('var(--background-color)');

export function setBackground(image: string) {
   background.set(`linear-gradient(180deg, rgba(36, 36, 36, 0.8), rgb(33, 33, 33)) repeat scroll 0% 0%,
   rgba(0, 0, 0, 0) url(${image}) repeat scroll 0% 0%;`);
}

export function defaultBackground() {
   background.set('var(--background-color)');
}

export const searchView = writable<SearchView>();
export const modal = writable(null);
