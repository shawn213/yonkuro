import { createBaseWritable } from '$stores/baseWritable';

interface Holiday {
	date: string;
	days: Record<string, string>[];
}

const holidayStore = createBaseWritable<Holiday>({
	date: '',
	days: []
});

export { holidayStore };
export type { Holiday };
