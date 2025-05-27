export type GoogleAuthSuccessResponse = {
	id: string;
	email: string;
	name: string;
	pictureUrl: string;
	// locale: string;
	// familyName: string;
	// givenName: string;
	// emailVerified: false;
	role: 'Admin' | 'User' | '';
};

export type SessionSuccessResponse = {
	id: string;
	// have default value for img
	email: string;
	name: string;
	pictureUrl: string;
	bio: string;
	// emailVerified: false;
	loginMethod: string;
	role: 'Admin' | 'User' | '';
};

export type TwitterAuthSuccessResponse = {
	// emailVerified: booleab;
	// givenName: 'Sebastian Madrid';
	id: string;
	name: string;
	loginMethod: string;
	pictureUrl: string | undefined;
	role: 'Admin' | 'User' | '';
};
