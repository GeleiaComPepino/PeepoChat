<script setup lang="ts">
// localization
const localize = useI18n().t;

// props
const props = defineProps<{
	open: boolean;
}>();

const emit = defineEmits<{
	'update:open': [value: boolean];
	'channel-added': [channel: IChannel];
}>();

// state
const channelName = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);

// methods
const findChannel = async () => {
	if (!channelName.value.trim()) return;

	isLoading.value = true;
	error.value = null;

	try {
		const response = await $fetch('/api/v1/twitch/user', {
			params: { name: channelName.value.trim() },
		});

		if (!response.data) {
			error.value = localize(
				'view.channel.no_channel_found.description',
				{
					name: channelName.value,
				}
			);
			return;
		}

		// Emit channel data
		emit('channel-added', {
			name: response.data.name,
			avatarURL: response.data.profilePictureUrl,
			live: false, // search for stream later
			pinned: false,
			platform: {
				twitch: response.data.name,
			},
		});

		// Reset and close
		channelName.value = '';
		emit('update:open', false);
	} catch (err) {
		error.value = 'Error fetching channel';
	} finally {
		isLoading.value = false;
	}
};

const close = () => {
	channelName.value = '';
	error.value = null;
	emit('update:open', false);
};
</script>

<template>
	<UModal
		:model-value="open"
		@update:model-value="emit('update:open', $event)"
		@close="close"
		:ui="{
			width: 'w-full max-w-md',
			container: 'items-center',
		}"
	>
		<UCard
			:ui="{
				width: 'w-full',
			}"
		>
			<template #header>
				<h3 class="text-lg font-semibold">
					{{ localize('modal.add_channel.header') }}
				</h3>
			</template>

			<div class="flex flex-col gap-4">
				<UInput
					v-model="channelName"
					:placeholder="
						localize('modal.add_channel.input.placeholder')
					"
					@keyup.enter="findChannel"
					:disabled="isLoading"
				/>

				<div v-if="error" class="text-red-500 text-sm">
					{{ error }}
				</div>
			</div>

			<template #footer>
				<div class="flex justify-end gap-2">
					<UButton
						variant="ghost"
						@click="close"
						:disabled="isLoading"
					>
						Cancel
					</UButton>
					<UButton
						@click="findChannel"
						:loading="isLoading"
						:disabled="!channelName.trim()"
					>
						{{ localize('modal.add_channel.button.find') }}
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
