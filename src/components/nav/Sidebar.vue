<script setup lang="ts">
// get state
import useStore from '~/store';
const store = useStore();

// get constants
const sidebarSlideDuration = ref(useAppConfig().sidebarSlideDuration);
</script>

<template>
	<!-- Client Only -- Waiting for storage to load to see if sidebar is currently out or not -->
	<ClientOnly>
		<!-- Sidebar Container -->
		<aside
			:class="[
				'w-10 h-full py-7 flex flex-col items-center bg-secondary-color sidebar-slide-transition sidebar-layer shadow-md',
				// slide to left (off screen) when not expanded
				!store.settings.isSidebarExpanded ? 'sidebar-offset' : '',
			]"
		>
			<!-- Saved Channels -->
			<div
				class="grow w-full pt-3 flex overflow-y-scroll scrollbar-hidden justify-center"
			>
				<slot name="channels" />
			</div>

			<!-- Personal Options -->
			<div class="w-full mt-5 text-center">
				<slot name="personal" />
			</div>
		</aside>

		<!-- Attached -->
		<div
			:class="[
				'absolute w-fit h-full left-10 sidebar-slide-transition footer-layer pointer-events-none',
				!store.settings.isSidebarExpanded ? 'sidebar-offset' : '',
			]"
		>
			<div class="w-full h-full pointer-events-auto">
				<slot name="attached" />
			</div>
		</div>
	</ClientOnly>
</template>

<style scoped>
.sidebar-slide-transition {
	transition: margin-left v-bind(sidebarSlideDuration + 'ms') ease-in-out;
}
</style>
