import type {
	ApiClient,
	HelixChatBadgeSet,
	HelixChatBadgeVersion,
} from '@twurple/api';

export default defineEventHandler(async (event) => {
	// get query params
	const { id, name } = getQuery(event);

	// get twitch api (twurple) client
	const twitchAPI: ApiClient = event.context.twitchAPI;

	// failed to connect
	if (!twitchAPI)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			data: 'Unable to reach Twitch API.',
		});

	// init user data
	let user;
	let badgeData: HelixChatBadgeSet[];

	// ID provided
	if (id) user = await twitchAPI.users.getUserById(Number(id));
	// only name provided
	else if (name) user = await twitchAPI.users.getUserByName(name as string);

	// channel badges
	if (user) badgeData = await twitchAPI.chat.getChannelBadges(user.id);
	// global badges
	else badgeData = await twitchAPI.chat.getGlobalBadges();

	// format data
	let badges: IChatBadgeList = {};
	badgeData.forEach((badgeSet: HelixChatBadgeSet, index: number) => {
		// init badge
		badges[badgeSet.id] = {};

		// collect all badge versions
		badgeSet.versions.forEach((badgeVersion: HelixChatBadgeVersion) => {
			badges[badgeSet.id][badgeVersion.id] = {
				title: badgeVersion.title,
				description: badgeVersion.description,
				url: badgeVersion.getImageUrl(1),
				previewUrl: badgeVersion.getImageUrl(4),
				clickAction: badgeVersion.clickAction,
				clickUrl: badgeVersion.clickUrl,
			};
		});
	});

	// badge data retrieved
	if (badges) return { data: badges };
	else return { data: null };
});
