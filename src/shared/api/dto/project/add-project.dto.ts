export type AddProjectDto = {
	projectName: string;
	bio: string;
	projectWebsite: string;
	socialMediaUrl: string;
	description: string;

	logo: string;
	fileUpload1: string;
	fileUpload2: string;
	fileUpload3: string;

	currency: string;
	grantAmount: number;

	framework: string;

	// projectFramework: string;
	projectDeployment: string;
	categories: string;
	telegramUsername: string;
	email: string;
	twitterLinkedinUrl: string;
	walletAddress: string;

	gUserId: string;
};
