<script setup lang="ts">
// properties
const props = defineProps<{
	id: string;
	name: string;
	source?: 'twitch' | '7tv';
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
