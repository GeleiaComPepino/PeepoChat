<script setup lang="ts">
// properties
const props = defineProps<{
	title: string;
	url: string;
	previewUrl: string;
}>();
</script>

<template>
	<!-- Hover Tooltip -->
	<UTooltip
		:openDelay="800"
		:popper="{ placement: 'right' }"
		:ui="{
			width: 'w-24',
			background: 'opacity-100',
			base: 'h-fit',
		}"
	>
		<!-- Badge -->
		<NuxtImg :src="props.url" class="inline pr-2" />

		<!-- Custom Tooltip Content -->
		<template #text>
			<div
				class="flex flex-col items-center justify-center text-center gap-y-2 p-2"
			>
				<NuxtImg :src="props.previewUrl" />
				<p class="text-balance text-xs">{{ title }}</p>
			</div>
		</template>
	</UTooltip>
</template>
