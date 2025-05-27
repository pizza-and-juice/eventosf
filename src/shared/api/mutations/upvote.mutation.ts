// prettier-ignore
import queryClient from "@shared/instances/query-client.instance";
import QUERY_KEYS from 'src/static/query.keys';
import { AllProjectsSuccessResponse } from '../responses/projects/projects.response';
import { UserUpvotesSuccessResponse } from '../responses/projects/project-upvote.response';
import {
	MultipleProjectsModel,
	OneProjectModel,
	ProjectUpvotedByUser,
} from 'src/shared/models/projects/project.model';

type UpvoteMutationContext_List = {
	projectId: number;
	userId: string;
	page: number;
	filters: any;
	operation: 0 | 1; // 1 = add, 0 = del
};

/**
 * when an upvote happens whe need to make sure
 * to update the projects list and the project
 *
 * 1. cancel any outgoing refetches (so they don't overwrite our optimistic update)
 * 2. Snapshot the previous value
 *
 * @param context whe
 * @returns
 */

export async function onUpvoteMutate_ProjectsList(context: UpvoteMutationContext_List) {
	const { projectId, userId, page, filters, operation } = context;

	const keyProjects = [QUERY_KEYS.GET_ALL_PROJECTS, page, filters];
	const keyUserUpvotes = [QUERY_KEYS.GET_USER_ALL_UPVOTES, userId];

	// 1 = add, 0 = del
	// cancel any outgoing refetches (so they don't overwrite our optimistic update)
	await queryClient.cancelQueries(keyProjects);
	await queryClient.cancelQueries(keyUserUpvotes);

	// Snapshot the previous value
	const prevProjectsRes = queryClient.getQueryData(keyProjects) as AllProjectsSuccessResponse;

	// prettier-ignore
	const prevUserUpvotesRes = queryClient.getQueryData(keyUserUpvotes) as UserUpvotesSuccessResponse;

	// update the project list
	const newProjects = prevProjectsRes.projects.map((p: MultipleProjectsModel) =>
		p.id === projectId ? { ...p, totalUpvotes: p.totalUpvotes + (operation ? 1 : -1) } : p
	);

	let newUserUpvotes: ProjectUpvotedByUser[];
	if (operation) {
		newUserUpvotes = prevUserUpvotesRes.upvotedProjects.concat({
			id: projectId,
		});
	} else {
		newUserUpvotes = prevUserUpvotesRes.upvotedProjects.filter((p) => p.id !== projectId);
	}

	const newProjectsRes = { ...prevProjectsRes, projects: newProjects };
	const newUserUpvotesRes = { ...prevUserUpvotesRes, upvotedProjects: newUserUpvotes };

	// optimistic update
	queryClient.setQueryData(keyProjects, newProjectsRes);
	queryClient.setQueryData(keyUserUpvotes, newUserUpvotesRes);

	// return a context object with the snapshotted values
	return { prevProjectsRes, prevUserUpvotesRes };
}

type UpvoteMutationContext_singleProject = {
	projectId: number;
	userId: string;
	operation: 0 | 1; // 1 = add, 0 = del
};

export async function onUpvoteMutate_singleProject(context: UpvoteMutationContext_singleProject) {
	// 1 = add, 0 = del
	// cancel any outgoing refetches (so they don't overwrite our optimistic update)

	const { projectId, userId, operation } = context;

	const projectKey = [QUERY_KEYS.GET_ONE_PROJECT, projectId];
	const upvoteKey = [QUERY_KEYS.GET_USER_ONE_UPVOTE, userId];

	await queryClient.cancelQueries(projectKey);
	await queryClient.cancelQueries(upvoteKey);

	// Snapshot the previous value
	const prevProject: OneProjectModel = queryClient.getQueryData(projectKey) as OneProjectModel;
	const prevUserUpvote: UserUpvotesSuccessResponse = queryClient.getQueryData(
		upvoteKey
	) as UserUpvotesSuccessResponse;

	// update the project list
	const newProject: OneProjectModel = Object.assign(prevProject, {
		totalUpvotes: prevProject.totalUpvotes + (operation ? 1 : -1),
	});

	let newUserUpvote: ProjectUpvotedByUser[];
	if (operation) {
		newUserUpvote = prevUserUpvote.upvotedProjects.concat({
			id: projectId,
		});
	} else {
		newUserUpvote = prevUserUpvote.upvotedProjects.filter((p) => p.id !== projectId);
	}

	const newData = {
		...prevUserUpvote,
		upvotedProjects: newUserUpvote,
	};

	// optimistic update
	queryClient.setQueryData(projectKey, newProject);
	queryClient.setQueryData(upvoteKey, newData);

	setTimeout(() => {
		// invalidate other queries
		queryClient.refetchQueries(QUERY_KEYS.GET_ALL_PROJECTS);
		queryClient.refetchQueries(QUERY_KEYS.GET_USER_ALL_UPVOTES);
	}, 1000);

	// return a context object with the snapshotted values
	return { prevProject, prevUserUpvote };
}
