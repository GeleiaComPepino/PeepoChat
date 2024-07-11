import { name, version, author } from './package.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	schemaOrg: {
		identity: {
			type: 'WebApplication',
			name: 'PeepoChat',
			url: 'https://peepochat.com',
		},
	},

	site: { url: 'https://peepochat.com', name: 'PeepoChat', indexable: false },

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
		twitchAppClientId: '',
		twitchAppClientSecret: '',
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
		'@nuxt/image',
	],

	srcDir: 'src',
	serverDir: 'server',

	components: [
		{
			path: '~/components', // gets nested components
			pathPrefix: false,
		},
	],

	sitemap: {
		autoI18n: false,
		credits: false,
		xslTips: false,
	},

	ui: {
		icons: 'all',
		safelistColors: ['spring-green', 'shark'],
	},

	i18n: {
		locales: [
			{
				code: 'en',
				iso: 'en-US',
				isCatchallLocale: true,
			},
		],
		defaultLocale: 'en',
		strategy: 'prefix_except_default',
		vueI18n: './src/assets/lang.ts',
	},

	devtools: { enabled: true },
	compatibilityDate: '2024-07-03',
});
