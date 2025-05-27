export type AddProjectCommentDto = {
	userId: string;
	projectId: number;
	comment: string;
	replyingTo?: string;
	randomId: number;
};
