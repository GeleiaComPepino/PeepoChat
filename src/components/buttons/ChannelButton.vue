<script setup lang="ts">
// localization
const localize = useI18n().t;

// properties
const props = defineProps<{
	channel: {
		name: string;
		avatarURL: string;
		live: boolean;
		platform: {
			twitch?: string;
		};
	};
}>();

// dropdown contents
const dropdownContentAnon = [
	[
		{
			label: localize('sidebar.channel.dropdown.visit_stream'),
			icon: 'i-ic-outline-ondemand-video',
			to: 'https://www.twitch.tv/' + props.channel.name,
			noRel: true,
			target: '_blank',
		},
	],
	[
		{
			label: localize('sidebar.channel.dropdown.pin'),
			icon: 'i-ic-round-push-pin',
		},
	],
	[
		{
			label: localize('sidebar.channel.dropdown.remove'),
			icon: 'i-ic-baseline-remove-circle',
		},
	],
];

// state
const dropdownOpen = ref(false);
</script>

<template>
	<!-- Account Settings Dropdown -->
	<UDropdown
		:items="dropdownContentAnon"
		:ui="{
			container: 'pl-2',
			background: 'bg-secondary-color',
			ring: '',
			divide: '',
			item: {
				active: 'bg-primary-color',
				disabled: 'cursor-text select-text',
			},
			padding: 'p-1',
		}"
		:popper="{ placement: 'right' }"
		show
		v-model:open="dropdownOpen"
	>
		<!-- Button Trigger -->
		<Button
			:label="props.channel.name"
			variant="hidden"
			:to="'/channel/twitch/' + props.channel.platform.twitch"
			@click.right="
				() => {
					dropdownOpen = true;
				}
			"
		>
			<template #content>
				<!-- Avatar Icon -->
				<UAvatar
					:src="props.channel.avatarURL"
					:ui="{
						rounded: 'rounded-3xl',
						wrapper:
							'relative inline-flex items-center justify-center flex-shrink-0',
						size: {
							sm: 'h-9 w-9 text-base',
						},
					}"
					:class="
						'hover:scale-[1.1] duration-100 ' +
						(props.channel.live
							? 'ring-2 ring-live ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900'
							: 'ring-0')
					"
				/>
			</template>

			<template #tooltip>
				<div class="flex gap-x-2">
					{{ props.channel.name }}
					<LiveBadge v-if="props.channel.live" />
				</div>
			</template>
		</Button>

		<!-- Dropdown Items -->
		<template #item="{ item }">
			<UIcon :name="item.icon" class="h-5 w-5" />
			<span class="truncate">{{ item.label }}</span>
		</template>
	</UDropdown>
</template>
