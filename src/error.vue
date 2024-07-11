<script setup lang="ts">
import type { NuxtError } from '#app';

// get error
const props = defineProps({
	error: Object as () => NuxtError,
});

// get url
const url = (props.error as any).url as string;

// redirect to index if not api route
if (!(url && url.startsWith('/api/'))) clearError({ redirect: '/' });
</script>

<template>
	<!-- Full Width/Height, Centered Left/Center -->
	<div
		class="h-screen w-screen flex flex-col justify-center items-left gap-y-10 p-8"
	>
		<!-- Code, Message, Data -->
		<div class="flex flex-col gap-y-4">
			<h1 class="text-8xl">{{ props.error?.statusCode }}</h1>
			<h2 class="text-4xl">{{ props.error?.statusMessage }}</h2>
			<p>{{ props.error?.data }}</p>
		</div>

		<!-- Raw -->
		<p class="opacity-90">{{ JSON.stringify(props.error, null, 4) }}</p>
	</div>
</template>
