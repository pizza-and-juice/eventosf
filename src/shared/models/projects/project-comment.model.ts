export type User = {
	name: string;
	pictureUrl: string;
};

export type CommentModel = {
	id: number;
	userId: string;
	projectId: number;
	comment: string;
	date: string;
	user: User;
	replies: CommentModel[]; // Assuming replies are of the same structure as CommentModel
};
