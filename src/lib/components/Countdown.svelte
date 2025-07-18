<script>
	import { readable } from 'svelte/store';
	import { onDestroy } from 'svelte';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration.js';
	import utc from 'dayjs/plugin/utc.js';
	import tz from 'dayjs/plugin/timezone.js';
	import customParseFormat from 'dayjs/plugin/customParseFormat.js';

	dayjs.extend(duration);
	dayjs.extend(utc);
	dayjs.extend(tz);
	dayjs.extend(customParseFormat);

	export let endTime;

	let remaining = {
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		done: true
	};

	const TIME_COUNTDOWN = readable(endTime.diff(dayjs()), (set) => {
		set(endTime.diff(dayjs()));

		const interval = setInterval(() => {
			set(endTime.diff(dayjs()));
		}, 1000);

		return () => clearInterval(interval);
	});

	let timeRemainingUnsubscribe = TIME_COUNTDOWN.subscribe((time) => {
		const date = dayjs.duration(time);
		const diff = endTime.valueOf() - dayjs().valueOf();
		if (diff > 0) {
			remaining = {
				years: date.years(),
				months: date.months(),
				weeks: date.weeks(),
				days: date.days(),
				hours: date.hours(),
				minutes: date.minutes(),
				seconds: date.seconds(),
				done: false
			};
		} else {
			remaining = {
				years: 0,
				months: 0,
				weeks: 0,
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0,
				done: true
			};
		}
	});

	onDestroy(() => {
		timeRemainingUnsubscribe();
	});
</script>

<slot {remaining} />
