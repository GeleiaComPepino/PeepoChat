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

// get URLs in message
// let urls: string[] = [];
// let message = URI.withinString(props.message.content, (url) => {
// 	// save link
// 	urls.push(url);

// 	// remove link from message content
// 	return '';
// });
let message = props.message.content;
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
			<p
				:style="{
					color: props.message.meta.tags.get('color')
						? props.message.meta.tags.get('color')
						: '#b9b9b9',
				}"
				class="dark:mix-blend-plus-lighter inline"
			>
				{{ props.message.meta.tags.get('display-name') }}:
			</p>

			<!-- Message Content -->
			<p class="inline">
				{{ message }}
				<!-- <template v-for="url of urls">
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
				</template> -->
			</p>
		</a>
		<!-- <div v-if="urls.length > 0" class="my-2">
			<iframe
				width="300"
				height="80"
				class="rounded bg-black"
				style="background: none transparent"
				frameborder="0"
				allowtransparency="true"
				allow="encrypted-media;"
				src="https://open.spotify.com/embed?uri=https://open.spotify.com/track/0YkwVgruz0osdpSrm1vywm?si=da1783e36234479c"
			/>
		</div> -->
	</div>
</template>
