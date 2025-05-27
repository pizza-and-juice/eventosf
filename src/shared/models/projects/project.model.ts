export type MultipleProjectsModel = {
	id: number;
	projectName: string;
	projectWebsite: string;
	logoPath: string;
	bio: string;
	description: string;
	projectDeployment: string;
	framework: string;
	categories: string[];

	telegramUsername: string;
	email: string;
	twitterLinkedinUrl: string;
	walletAddress: string;
	currency: string;
	grantAmount: number;

	accepted: boolean;
	rejected: string;

	totalUpvotes: number;
	totalComments: number;
};

export type OneProjectModel = {
	id: number;
	projectName: string;
	projectWebsite: string;
	socialMediaUrl: string;
	logoPath: string;
	bio: string;
	description: string;
	fileUpload1: string;
	fileUpload2: string;
	fileUpload3: string;
	projectDeployment: string;
	framework: string;
	categories: string[];

	telegramUsername: string;
	email: string;
	twitterLinkedinUrl: string;

	grantAmount: number;
	currency: string;

	walletAddress: string;

	totalUpvotes: number;
	totalComments: number;

	accepted: boolean;
	rejected: boolean;

	creator: {
		id: string;
		email: string;
		name: string;
		pictureUrl: string;
		locale: string;
		familyName: string;
		givenName: string;
		emailVerified: boolean;
	};
};

export type ProjectUpvotedByUser = {
	id: number;
};
