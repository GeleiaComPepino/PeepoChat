<script setup lang="ts">
const props = defineProps<{
	stack: IEmoteStack[];
	anchorIndex: number;
}>();

const anchor = computed(() => props.stack[props.anchorIndex]);
const overlays = computed(() =>
	props.stack.filter((_, index) => index !== props.anchorIndex)
);

// helper function to get emote URL
const getEmoteUrl = (emoteId: string, emoteSource: 'twitch' | '7tv', size: '1x' | '4x' = '1x') => {
	if (emoteSource === '7tv') {
		return `https://cdn.7tv.app/emote/${emoteId}/${size === '4x' ? '4x.webp' : '1x.webp'}`;
	} else {
		return `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/${size === '4x' ? '4.0' : '1.0'}`;
	}
};
</script>

<template>
	<!-- Wrapper participates in text flow, but with no extra line-height slack -->
	<span class="relative inline-block align-bottom leading-none">
		<!-- Anchor: rendered normally to define container width -->
		<NuxtImg
			v-if="anchor"
			:src="getEmoteUrl(anchor.id, anchor.source)"
			class="block max-h-8 emote-overlay-layer pointer-events-auto relative"
			:alt="anchor.name"
		/>

		<!-- Overlays: absolutely centered inside the anchor width -->
		<NuxtImg
			v-for="(emote, stackIndex) in overlays"
			:key="`overlay-${stackIndex}`"
			:src="getEmoteUrl(emote.id, emote.source)"
			class="absolute top-1/2 left-1/2 emote-layer max-h-8 w-auto pointer-events-auto"
			style="transform: translate(-50%, -50%); height: 2rem; width: auto"
			:alt="emote.name"
		/>
	</span>
</template>
