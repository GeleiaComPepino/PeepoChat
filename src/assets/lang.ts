import en from '~/assets/lang/en.json';

export default defineI18nConfig(() => ({
	legacy: false,
	baseUrl: 'https://peepochat.com',
	strategy: 'prefix_except_default',
	locale: 'en',
	defaultLocale: 'en',
	fallbackLocale: 'en',
	messages: {
		en,
	},
	locales: [
		{
			code: 'en',
			iso: 'en-US',
			isCatchallLocale: true,
		},
	],
}));
