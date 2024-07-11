<script setup lang="ts">
// properties
const props = defineProps<{
	id: string;
	name: string;
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
		<!-- Emote -->
		<NuxtImg
			:src="`https://static-cdn.jtvnw.net/emoticons/v2/${props.id}/default/dark/1.0`"
			class="inline max-h-8"
			:alt="props.name"
		/>

		<!-- Description Tooltip -->
		<template #text>
			<div
				class="flex flex-col items-center justify-center text-center gap-y-2 p-2"
			>
				<NuxtImg
					:src="`https://static-cdn.jtvnw.net/emoticons/v2/${props.id}/default/dark/4.0`"
				/>
				<span class="text-balance text-xs">{{ props.name }}</span>
			</div>
		</template>
	</UTooltip>
</template>
