import { MultipleProjectsModel, OneProjectModel } from 'src/shared/models/projects/project.model';

export type AllProjectsSuccessResponse = {
	projects: MultipleProjectsModel[];
	metadata: {
		totalPages: number;
		currentPage: number;
		itemsPerPage: number;
		totalItems: number;
		nextPage: number; // -1 if no next page
		previousPage: number; // -1 if no previous page
		startIndex: number; // 0 based
		endIndex: number;
	};
};

export type SearchProjectsSuccessResponse = MultipleProjectsModel[];

export type OneProjectSuccessResponse = OneProjectModel;

export type ProjectsSuccessResponse = MultipleProjectsModel[];

export type AddProjectSuccessResponse = {
	id: string;
	message: string;
};

export type PatchProjectSuccessResponse = {
	message: string;
};

export type DeleteProjectSuccessResponse = {
	message: string;
};
