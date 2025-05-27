export type TotalSubmissionsSuccessResponse = {
	total_submissions: number;
};

export type TotalUserSuccessResponse = {
	total_users: number;
};

export type ProjectsStatusSuccessResponse = {
	rejected: number;
	under_review: number;
	accepted: number;
};

export type TotalGrantSuccessResponse = {
	totalGrant: number;
};

export type UsersDataSuccessResponse = {
	googleUsers: number;
	xUsers: number;
};

export type ChartDataSuccessResponse = {
	[key: string]: number;
};
