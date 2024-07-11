import type { ApiClient } from '@twurple/api';

export default defineEventHandler(async (event) => {
	// get query params
	const { id } = getQuery(event);

	// get twitch api (twurple) client
	const twitchAPI: ApiClient = event.context.twitchAPI;

	// failed to connect
	if (!twitchAPI)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			data: 'Unable to reach Twitch API.',
		});

	// get user
	let user = await twitchAPI.users.getUserById(Number(id));

	// no user found
	if (!user)
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			data: 'Specified user does not seem to exist.',
		});

	// get stream
	let stream = await user?.getStream();

	// stream data retrieved
	if (stream)
		return {
			data: {
				id: stream.id,
				gameId: stream.gameId,
				gameName: stream.gameName,
				isMature: stream.isMature,
				language: stream.language,
				startDate: stream.startDate,
				tags: stream.tags,
				thumbnailUrl: stream.thumbnailUrl,
				title: stream.title,
				type: stream.type,
				userDisplayName: stream.userDisplayName,
				userId: stream.userId,
				userName: stream.userName,
				viewers: stream.viewers,
			},
		};
	// not live
	else return { data: null };
});
