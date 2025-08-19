<script lang="ts">
	import Map from '@anoram/leaflet-svelte';

	// 允許傳入單一座標或座標陣列
	export let locations: Array<{ lat: number; lng: number }> = [];

	// 建立標記陣列
	let markers = [];

	// 如果提供了 locations 陣列，將所有座標加入到標記陣列
	$: if (locations && locations.length > 0) {
		markers = [
			{
				lat: 22.61321821006927,
				lng: 120.29396187592799,
				icon: {
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
					shadowUrl: 'https://unpkg.com/leaflet@0.7.1/dist/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				}
			},
			...locations.map((loc) => ({
				...loc,
				icon: {
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
					shadowUrl: 'https://unpkg.com/leaflet@0.7.1/dist/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				}
			}))
		];
	}

	let options = {
		recenter: true,
		zoom: 19,
		maxZoom: 18,
		zIndex: 0,
		markers,
		attributionControl: false,
		controls: {
			zoomControl: false
		}
	};

	// 確保 options.markers 始終使用最新的 markers 值
	$: options = { ...options, markers };
</script>

<Map class="z-0" {options} />
