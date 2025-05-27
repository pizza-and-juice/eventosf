import QUERY_KEYS from 'src/static/query.keys';
import { AddProjectCommentDto } from '../dto/project/add-comment.dto';
import queryClient from '@shared/instances/query-client.instance';
import { CommentModel } from 'src/shared/models/projects/project-comment.model';
import { PostCommentSuccessResponse } from '../responses/projects/project-comment.response';

// *~~~ post comment optimistic update logic ~~~*

type postCommentMutCtx = {
	commentDto: AddProjectCommentDto;
	projectId: number;

	userData: {
		name: string;
		pfp: string;
	};
};

// optimisitc update
export async function addCommentOptimisicUpdate(context: postCommentMutCtx) {
	const { commentDto, projectId, userData } = context;

	const key = [QUERY_KEYS.GET_PROJECT_COMMENTS, projectId];

	await queryClient.cancelQueries(key);

	const prevComments: CommentModel[] = queryClient.getQueryData(key) as CommentModel[];

	const options = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	};

	// check if is a reply
	let newComments;

	if (!commentDto.replyingTo) {
		newComments = prevComments.concat({
			comment: commentDto.comment,
			date: new Date().toLocaleString('en-US', options as any),
			userId: commentDto.userId,
			id: commentDto.randomId!, // this means this is a optimistic update, it won't be interactible until the server responds
			projectId: commentDto.projectId,
			user: {
				// Assuming you have the necessary user data available. Replace these with actual values.
				name: userData.name,
				pictureUrl: userData.pfp,
			},
			replies: [],
		});
	} else {
		const replyComment = {
			comment: commentDto.comment,
			date: new Date().toLocaleDateString('en-US', options as any),
			userId: commentDto.userId,
			id: commentDto.randomId!,
			projectId: commentDto.projectId,
			user: {
				// Assuming you have the necessary user data available. Replace these with actual values.
				name: userData.name,
				pictureUrl: userData.pfp,
			},
			replies: [],
		};

		newComments = prevComments.map((comment) => {
			if (comment.id.toString() === commentDto.replyingTo) {
				return {
					...comment,
					replies: comment.replies.concat(replyComment),
				};
			}
			return comment;
		});
	}

	queryClient.setQueryData(key, newComments);

	return { prevComments };
}

type commentSuccessMutCtx = {
	res: PostCommentSuccessResponse;
	projectId: number;
	commentDto: AddProjectCommentDto;
};

// on success
export async function addCommentSuccess(ctx: commentSuccessMutCtx) {
	const { res, projectId, commentDto } = ctx;

	// update the comment with the actual id
	const key = [QUERY_KEYS.GET_PROJECT_COMMENTS, projectId];

	const currentValue = queryClient.getQueryData(key) as CommentModel[];

	let newComments = [];
	if (commentDto.replyingTo) {
		newComments = currentValue.map((comment) => {
			if (comment.id.toString() === commentDto.replyingTo) {
				return {
					...comment,
					replies: comment.replies.map((reply) => {
						if (reply.id === commentDto.randomId!) {
							return {
								...reply,
								id: res.id,
							};
						}
						return reply;
					}),
				};
			}
			return comment;
		});
	} else {
		newComments = currentValue.map((comment) => {
			if (comment.id === commentDto.randomId!) {
				return {
					...comment,
					id: res.id,
				};
			}
			return comment;
		});
	}

	queryClient.setQueryData(key, newComments);
}

type commentFailureMutCtx = {
	projectId: number;
	context: { prevComments: CommentModel[] } | undefined;
};

// rollback in case of failure

export async function addCommentFailure(ctx: commentFailureMutCtx) {
	const { projectId } = ctx;

	const key = [QUERY_KEYS.GET_PROJECT_COMMENTS, projectId];

	const prevComments = ctx.context!.prevComments;

	queryClient.setQueryData(key, prevComments);
}

// *~~~ del comment optimistic update logic ~~~*

type delCommentSuccessCtx = {
	commentId: number;
	projectId: number;
};

// on success
export async function delCommentSuccess(ctx: delCommentSuccessCtx) {
	const { projectId, commentId } = ctx;

	// update the comment with the actual id
	const key = [QUERY_KEYS.GET_PROJECT_COMMENTS, projectId];

	const currentValue = queryClient.getQueryData(key) as CommentModel[];

	const newComments = currentValue.filter((comment) => comment.id !== commentId);

	queryClient.setQueryData(key, newComments);
}

type delReplySuccessCtx = {
	parentId: number;
	commentId: number;
	projectId: number;
};

export async function delReplySuccess(ctx: delReplySuccessCtx) {
	const { parentId, commentId, projectId } = ctx;

	const key = [QUERY_KEYS.GET_PROJECT_COMMENTS, projectId];

	const currentValue = queryClient.getQueryData(key) as CommentModel[];

	const newComments = currentValue.map((comment) => {
		if (comment.id === parentId) {
			return {
				...comment,
				replies: comment.replies.filter((reply) => reply.id !== commentId),
			};
		}
		return comment;
	});

	queryClient.setQueryData(key, newComments);
}
