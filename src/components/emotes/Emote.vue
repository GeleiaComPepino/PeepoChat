<script setup lang="ts">
const props = defineProps<{
	id: string;
	name: string;
	source?: EmoteSource;
}>();
</script>

<template>
	<UTooltip
		:openDelay="800"
		:popper="{ placement: 'right' }"
		:ui="{
			width: 'w-24',
			background: 'opacity-100',
			// inline, participates in text flow, but with no extra line-height slack
			base: 'h-fit',
		}"
	>
		<!-- Emote image -->
		<NuxtImg
			:src="getEmoteUrl(props.id, props.source)"
			class="inline max-h-8"
			:alt="props.name"
		/>

		<!-- Tooltip content -->
		<template #text>
			<div
				class="flex flex-col items-center justify-center text-center gap-y-2 p-2"
			>
				<NuxtImg :src="getEmoteUrl(props.id, props.source, '4')" />
				<span class="text-balance text-xs">{{ props.name }}</span>
			</div>
		</template>
	</UTooltip>
</template>
