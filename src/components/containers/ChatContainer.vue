<script setup lang="ts">
// localization
const localize = useI18n().t;

// get state
import useStore from '~/store';
const store = useStore();

// properties
const props = defineProps<{
	user: ITwitchUser;
}>();

// emits
const emit = defineEmits(['onChatConnection', 'onChatDisconnection']);

// chat container reference and state
const chatRef: Ref<HTMLElement | null> = ref(null);
const isChatAnchored: Ref<boolean> = ref(true);

// methods
const scrollToBottom = () => {
	// scroll to bottom of chat smoothly
	chatRef.value?.scrollTo({
		top: chatRef.value?.scrollHeight,
		left: 0,
		behavior: 'smooth',
	});

	// anchor the chat
	isChatAnchored.value = true;
};
const checkSnappedToBottomOfChat = () => {
	// if currently at the bottom of the chat, snap to it
	if (chatRef.value) {
		isChatAnchored.value =
			chatRef.value.scrollHeight - chatRef.value.clientHeight <=
			chatRef.value.scrollTop + 100;
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

// messages
import { ChatClient, type ChatMessage } from '@twurple/chat';
import type { Listener } from '@d-fischer/typed-event-emitter';
const messages: Ref<{ meta: ChatMessage; content: string }[]> = ref([]);
const maxChatMessages = ref(useAppConfig().maxChatMessages);
let twitchChatClient: ChatClient,
	onConnect: Listener,
	onDisconnect: Listener,
	onMessage: Listener;
let badges: Ref<IChatBadgeList> = ref(store.globalBadges);
let emotes7TV: Ref<I7TVEmoteSet | null> = ref(null);

// events
const onChatScroll = () => {
	checkSnappedToBottomOfChat();
};
onBeforeRouteLeave(() => {
	disconnectTwitchChatClient();
});
onBeforeRouteUpdate(() => {
	disconnectTwitchChatClient();
});
onMounted(() => {
	// connect anonymously to twitch chat
	twitchChatClient = new ChatClient({ channels: [props.user.name] });
	twitchChatClient.connect();

	// connect event
	onConnect = twitchChatClient.onConnect(() => {
		emit('onChatConnection');
	});

	// disconnect event
	onDisconnect = twitchChatClient.onDisconnect(() =>
		emit('onChatDisconnection')
	);

	// message event
	onMessage = twitchChatClient.onMessage(
		async (
			_channel: string,
			_user: string,
			text: string,
			msg: ChatMessage
		) => {
			// // max messages (remove oldest message)
			// if (messages.value.length >= maxChatMessages.value)
			// 	messages.value.shift();

			// add new message to list
			messages.value.push({ meta: msg, content: text });

			// scroll to bottom
			if (isChatAnchored.value === true) {
				await nextTick();
				scrollToBottom();
			}
		}
	);

	// get stream data (async)
	$fetch('/api/v1/twitch/stream', {
		params: {
			id: props.user.id,
		},
	}).then((response) => {
		// store stream data
		// if (response.data) stream.value = response.data;
	});

	// get channel badge data (async)
	$fetch('/api/v1/twitch/badges', {
		params: {
			id: props.user.id,
		},
	}).then((response) => {
		// merge and overwrite badge data
		badges.value = {
			...badges.value,
			...(response.data as IChatBadgeList),
		};
	});

	// get 7TV emotes (async)
	$fetch<{ data: I7TVUserResponse }>('/api/v1/twitch/emotes-7tv', {
		params: {
			id: props.user.id,
		},
	})
		.then((response) => {
			// store 7TV emotes
			const data = response.data as I7TVUserResponse;
			if (data?.emote_set) {
				emotes7TV.value = data.emote_set;
			}
		})
		.catch((error) => {
			// 7TV emotes are optional, so we just log the error
			console.warn('Failed to fetch 7TV emotes:', error);
		});
});
</script>

<template>
	<!-- Chat -->
	<div
		class="w-full h-full flex flex-col overflow-y-scroll"
		ref="chatRef"
		@scroll="onChatScroll"
	>
		<!-- Spacer -->
		<span class="h-full" />

		<!-- Messages -->
		<template v-for="(message, index) of messages">
			<MessageContainer
				v-if="index >= Math.max(messages.length - maxChatMessages, 0)"
				:key="index"
				:message="message"
				:index="index"
				:badgeList="badges"
				:emotes7TV="emotes7TV"
			/>
		</template>
	</div>

	<!-- Chat Overlay -->
	<div
		class="absolute w-full h-full bottom-0 overlay-layer pointer-events-none"
	>
		<!-- Buttons -->
		<div class="w-full h-full flex justify-end items-end pr-5 pb-5">
			<!-- Scroll to Bottom -->
			<Button
				v-if="!isChatAnchored"
				:label="localize('chat.overlay.scroll_to_bottom_button')"
				@click="scrollToBottom"
				icon="i-material-symbols-arrow-circle-down-outline"
				class="opacity-50 pointer-events-auto"
				size="xl"
			/>
		</div>
	</div>
</template>
