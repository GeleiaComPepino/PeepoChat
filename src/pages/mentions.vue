<script setup lang="ts">
// localization
const localize = useI18n().t;

// set title
useHead({
	title: localize('view.mentions.title'),
});
</script>

<template>
	<!-- No Mentions -->
	<EmptyView
		icon="i-tabler-at"
		:header="localize('view.mentions.no_mentions.header')"
		:description="localize('view.mentions.no_mentions.description')"
	/>
</template>
