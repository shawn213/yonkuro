import { writable } from 'svelte/store';

export function createBaseWritable<T>(initialValue: T) {
	const { subscribe, set, update } = writable<T>(initialValue);

	return {
		subscribe,
		set,
		update,
		reset: () => set(initialValue)
	};
}
