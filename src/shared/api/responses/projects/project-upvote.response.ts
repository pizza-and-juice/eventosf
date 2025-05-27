import { ProjectUpvotedByUser } from 'src/shared/models/projects/project.model';

export type PostUpvoteSuccessResponse = {
	message: string;
};

export type DeleteUpvoteSuccessResponse = {
	message: string;
};

export type UserUpvotesSuccessResponse = {
	upvotedProjects: ProjectUpvotedByUser[];
	metadata: {
		startIndex: number;
		previousPage: number;
		itemsPerPage: number;
		nextPage: number;
		endIndex: number;
		totalPages: number;
		currentPage: number;
	};
};
