<script setup lang="ts">
// localization
const localize = useI18n().t;

// theme
const colorMode = useColorMode();

// local dark mode value
const isDark = ref(colorMode.value === 'dark');

// toggle dark mode
const toggleDarkMode = () => {
	// toggle local dark mode value
	isDark.value = !isDark.value;

	// change global color mode preference
	colorMode.preference = isDark.value ? 'dark' : 'light';
};
</script>

<template>
	<ClientOnly>
		<Button
			:label="localize('sidebar.theme_toggle_button')"
			:icon="
				isDark
					? 'i-heroicons-moon-20-solid'
					: 'i-heroicons-sun-20-solid'
			"
			@click="toggleDarkMode"
		/>
	</ClientOnly>
</template>
