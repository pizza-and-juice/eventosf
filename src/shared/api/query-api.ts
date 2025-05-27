import axios from 'axios';

import endpoints from '../../modules/data-fetching/endpoints';

import {
	AddProjectSuccessResponse,
	AllProjectsSuccessResponse,
	DeleteProjectSuccessResponse,
	OneProjectSuccessResponse,
	PatchProjectSuccessResponse,
	ProjectsSuccessResponse,
	SearchProjectsSuccessResponse,
} from './responses/projects/projects.response';

import { GoogleUserInfoSuccessResponse } from './responses/user/user.response';
import {
	GoogleAuthSuccessResponse,
	SessionSuccessResponse,
	TwitterAuthSuccessResponse,
} from './responses/auth/auth.response';
import { ProjectsFilters } from '../models/projects/project-filters.model';
import {
	CommentSuccessResponse,
	DeleteCommentSuccessResponse,
	PostCommentSuccessResponse,
} from './responses/projects/project-comment.response';
import { AddProjectDto } from './dto/project/add-project.dto';
import { AddProjectCommentDto } from './dto/project/add-comment.dto';
import { EditProfileInfoDto } from './dto/profile/edit-profile.dto';
import {
	DeleteUpvoteSuccessResponse,
	PostUpvoteSuccessResponse,
	UserUpvotesSuccessResponse,
} from './responses/projects/project-upvote.response';
import {
	ChartDataSuccessResponse,
	ProjectsStatusSuccessResponse,
	TotalGrantSuccessResponse,
	TotalSubmissionsSuccessResponse,
	TotalUserSuccessResponse,
	UsersDataSuccessResponse,
} from './responses/admin/dashboard.responses';
import { GetPresignedUrlSuccessResponse } from './responses/image/images.response';
import { EditProjectDto } from './dto/project/edit-project.dto';

const QueryApi = {
	// POST
	images: {
		getPresignedUrl: async function (
			filename: string
		): Promise<GetPresignedUrlSuccessResponse> {
			const res = await axios<GetPresignedUrlSuccessResponse>({
				method: 'GET',
				url: endpoints.images.getPresignedUrl.replace(/:filename/, filename),
			});

			return res.data;
		},

		getMultiplePresignedUrls: async function (
			filenames: string[]
		): Promise<GetPresignedUrlSuccessResponse[]> {
			const str = JSON.stringify(filenames);
			const encoded = encodeURIComponent(str);

			const res = await axios<GetPresignedUrlSuccessResponse[]>({
				method: 'GET',
				url: endpoints.images.getMultiplePresignedUrls.replace(/:filenames/, encoded),
			});

			return res.data;
		},

		postImage: async function (presignedUrl: string, file: File): Promise<any> {
			const res = await axios({
				method: 'PUT',
				url: presignedUrl,
				data: file,
				headers: {
					'Content-Type': file.type,
					'x-amz-acl': 'public-read',
				},
			});

			return res.data;
		},

		rollBackImage: async function (presignedUrl: string): Promise<any> {
			const res = await axios({
				method: 'DELETE',
				url: presignedUrl,
			});

			return res.data;
		},
	},

	projects: {
		getAll: async function (
			filters: ProjectsFilters,
			page: number = 0,
			limit: number = 5
		): Promise<AllProjectsSuccessResponse> {
			const { deploymentType, sortType } = filters;

			const params = new URLSearchParams();
			if (deploymentType) params.append('projectDeployment', deploymentType);
			if (sortType) params.append('sort', sortType);
			params.append('page', page.toString());
			params.append('limit', limit.toString());

			const res = await axios<AllProjectsSuccessResponse>({
				method: 'GET',
				url: endpoints.projects.getAll.replace(/:params/, params.toString()),
			});

			return res.data;
		},
		getOne: async function (projectId: string | number): Promise<OneProjectSuccessResponse> {
			const res = await axios<OneProjectSuccessResponse>({
				method: 'GET',
				url: endpoints.projects.getOne.replace(/:id/, projectId as string),
			});

			return res.data;
		},

		searchProjects: async function (
			searchTerm: string
		): Promise<SearchProjectsSuccessResponse> {
			const res = await axios<SearchProjectsSuccessResponse>({
				method: 'GET',
				url: endpoints.projects.search.replace(/:name/, searchTerm), // Include the searchTerm as a query parameter
			});
			return res.data;
		},

		addUpvote: async function (
			userId: string,
			projectId: string | number
		): Promise<PostUpvoteSuccessResponse> {
			const res = await axios<PostUpvoteSuccessResponse>({
				method: 'POST',
				url: endpoints.projects.addUpvote,
				data: {
					uid: userId,
					projectId: projectId,
				},
				withCredentials: true,
			});

			return res.data;
		},

		delUpvote: async function (
			userId: string,
			projectId: string | number
		): Promise<DeleteUpvoteSuccessResponse> {
			const res = await axios<DeleteUpvoteSuccessResponse>({
				method: 'DELETE',
				url: endpoints.projects.removeUpvote,
				data: {
					uid: userId,
					projectId,
				},
				withCredentials: true,
			});

			return res.data;
		},

		getComments: async function (projectId: string | number): Promise<CommentSuccessResponse> {
			const res = await axios<CommentSuccessResponse>({
				method: 'GET',
				url: endpoints.comments.get(projectId as string),
			});

			return res.data;
		},

		addComment: async function (
			commentDto: AddProjectCommentDto
		): Promise<PostCommentSuccessResponse> {
			const finalDto = { ...commentDto };
			// @ts-expect-error - We don't want to send this to the server
			delete finalDto.randomId;

			const res = await axios<PostCommentSuccessResponse>({
				method: 'POST',
				url: endpoints.comments.add,
				data: finalDto,
				withCredentials: true,
			});

			return res.data;
		},
		deleteComment: async function (commentId: number): Promise<DeleteCommentSuccessResponse> {
			const res = await axios<DeleteCommentSuccessResponse>({
				method: 'DELETE',
				url: endpoints.comments.deleteComment, // Assuming this resolves to https://{{host}}/comment/
				data: {
					id: commentId,
				},
				withCredentials: true,
			});

			return res.data;
		},

		add: async function (
			projectFormData: AddProjectDto | EditProjectDto
		): Promise<AddProjectSuccessResponse> {
			const res = await axios<AddProjectSuccessResponse>({
				method: 'POST',
				url: endpoints.projects.add,
				data: projectFormData,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true,
			});

			return res.data;
		},
		editProject: async function (
			formData: EditProjectDto
		): Promise<PatchProjectSuccessResponse> {
			const res = await axios<PatchProjectSuccessResponse>({
				method: 'PATCH',
				url: endpoints.projects.editProject,
				data: formData,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true,
			});

			return res.data;
		},

		delete: async function (projectId: string | number): Promise<DeleteProjectSuccessResponse> {
			const res = await axios<DeleteProjectSuccessResponse>({
				method: 'DELETE',
				url: endpoints.projects.delete,
				data: {
					id: projectId,
				},
				withCredentials: true,
			});

			return res.data;
		},
	},

	auth: {
		googleSignin: async function (tokenId: string): Promise<GoogleAuthSuccessResponse> {
			const res = await axios<GoogleAuthSuccessResponse>({
				method: 'POST',
				url: endpoints.auth.googleSignIn,
				data: {
					idToken: tokenId,
				},
				withCredentials: true,
			});

			return res.data;
		},
		twitterSignin: async function (token: string): Promise<TwitterAuthSuccessResponse> {
			const res = await axios<TwitterAuthSuccessResponse>({
				method: 'POST',
				url: endpoints.auth.twitterSignIn,
				data: {
					idToken: token,
				},
				withCredentials: true,
			});

			return res.data;
		},

		logout: async function (): Promise<any> {
			const res = await axios({
				method: 'POST',
				url: endpoints.auth.logout,
				withCredentials: true,
			});

			return res.data;
		},

		session: async function (): Promise<SessionSuccessResponse> {
			const res = await axios<SessionSuccessResponse>({
				method: 'GET',
				url: endpoints.auth.session,
				withCredentials: true,
			});

			return res.data;
		},
	},

	user: {
		googleGetInfo: async function (userId: string): Promise<GoogleUserInfoSuccessResponse> {
			const res = await axios<GoogleUserInfoSuccessResponse>({
				method: 'GET',
				url: endpoints.user.googleGetInfo.replace(/:id/, userId),
			});

			return res.data;
		},

		getUpvotedProjects: async function (
			userId: string,
			page: number = 0,
			limit: number = 1000
		): Promise<UserUpvotesSuccessResponse> {
			const params = new URLSearchParams();
			params.append('page', page.toString());
			params.append('limit', limit.toString());

			const res = await axios<UserUpvotesSuccessResponse>({
				method: 'GET',
				url: endpoints.user.getUpvotes
					.replace(/:userId/, userId)
					.replace(/:params/, params.toString()),
			});

			return res.data;
		},

		getUpvotedProject: async function (
			userId: string
			/*,projectId: number */
		): Promise<UserUpvotesSuccessResponse> {
			const params = new URLSearchParams();
			params.append('page', '0');
			params.append('limit', '1000');

			const res = await axios<UserUpvotesSuccessResponse>({
				method: 'GET',
				url: endpoints.user.getUpvotes
					.replace(/:userId/, userId)
					.replace(/:params/, params.toString()),
			});

			return res.data;
		},
	},

	profile: {
		googleGetInfo: async function (userId: string): Promise<GoogleUserInfoSuccessResponse> {
			const res = await axios<GoogleUserInfoSuccessResponse>({
				method: 'GET',
				url: endpoints.user.googleGetInfo.replace(/:id/, userId),
			});

			return res.data;
		},

		getUpvotedProjects: async function (userId: string): Promise<ProjectsSuccessResponse> {
			const res = await axios<ProjectsSuccessResponse>({
				method: 'GET',
				url: endpoints.profile.upvotedProjects.replace(/:userId/, userId),
			});

			return res.data;
		},

		getSubmittedProjects: async function (userId: string): Promise<ProjectsSuccessResponse> {
			const res = await axios<ProjectsSuccessResponse>({
				method: 'GET',
				url: endpoints.profile.submittedProjects.replace(/:userId/, userId),
			});

			return res.data;
		},

		editProfile: async function (data: EditProfileInfoDto): Promise<EditProfileInfoDto> {
			const res = await axios<EditProfileInfoDto>({
				method: 'PATCH',
				url: endpoints.profile.editProfile,
				data: data,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true,
			});

			return res.data;
		},
	},
	// to fetch total submissions
	admin: {
		getTotalSubmissions: async function (): Promise<TotalSubmissionsSuccessResponse> {
			const res = await axios<TotalSubmissionsSuccessResponse>({
				method: 'GET',
				url: endpoints.admin.getTotalSubmissions,
				withCredentials: true,
			});

			return res.data;
		},

		getTotalUsers: async function (): Promise<TotalUserSuccessResponse> {
			const res = await axios({
				method: 'GET',
				url: endpoints.admin.getTotalUsers,
				withCredentials: true,
			});

			return res.data;
		},

		getTotalGrants: async function (): Promise<TotalGrantSuccessResponse> {
			const res = await axios<TotalGrantSuccessResponse>({
				method: 'GET',
				url: endpoints.admin.getTotalGrants,
				withCredentials: true,
			});

			return res.data;
		},

		getProjectsStatus: async function (): Promise<ProjectsStatusSuccessResponse> {
			const res = await axios({
				method: 'GET',
				url: endpoints.admin.getProjectStatus,
				withCredentials: true,
			});

			return res.data;
		},

		getUsersData: async function (): Promise<UsersDataSuccessResponse> {
			const res = await axios<UsersDataSuccessResponse>({
				method: 'GET',
				url: endpoints.admin.getUsersData,
				withCredentials: true,
			});

			return res.data;
		},

		getGrantChartData: async function (
			time: 'yearly' | 'monthly' | 'weekly'
		): Promise<ChartDataSuccessResponse> {
			const res = await axios<ChartDataSuccessResponse>({
				method: 'GET',
				url: endpoints.admin.getGrantChartData.replace(/:time/, time),
				withCredentials: true,
			});

			return res.data;
		},
	},
};

export default QueryApi;
