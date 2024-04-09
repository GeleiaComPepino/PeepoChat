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

		// methods

		// return public references
		return {
			// values
			version,
			settings,

			// methods
		};
	},
	{
		persist: {
			storage: persistedState.localStorage,
		},
	}
);
