import type { ApiClient } from '@twurple/api';

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

	// ID provided
	if (id) user = await twitchAPI.users.getUserById(Number(id));
	// only name provided
	else if (name) user = await twitchAPI.users.getUserByName(name as string);
	// error
	else
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			data: 'Missing "id" or "name" query parameters.',
		});

	// user data retrieved
	if (user)
		return {
			data: {
				id: user.id,
				broadcasterType: user.broadcasterType,
				creationDate: user.creationDate,
				description: user.description,
				displayName: user.displayName,
				name: user.name,
				offlinePlaceholderUrl: user.offlinePlaceholderUrl,
				profilePictureUrl: user.profilePictureUrl,
				type: user.type,
			},
		};
	// user not found
	else
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			data: 'Specified user does not seem to exist.',
		});
});
