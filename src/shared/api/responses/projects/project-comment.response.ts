import { CommentModel } from 'src/shared/models/projects/project-comment.model';

export type CommentSuccessResponse = CommentModel[];

export type PostCommentSuccessResponse = {
	id: number;
	message: string;
};

export type DeleteCommentSuccessResponse = {
	message: string;
};
