<script setup lang="ts">
// localization
const localize = useI18n().t;

// get route params
const params = useRoute().params;

// set title
useHead({
	title: params.name ? `${params.name}` : '',
});

// route param validation
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

// chat container reference
const chatRef: Ref<HTMLElement | null> = ref(null);

// snapped to bottom of chat container
const isSnappedToBottomOfChat: Ref<boolean> = ref(true);

// messages
const messages: Ref<{ meta: ChatMessage; content: string }[]> = ref([]);

// methods
const scrollToBottom = () => {
	// scroll to bottom of chat smoothly
	chatRef.value?.scrollTo({
		top: chatRef.value?.scrollHeight,
		left: 0,
		behavior: 'smooth',
	});

	// set as snapped
	isSnappedToBottomOfChat.value = true;
};
const checkSnappedToBottomOfChat = () => {
	// if currently at the bottom of the chat, snap to it
	if (chatRef.value) {
		isSnappedToBottomOfChat.value =
			chatRef.value?.scrollHeight - chatRef.value?.clientHeight <=
			chatRef.value?.scrollTop + 100;
	}
};
const disconnectTwitchChatClient = () => {
	// remove listeners
	twitchChatClient.removeListener(onConnect);
	twitchChatClient.removeListener(onDisconnect);
	twitchChatClient.removeListener(onMessage);

	// disconnect client
	twitchChatClient.quit();
};

// connected to twitch chat
const connectionState: Ref<
	'loading' | 'connected' | 'not found' | 'disconnected'
> = ref('loading');

// twurple twitch chat
import { ChatClient, ChatMessage } from '@twurple/chat';
import type { Listener } from '@d-fischer/typed-event-emitter';
let twitchChatClient: ChatClient,
	onConnect: Listener,
	onDisconnect: Listener,
	onMessage: Listener;

// run when page loads
onMounted(async () => {
	// connect anonymously to twitch chat
	twitchChatClient = new ChatClient({ channels: [`${params.name}`] });
	twitchChatClient.connect();

	// connect event
	onConnect = twitchChatClient.onConnect(() => {
		const validateChannel = () =>
			setTimeout(() => {
				// check if queried channel exists in the current channels
				if (
					twitchChatClient.currentChannels.includes(
						`#${params.name}`.toLowerCase()
					)
				)
					// valid twitch channel
					connectionState.value = 'connected';
				else {
					// not found (yet?)
					connectionState.value = 'not found';

					// try again...
					validateChannel();
				}
			}, 300);
		validateChannel();
	});

	// disconnect event
	onDisconnect = twitchChatClient.onDisconnect(() => {
		connectionState.value = 'disconnected';
	});

	// message event
	onMessage = twitchChatClient.onMessage(
		async (
			_channel: string,
			_user: string,
			text: string,
			msg: ChatMessage
		) => {
			// check scroll state
			checkSnappedToBottomOfChat();

			// add new message to list
			messages.value.push({ meta: msg, content: text });

			// scroll to bottom
			if (isSnappedToBottomOfChat.value === true) {
				await nextTick();
				scrollToBottom();
			}
		}
	);
});

// disconnect chat client
onBeforeUnmount(disconnectTwitchChatClient);
// onBeforeRouteLeave(disconnectTwitchChatClient);
// onDeactivated(disconnectTwitchChatClient);
</script>

<template>
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

	<!-- No Channel Found -->
	<EmptyView
		v-else-if="connectionState === 'not found'"
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
			class="w-full h-8 flex items-center px-2 header-layer flex-shrink-0"
		>
			<!-- Text -->
			<span class="pl-5 select-none">
				<!-- Channel Name -->
				{{ params.name }}
			</span>
		</div>

		<!-- Chat -->
		<div class="w-full h-full relative overflow-hidden">
			<div
				class="w-full h-full flex flex-col overflow-y-scroll"
				ref="chatRef"
				@scroll="checkSnappedToBottomOfChat"
			>
				<!-- Spacer -->
				<span class="h-full" />

				<!-- Messages -->
				<span v-for="(message, index) of messages">
					<div
						:class="[
							// first message: highlight background
							message.meta.tags.get('first-msg') == '1'
								? 'bg-yellow-50 dark:bg-stone-700'
								: // alternate colors for each row/message
								index % 2 === 0
								? 'bg-secondary-color'
								: '', // empty/transparent (inherit background)
							'pl-5',
						]"
					>
						<a
							href="#"
							@click.prevent="console.log(message.meta.tags)"
						>
							<span
								:class="[
									'text-[' +
										message.meta.tags.get('color') +
										']',
								]"
							>
								{{ message.meta.tags.get('display-name') }}:
							</span>
							<span>
								{{ message.content }}
							</span>
						</a>
					</div>
				</span>
			</div>

			<!-- Chat Overlay -->
			<div
				class="absolute w-full h-full bottom-0 overlay-layer pointer-events-none"
			>
				<!-- Buttons -->
				<div class="w-full h-full flex justify-end items-end pr-5 pb-5">
					<!-- Scroll to Bottom -->
					<Button
						v-if="!isSnappedToBottomOfChat"
						:label="
							localize('chat.overlay.scroll_to_bottom_button')
						"
						@click="scrollToBottom"
						icon="i-material-symbols-arrow-circle-down-outline"
						class="opacity-50 pointer-events-auto"
						size="xl"
					/>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="w-full h-16 flex-shrink-0" />
	</div>
</template>
