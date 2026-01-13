<script setup lang="ts">
// properties
const props = defineProps<{
	id: string;
	name: string;
	source?: 'twitch' | '7tv';
	isZeroWidth?: boolean;
	hasZeroWidth?: boolean;
	zeroWidthEmotes?: Array<{ id: string; name: string; source: 'twitch' | '7tv' }>;
	zeroWidthIndex?: number; // index of this 0-width emote in the stack
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
	<!-- For 0-width emotes, render without tooltip wrapper -->
	<template v-if="props.isZeroWidth">
		<!-- First 0-width defines container width (inline) -->
		<NuxtImg
			v-if="(props.zeroWidthIndex || 0) === 0"
			:src="emoteUrl"
			class="inline max-h-8 pointer-events-none relative"
			:style="`z-index: ${20 + (props.zeroWidthIndex || 0) * 10};`"
			:alt="props.name"
		/>
		<!-- Subsequent 0-widths are absolutely positioned and stacked -->
		<NuxtImg
			v-else
			:src="emoteUrl"
			class="absolute top-1/2 left-1/2 max-h-8 pointer-events-none"
			:style="`transform: translate(-50%, -50%); z-index: ${20 + (props.zeroWidthIndex || 0) * 10};`"
			:alt="props.name"
		/>
	</template>
	
	<!-- For normal emotes with 0-width, render without tooltip (tooltip is handled by parent) -->
	<template v-else-if="props.hasZeroWidth">
		<NuxtImg
			:src="emoteUrl"
			class="absolute top-1/2 left-1/2 z-10 max-h-8 w-auto pointer-events-auto"
			style="transform: translate(-50%, -50%); height: 2rem; width: auto;"
			:alt="props.name"
		/>
	</template>
	
	<!-- For normal emotes without 0-width, render with tooltip -->
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
