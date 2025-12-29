<script setup lang="ts">
// properties
const props = defineProps<{
	id: string;
	name: string;
	source?: 'twitch' | '7tv';
	isZeroWidth?: boolean;
}>();

// get emote URL based on source
const emoteUrl = computed(() => {
	if (props.source === '7tv') {
		// 7TV emote URL format
		return `https://cdn.7tv.app/emote/${props.id}/1x.webp`;
	} else {
		// Twitch emote URL format
		return `https://static-cdn.jtvnw.net/emoticons/v2/${props.id}/default/dark/1.0`;
	}
});

// get preview URL for tooltip
const previewUrl = computed(() => {
	if (props.source === '7tv') {
		// Use 4x size for preview
		return `https://cdn.7tv.app/emote/${props.id}/4x.webp`;
	} else {
		// Twitch preview URL
		return `https://static-cdn.jtvnw.net/emoticons/v2/${props.id}/default/dark/4.0`;
	}
});
</script>

<template>
	<!-- For 0-width emotes, render without tooltip wrapper to avoid positioning issues -->
	<template v-if="props.isZeroWidth">
		<NuxtImg
			:src="emoteUrl"
			class="absolute top-1/2 left-1/2 z-20 max-h-8 pointer-events-auto"
			:alt="props.name"
			style="transform: translate(-50%, -50%);"
		/>
	</template>
	
	<!-- For normal emotes, render with tooltip -->
	<UTooltip
		v-else
		:openDelay="800"
		:popper="{ placement: 'right' }"
		:ui="{
			width: 'w-24',
			background: 'opacity-100',
			base: 'h-fit',
		}"
	>
		<!-- Emote -->
		<NuxtImg
			:src="emoteUrl"
			class="inline max-h-8"
			:alt="props.name"
		/>

		<!-- Description Tooltip -->
		<template #text>
			<div
				class="flex flex-col items-center justify-center text-center gap-y-2 p-2"
			>
				<NuxtImg 
					:src="previewUrl" 
				/>
				<span class="text-balance text-xs">{{ props.name }}</span>
			</div>
		</template>
	</UTooltip>
</template>
