export type GoogleUserInfoSuccessResponse = {
	id: string;
	email: string;
	name: string;
	pictureUrl: string;
	locale: string;
	familyName: string;
	givenName: string;
	emailVerified: boolean;
	bio: string;
	telegramUrl: string,
    twitterUrl: string,
    linkedinUrl: string,
	customImageUUID: string;
};

export type FetchUserData = GoogleUserInfoSuccessResponse[];
