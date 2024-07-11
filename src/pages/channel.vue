<script setup lang="ts">
// localization
const localize = useI18n().t;

// get route params
const params = useRoute().params;

// route validation
definePageMeta({
	validate: async (route) => {
		return (
			// platform must be of 'twitch'
			typeof route.params.platform === 'string' &&
			route.params.platform === 'twitch' &&
			// channel name must not be empty
			typeof route.params.name === 'string' &&
			route.params.name !== ''
		);
	},
	redirect(_to) {
		return { path: '/' };
	},
});

// page title
const title = ref();
useHead({
	title,
});
const updatePageTitle = () => {
	// update title
	title.value = (stream.value ? '🔴 ' : '') + user.value?.displayName;
};

// state of twitch chat connection
const connectionState: Ref<
	'loading' | 'connected' | 'not found' | 'disconnected'
> = ref('loading');

// init twitch channel data
let user: Ref<ITwitchUser | null> = ref(null);
let stream: Ref<ITwitchStream | null> = ref(null);
watch(stream, updatePageTitle);

// fetch twitch channel user/stream data async
$fetch('/api/v1/twitch/user', {
	params: {
		name: params.name,
	},
}).then((response) => {
	// user does not exist
	if (!response.data) {
		// set state
		connectionState.value = 'not found';
	}

	// user found
	else {
		// store user data
		user.value = response.data;

		// set title
		updatePageTitle();
	}
});
</script>

<template>
	<!-- No Channel Found -->
	<EmptyView
		v-if="connectionState === 'not found'"
		icon="tabler:search-off"
		:header="localize('view.channel.no_channel_found.header')"
		:description="
			localize('view.channel.no_channel_found.description', {
				name: `${params.name}`,
			})
		"
	/>

	<!-- Disconnected -->
	<EmptyView
		v-else-if="connectionState === 'disconnected'"
		icon="clarity:disconnected-solid"
		:header="localize('view.channel.channel_disconnected.header')"
		:description="localize('view.channel.channel_disconnected.description')"
	/>

	<!-- Channel -->
	<div v-else class="w-full h-full flex flex-col flex-nowrap">
		<!-- Header -->
		<div
			class="w-full h-8 flex items-center px-2 mb-3 header-layer flex-shrink-0"
		>
			<!-- Text -->
			<span class="pl-5 select-none items-center">
				<!-- Channel Name -->
				{{ user ? user.displayName : params.name }}

				<!-- Live -->
				<span v-if="stream">
					<!-- Live Indicator -->
					<LiveBadge />

					<!-- Stream Title -->
					<span v-if="stream.title && stream.title !== '󠀀'">
						- {{ stream.title }}
					</span>
				</span>
			</span>
		</div>

		<!-- Loading -->
		<div v-if="connectionState === 'loading'" class="h-full w-full flex">
			<!-- Spinner -->
			<div
				ref="container"
				role="status"
				class="grow px-5 py-5 flex full-center"
			>
				<Icon
					name="svg-spinners:ring-resize"
					class="w-8 h-8 text-primary"
					aria-hidden="true"
					viewBox="0 0 100 101"
					fill="none"
				/>
			</div>
		</div>

		<!-- Content -->
		<div
			v-if="user"
			v-show="connectionState === 'connected'"
			class="w-full h-full relative overflow-hidden content-layer"
		>
			<!-- Chat -->
			<ChatContainer
				:user="user"
				@on-chat-connection="connectionState = 'connected'"
				@on-chat-disconnection="connectionState = 'disconnected'"
			/>
		</div>

		<!-- Footer -->
		<div class="w-full h-16 flex-shrink-0" />
	</div>
</template>
