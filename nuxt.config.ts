import { name, version, author } from './package.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			meta: [
				{ charset: 'utf-8' },
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1',
				},
			],
			link: [{ rel: 'icon', type: 'image/png', href: '/icon.png' }],
		},
	},

	runtimeConfig: {
		public: {
			version,
			userAgent: `${name}/${version} (${author.email})`,
		},
	},

	modules: [
		// includes tailwindcss and icons
		'@nuxt/ui',
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		'@nuxtjs/i18n',
		'@nuxtjs/seo',
	],

	srcDir: 'src',

	components: [
		{
			path: '~/components', // gets nested components
			pathPrefix: false,
		},
	],

	site: { url: 'https://peepochat.com', name: 'PeepoChat', indexable: false },

	sitemap: { autoI18n: false },

	schemaOrg: {
		identity: {
			type: 'WebApplication',
			name: 'PeepoChat',
			url: 'https://peepochat.com',
		},
	},

	ui: {
		icons: 'all',
		safelistColors: ['spring-green', 'shark'],
	},

	i18n: {
		vueI18n: './src/assets/lang.ts',
	},

	devtools: { enabled: true },
});
