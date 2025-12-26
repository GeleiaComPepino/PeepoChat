import {
	type HelixBroadcasterType,
	type HelixStreamType,
	type HelixUserType,
} from '@twurple/api';

declare global {
	// Local Settings
	interface ISettings {
		// Current state of Sidebar visibility
		isSidebarExpanded: boolean;
	}

	// Chat Badge List
	interface IChatBadgeList {
		// badge name
		[key: string]: {
			// badge version
			[key: string]: {
				title: string;
				description: string;
				url: string;
				previewUrl: string;
				clickAction: string | null;
				clickUrl: string | null;
			};
		};
	}

	// Twitch User
	interface ITwitchUser {
		type: HelixUserType;
		id: string;
		name: string;
		displayName: string;
		broadcasterType: HelixBroadcasterType;
		creationDate: string;
		description: string;
		offlinePlaceholderUrl: string;
		profilePictureUrl: string;
	}

	// Twitch Stream
	interface ITwitchStream {
		id: string;
		type: HelixStreamType;
		title: string;
		gameId: string;
		gameName: string;
		isMature: boolean;
		language: string;
		startDate: string;
		tags: string[];
		thumbnailUrl: string;
		userDisplayName: string;
		userId: string;
		userName: string;
		viewers: number;
	}

	// Channel
	interface IChannel {
		name: string;
		avatarURL: string;
		live: boolean;
		platform: {
			twitch?: string;
		};
	}
}
