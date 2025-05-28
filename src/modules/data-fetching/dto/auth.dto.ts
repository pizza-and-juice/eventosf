export type RegisterDto = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
};

export type LoginDto = {
	email: string;
	password: string;
};
