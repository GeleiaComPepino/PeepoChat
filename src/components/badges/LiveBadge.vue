<script setup lang="ts">
// localization
const localize = useI18n().t;
</script>

<template>
	<span
		class="rounded-[0.2rem] px-[3px] text-xs bg-live text-white font-bold text-center"
	>
		{{ localize('indicator.live') }}
	</span>
</template>
