<script setup lang="ts">
// types
import type { ChatMessage } from '@twurple/chat';

// get properties
const props = defineProps<{
	message: {
		meta: ChatMessage;
		content: string;
	};
	index: number;
	badgeList: IChatBadgeList;
	emotes7TV?: I7TVEmoteSet | null;
}>();

// format badges
let badges: { [key: string]: number } = {};
if (props.message.meta.tags.get('badges'))
	(props.message.meta.tags.get('badges') as string)
		.split(',')
		.forEach((value) => {
			const badgeDataSplit = value.split('/') as string[];
			if (props.badgeList[badgeDataSplit[0]][badgeDataSplit[1]])
				badges[badgeDataSplit[0]] = Number(badgeDataSplit[1]);
		});

// get twitch emotes used in message
let emotesUsed: { [key: string]: number[][] } = {};
let emotesRaw = props.message.meta.tags.get('emotes');
if (emotesRaw && emotesRaw !== '')
	emotesRaw.split('/').forEach((emote) => {
		const emoteSplit = emote.split(':');
		emotesUsed[emoteSplit[0]] = emoteSplit[1]
			.split(',')
			.map((emoteLocation) => {
				return emoteLocation.split('-').map((emotePosition) => {
					return Number(emotePosition);
				});
			});
	});

// create 7TV emote map (name -> emote data)
const emotes7TVMap: Map<string, I7TVEmote> = new Map();
if (props.emotes7TV?.emotes) {
	props.emotes7TV.emotes.forEach((emote) => {
		emotes7TVMap.set(emote.name, emote);
	});
}

// parse message
let message: {
	[key: string]:
		| { type: 'text'; content: string }
		| { type: 'emote'; id: string; name: string; source: 'twitch' | '7tv'; isZeroWidth?: boolean; zeroWidthEmotes?: Array<{ id: string; name: string; source: 'twitch' | '7tv' }> };
} = {};

// split message into individual words with the key of their starting position in the message
let position = 0;
props.message.content.split(' ').forEach((words) => {
	message[position] = { type: 'text', content: words };
	position += words.length + 1;
});

// replace Twitch emotes in message (these take priority)
for (const id in emotesUsed) {
	for (const positions of emotesUsed[id]) {
		message[positions[0]] = {
			type: 'emote',
			id,
			name: (
				message[positions[0]] as { type: 'text'; content: string }
			).content,
			source: 'twitch',
		};
	}
}

// replace 7TV emotes in message (only if not already replaced by Twitch emote)
if (emotes7TVMap.size > 0) {
	for (const position in message) {
		const word = message[position];
		if (word.type === 'text') {
			const emote7TV = emotes7TVMap.get(word.content);
			if (emote7TV) {
				// Check if emote is 0-width (flag value 256)
				// 7TV uses bitwise flags, so we check if bit 8 (256) is set
				const flags = emote7TV.data?.flags ?? emote7TV.flags;
				const isZeroWidth = flags === 256 || (flags & 256) === 256;
				message[position] = {
					type: 'emote',
					id: emote7TV.id,
					name: emote7TV.name,
					source: '7tv',
					isZeroWidth: isZeroWidth,
				};
			}
		}
	}
}

// group 0-width emotes with their previous emote
const messagePositions = Object.keys(message).map(Number).sort((a, b) => a - b);
for (let i = 0; i < messagePositions.length; i++) {
	const currentPos = messagePositions[i];
	const currentWord = message[currentPos];
	
	// skip if this position was already deleted
	if (!currentWord) continue;
	
	// if current word is a 0-width emote, find the previous emote and attach it
	if (currentWord.type === 'emote' && currentWord.isZeroWidth) {
		// look backwards for the previous emote
		for (let j = i - 1; j >= 0; j--) {
			const prevPos = messagePositions[j];
			const prevWord = message[prevPos];
			
			// skip if previous word was deleted or doesn't exist
			if (!prevWord) continue;
			
			if (prevWord.type === 'emote' && !prevWord.isZeroWidth) {
				// attach this 0-width emote to the previous emote
				if (!prevWord.zeroWidthEmotes) {
					prevWord.zeroWidthEmotes = [];
				}
				prevWord.zeroWidthEmotes.push({
					id: currentWord.id,
					name: currentWord.name,
					source: currentWord.source,
				});
				// mark this position to be skipped in rendering
				delete message[currentPos];
				break;
			}
		}
	}
}

// if no emotes were found, simplify the message structure
if (
	Object.values(message).every(
		(word) => word.type === 'text'
	)
) {
	message = { '0': { type: 'text', content: props.message.content } };
}

// get URLs in message
// let urls: string[] = [];
// let message = URI.withinString(props.message.content, (url) => {
// 	// save link
// 	urls.push(url);

// 	// remove link from message content
// 	return '';
// });
</script>

<template>
	<div
		:class="[
			// first message: highlight background
			props.message.meta.tags.get('first-msg') == '1'
				? 'bg-yellow-50 dark:bg-stone-700'
				: // alternate colors for each row/message
				index % 2 === 0
				? 'bg-secondary-color'
				: '', // empty/transparent (inherit background)
			'pl-5',
		]"
	>
		<a href="#" @click.prevent="console.log(props.message.meta.tags)">
			<!-- Badges -->
			<ChatBadge
				v-if="badges"
				v-for="(version, id) in badges"
				:title="props.badgeList[id][version].title"
				:url="props.badgeList[id][version].url"
				:preview-url="props.badgeList[id][version].previewUrl"
				class="inline"
			/>

			<!-- Name -->
			<span
				:style="{
					color: props.message.meta.tags.get('color')
						? props.message.meta.tags.get('color')
						: '#b9b9b9',
				}"
				class="dark:mix-blend-plus-lighter"
			>
				{{ props.message.meta.tags.get('display-name') }}:
			</span>

			<!-- Message Content -->
			<template
				v-for="(word, position, index) in message"
				class="h-full text-center"
			>
				<!-- Text -->
				<span v-if="word.type == 'text'">
					{{ word.content }}
				</span>

				<!-- Emote -->
				<UTooltip
					v-else-if="word.type == 'emote' && word.zeroWidthEmotes && word.zeroWidthEmotes.length > 0"
					:openDelay="800"
					:popper="{ placement: 'right' }"
					:ui="{
						width: 'w-24',
						background: 'opacity-100',
						base: 'h-fit',
					}"
				>
					<span 
						:class="[
							'inline-flex relative align-middle items-center justify-center pointer-events-auto'
						]"
						style="overflow: visible; min-height: 2rem;"
					>
						<!-- Normal emote positioned absolutely inside 0-width container (rendered first, z-10, behind) -->
						<Emote 
							:id="word.id" 
							:name="word.name" 
							:source="word.source" 
							:hasZeroWidth="true"
							:zeroWidthEmotes="word.zeroWidthEmotes"
							class="inline" 
						/>
						<!-- 0-width emotes stacked with increasing z-index (rendered after, on top) -->
						<Emote
							v-for="(zwEmote, zwIndex) in word.zeroWidthEmotes"
							:key="`zw-${zwIndex}`"
							:id="zwEmote.id"
							:name="zwEmote.name"
							:source="zwEmote.source"
							:isZeroWidth="true"
							:zeroWidthIndex="zwIndex"
						/>
					</span>

					<!-- Description Tooltip with main emote and all 0-width emotes -->
					<template #text>
						<div
							class="flex flex-col items-center justify-center text-center gap-y-2 p-2"
						>
							<!-- Main emote -->
							<NuxtImg 
								:src="word.source === '7tv' ? `https://cdn.7tv.app/emote/${word.id}/4x.webp` : `https://static-cdn.jtvnw.net/emoticons/v2/${word.id}/default/dark/4.0`" 
							/>
							<span class="text-balance text-xs">{{ word.name }}</span>
							
							<!-- All 0-width emotes -->
							<template v-if="word.zeroWidthEmotes && word.zeroWidthEmotes.length > 0">
								<div class="w-full border-t border-gray-300 dark:border-gray-600 pt-2 mt-1">
									<template v-for="(zwEmote, index) in word.zeroWidthEmotes" :key="`zw-tooltip-${index}`">
										<div class="flex flex-col items-center justify-center gap-y-1 mb-2">
											<NuxtImg 
												:src="zwEmote.source === '7tv' ? `https://cdn.7tv.app/emote/${zwEmote.id}/4x.webp` : `https://static-cdn.jtvnw.net/emoticons/v2/${zwEmote.id}/default/dark/4.0`" 
											/>
											<span class="text-balance text-xs">{{ zwEmote.name }}</span>
										</div>
									</template>
								</div>
							</template>
						</div>
					</template>
				</UTooltip>

				<!-- Normal emote without 0-width -->
				<span 
					v-else-if="word.type == 'emote'" 
					class="inline-flex relative align-middle"
					style="overflow: visible;"
				>
					<Emote 
						:id="word.id" 
						:name="word.name" 
						:source="word.source" 
						:hasZeroWidth="false"
						class="inline" 
					/>
				</span>

				<!-- if not the last word, add a space -->
				<span v-if="index + 1 < Object.keys(message).length">
					{{ ' ' }}
				</span>

				<!-- Link -->
				<!-- <p class="inline">
					{{ props.message.content }}
					<template v-for="url of urls">
						<NuxtLink :href="url" target="_blank">
							<div
								class="w-[200px] h-[20px] bg-blue-600 bg-opacity-35 rounded flex items-center overflow-hidden pl-3"
							>
								<p class="text-nowrap whitespace-nowrap">
									<Icon
										name="material-symbols:link-rounded"
										class="w-[20px] h-[20px] text-white"
									/>
									{{ url }}
								</p>
							</div>
						</NuxtLink>
					</template>
				</p> -->
			</template>
		</a>
	</div>
</template>
