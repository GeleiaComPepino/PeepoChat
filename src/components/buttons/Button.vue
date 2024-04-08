<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		to?: string;
		label: string;
		icon?: string;
		text?: string;
		class?: string;
		ui?: any;
		variant?: string;
		size?: string;
	}>(),
	{
		variant: 'ghost',
	}
);
const emit = defineEmits(['click']);
</script>

<template>
	<!-- Tooltip wrapper -->
	<UTooltip
		:text="label"
		:openDelay="800"
		:popper="{
			placement: 'right',
		}"
	>
		<!-- Button -->
		<UButton
			@click="$emit('click')"
			:to="to"
			:aria-label="label"
			:icon="icon"
			:label="text"
			:class="class"
			:ui="ui"
			:variant="variant"
			:size="size"
		>
			<template #leading>
				<slot name="content" />
			</template>
		</UButton>

		<!-- Custom Tooltip Content -->
		<template #text>
			<slot name="tooltip" />
		</template>
	</UTooltip>
</template>
