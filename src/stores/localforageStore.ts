import localforage from 'localforage';

// 定義實例配置的介面
interface StoreConfig {
	name?: string;
	storeName: string;
	description?: string;
	driver?: string[];
	version?: number;
}

// 設定 localforage 的全域配置
localforage.config({
	name: 'yonkuro',
	storeName: 'app_data',
	description: 'Yonkuro 應用程式的本地資料儲存'
});

// 創建實例工廠函數
export function createStore(config: StoreConfig) {
	return localforage.createInstance({
		name: config.name || 'yonkuro',
		storeName: config.storeName,
		description: config.description || `儲存空間 for ${config.storeName}`,
		driver: config.driver || [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
		version: config.version || 1.0
	});
}

// 預定義的實例
export const stepDataStore = createStore({
	storeName: 'step_store',
	description: '用於儲存步數追蹤資料'
});

export const holidayDataStore = createStore({
	storeName: 'holiday_store',
	description: '用於儲存假期資料'
});

export const workDataStore = createStore({
	storeName: 'work_store',
	description: '用於儲存工作資料'
});

// 導出一個全域的 stores 對象，用來存儲和管理所有動態創建的實例
export const stores: Record<string, LocalForage> = {
	stepData: stepDataStore,
	holidayData: holidayDataStore
};

// 清除未命名或舊版本的資料
export async function clearUnnamedData() {
	try {
		// 取得所有 indexedDB 資料庫名稱
		const dbList = await window.indexedDB.databases();

		// 找出不在我們當前配置中的資料庫
		const currentStores = Object.values(stores).map((store) => store.config().name);
		const unnamedDbs = dbList.filter((db) => !currentStores.includes(db.name));

		// 清除找到的未命名資料庫
		for (const db of unnamedDbs) {
			if (db.name) {
				await new Promise((resolve, reject) => {
					const request = window.indexedDB.deleteDatabase(db.name);
					request.onsuccess = () => resolve(true);
					request.onerror = () => reject(request.error);
				});
			}
		}

		// 清除舊的 localStorage 資料
		const localStoragePrefix = 'localforage/';
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (
				key?.startsWith(localStoragePrefix) &&
				!currentStores.some((name) => key.includes(name))
			) {
				localStorage.removeItem(key);
			}
		}

		return {
			success: true,
			message: `已清除 ${unnamedDbs.length} 個未命名的資料庫`
		};
	} catch (error) {
		console.error('清除未命名資料時發生錯誤:', error);
		return {
			success: false,
			message: '清除過程中發生錯誤',
			error
		};
	}
}

// 清除特定實例的所有資料
export async function clearStoreData(storeName: string) {
	const store = stores[storeName];
	if (store) {
		await store.clear();
		return {
			success: true,
			message: `已清除 ${storeName} 的所有資料`
		};
	}
	return {
		success: false,
		message: `找不到名為 ${storeName} 的存儲實例`
	};
}

// 導出預設的 localforage 實例，以便在不需要特定存儲空間時使用
export default localforage;
