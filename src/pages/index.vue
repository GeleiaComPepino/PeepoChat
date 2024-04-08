<script setup lang="ts">
// localization
const localize = useI18n().t;
</script>

<template>
	<!-- No Channel Selected -->
	<EmptyView
		icon="i-tabler-message-circle-2"
		:header="localize('view.index.no_channel_selected.header')"
		:description="localize('view.index.no_channel_selected.description')"
	/>
</template>
