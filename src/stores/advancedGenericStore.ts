// advancedGenericStore.ts
import { writable } from 'svelte/store';

function createAdvancedStore<T>(initialValue: T) {
	const { subscribe, set, update } = writable<T>(initialValue);

	return {
		subscribe,
		set,
		update,
		reset: () => set(initialValue)
	};
}

interface Holiday {
	date: string;
	days: Record<string, string>[];
}

const holidayStore = createAdvancedStore<Holiday>({
	date: '',
	days: []
});

export { holidayStore };
export type { Holiday };
