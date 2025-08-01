import { createBaseWritable } from './baseWritable';

interface AlertMessage {
	message: string;
	color?:
		| 'green'
		| 'primary'
		| 'secondary'
		| 'gray'
		| 'red'
		| 'orange'
		| 'amber'
		| 'yellow'
		| 'lime'
		| 'emerald'
		| 'teal'
		| 'cyan'
		| 'sky'
		| 'blue'
		| 'indigo'
		| 'violet'
		| 'purple'
		| 'fuchsia'
		| 'pink'
		| 'rose';
	timeout?: number;
}

const alertStore = createBaseWritable<AlertMessage | null>(null);

export { alertStore };
export type { AlertMessage };
