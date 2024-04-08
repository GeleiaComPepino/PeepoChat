import en from '~/assets/lang/en.json';

export default defineI18nConfig(() => ({
	legacy: false,
	baseUrl: 'https://peepochat.com',
	locale: 'en',
	fallbackLocale: 'en',
	messages: {
		en,
	},
}));
