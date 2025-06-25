import { writable } from 'svelte/store';
import localforage from 'localforage';

export function localforageWritable(key, initialValue) {
	const store = writable(initialValue);

	// 初始化時從 localforage 讀取資料，讀到就 set
	localforage.getItem(key).then((storedValue) => {
		if (storedValue !== null) {
			store.set(storedValue);
		}
	});

	// 每次 store 更新時，同步寫入 localforage
	store.subscribe((value) => {
		localforage.setItem(key, value);
	});

	return {
		subscribe: store.subscribe,
		set: store.set,
		update: store.update
	};
}
