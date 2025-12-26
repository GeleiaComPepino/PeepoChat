<script setup lang="ts">
// get state
import useStore from '~/store';
const store = useStore();

// localization
const localize = useI18n().t;

// get constants
const sidebarSlideDuration = ref(useAppConfig().sidebarSlideDuration);

// is sidebar toggle button disabled?
const isSidebarToggleButtonDisabled = ref(false);

// toggle sidebar
const toggleSidebar = () => {
	// ignore if button is disabled
	if (isSidebarToggleButtonDisabled.value === true) return;

	// disable button
	isSidebarToggleButtonDisabled.value = true;

	// toggle sidebar
	store.settings.isSidebarExpanded = !store.settings.isSidebarExpanded;

	// re-enable button after slide animation/transition completes
	setTimeout(
		() => (isSidebarToggleButtonDisabled.value = false),
		Number(sidebarSlideDuration.value)
	);
};

// generate sidebar toggle button style
const sidebarToggleButtonStyle = computed(() => {
	return {
		icon: {
			// rotate icon when sidebar is hidden
			base: store.settings.isSidebarExpanded
				? `transition-transform duration-${sidebarSlideDuration.value}`
				: `transform rotate-180 transition-transform duration-${sidebarSlideDuration.value}`,
		},
	};
});

// state do modal
const isAddChannelModalOpen = ref(false);

// método para adicionar canal
const handleChannelAdded = (channel: IChannel) => {
	// Verificar se o canal já existe
	const channelExists = store.channels.some(
		(c) => c.name.toLowerCase() === channel.name.toLowerCase()
	);

	if (!channelExists) {
		// Adicionar ao store
		store.channels.push(channel);
	}
};

// migrar canais antigos que não têm propriedade pinned
onMounted(() => {
	store.channels.forEach((channel) => {
		if (typeof channel.pinned === 'undefined') {
			channel.pinned = false;
		}
	});
});

// ordenar canais: pinned primeiro, depois os demais
const sortedChannels = computed(() => {
	return [...store.channels].sort((a, b) => {
		// Pinned channels first
		if (a.pinned && !b.pinned) return -1;
		if (!a.pinned && b.pinned) return 1;
		// Keep original order for same pinned status
		return 0;
	});
});
</script>

<template>
	<!-- prevent page from expanding past size of screen -->
	<div class="static h-full flex flex-row overflow-hidden">
		<!-- Sidebar -->
		<Sidebar :open="store.settings.isSidebarExpanded">
			<!-- Channels -->
			<template #channels>
				<ul>
					<!-- Channel Buttons -->
					<li
						v-for="channel in sortedChannels"
						:key="channel.name"
						class="flex justify-center mb-3"
					>
						<ChannelButton :channel="channel" />
					</li>

					<!-- Add Channel Button -->
					<li class="flex justify-center">
						<Button
							:label="localize('sidebar.add_channel_button')"
							icon="i-tabler-plus"
							:ui="{
								rounded: 'rounded-full',
								square: {
									lg: 'p-2.5',
								},
								icon: {
									base: 'flex-shrink-0',
									size: {
										lg: 'h-5 w-5',
									},
								},
							}"
							size="lg"
							@click="isAddChannelModalOpen = true"
						/>
					</li>
				</ul>
			</template>

			<!-- Personal Options -->
			<template #personal>
				<!-- Theme Toggle Button -->
				<div class="mb-6 text-center">
					<ThemeToggleButton />
				</div>

				<!-- Mentions Page Button -->
				<div class="mb-6 text-center">
					<Button
						:label="localize('sidebar.mentions_button')"
						icon="i-fluent-comment-mention-16-filled"
						variant="inverse"
						size="xl"
						to="/mentions"
					/>
				</div>

				<!-- Separator -->
				<!-- <span class="w-full flex full-center my-6">
					<hr class="w-[70%]" />
				</span> -->

				<!-- Account Button -->
				<AccountButton />
			</template>

			<!-- Attached Buttons -->
			<template #attached>
				<div class="h-full flex flex-col justify-end pb-5 px-3">
					<!-- Sidebar Toggle Button -->
					<Button
						:label="localize('sidebar.toggle_button')"
						icon="i-radix-icons-double-arrow-left"
						@click="toggleSidebar"
						:ui="sidebarToggleButtonStyle"
					/>
				</div>
			</template>
		</Sidebar>

		<!-- Current View (Page) -->
		<div class="static h-full w-fit grow scrollbar-hidden">
			<slot />
		</div>

		<!-- Add Channel Modal -->
		<AddChannelModal
			v-model:open="isAddChannelModalOpen"
			@channel-added="handleChannelAdded"
		/>
	</div>
</template>
