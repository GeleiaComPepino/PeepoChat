import { defineStore } from 'pinia';

// default state values
import defaults from './defaults';

// internal
const storageName = 'peepochat';

export default defineStore(
	storageName,
	() => {
		// reset state if version mismatch found
		if (
			persistedState.localStorage.getItem(storageName) &&
			JSON.parse(
				persistedState.localStorage.getItem(storageName) as string
			).version !== useRuntimeConfig().public.version
		)
			persistedState.localStorage.setItem(storageName, '');

		// values
		const version: Ref<string> = ref(useRuntimeConfig().public.version);
		const settings: Ref<ISettings> = ref(defaults.defaultSettings);
		const globalBadges: Ref<IChatBadgeList> = ref({});
		const channels: Ref<IChannel[]> = ref(defaults.defaultChannels);

		// get global badge data (async)
		useFetch('/api/v1/twitch/badges').then((response) => {
			// store badge data
			globalBadges.value = response.data.value?.data as IChatBadgeList;
		});

		// return public references
		return {
			// values
			version,
			settings,
			globalBadges,
			channels,
		};
	},

	// persist storage between instances
	{
		persist: {
			storage: persistedState.localStorage,
		},
	}
);
