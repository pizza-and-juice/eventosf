import { useContext, useRef } from 'react';

import ModalService from 'src/shared/services/modal/modal.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import APP_MODALS from 'src/static/enums/app.modals';
import CommentComponent from 'src/components/internal/comments/comments.component';
import Button from 'src/components/internal/button/button.component';
import QueryApi from 'src/shared/api/query-api';
import { CommentModel } from 'src/shared/models/projects/project-comment.model';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { delCommentSuccess, delReplySuccess } from 'src/shared/api/mutations/comments.mutation';

type ExampleModalProps = {
	modalId: APP_MODALS;
	data: {
		comment: CommentModel;
		isReply: boolean;
		parentId?: number;
	};
};

export default function DeleteCommentModal({ modalId, data }: ExampleModalProps) {
	// *~~~ modal logic ~~~* //
	//#region
	const modalRef = useRef<HTMLDivElement>(null);
	const modalSvc = useContext<ModalService>(ModalSvcContext);

	function close() {
		const modalElmt = modalRef.current;
		if (!modalElmt) return;

		modalElmt.classList.add('animate-fadeOut');

		function handleAnimationEnd(e: any) {
			if (!modalElmt) return;
			if (e.animationName !== 'fadeOut') return;

			modalSvc.closeModal(modalId);
			modalElmt.classList.remove('animate-fadeOut');
			modalElmt.removeEventListener('animationend', handleAnimationEnd);
			// modalElmt.add('animate-fadeIn');
		}

		modalElmt.addEventListener('animationend', handleAnimationEnd);
	}
	// #endregion

	async function handleDeleteComment() {
		delComment.mutate(data.comment.id);
	}

	const delComment = useMutation({
		mutationFn: (commentId: number) => QueryApi.projects.deleteComment(commentId),
		onSuccess: () => {
			if (!data.isReply) {
				delCommentSuccess({
					commentId: data.comment.id,
					projectId: data.comment.projectId,
				});
			} else {
				delReplySuccess({
					commentId: data.comment.id,
					projectId: data.comment.projectId,
					parentId: data.parentId!,
				});
			}
			close();
		},
		onError: () => {
			toast.error('Error deleting comment');
			close();
		},
	});

	return (
		// <!-- modal size manager -->
		<div
			className={`w-full max-w-2xl max-h-full animate-fadeIn pointer-events-auto`}
			tabIndex={-1}
			ref={modalRef}
		>
			{/* <!-- Modal box --> */}
			<div className="relative dark:bg-dark-800 bg-white rounded-lg shadow">
				{/* Modal header */}
				<div className="flex items-center justify-between sm:px-8 px-4  pt-6 ">
					<h1 className="text-black dark:text-white text-2xl font-bold leading-[36px]">
						Delete Comment
					</h1>
					<button>
						<i onClick={close} className="fas fa-times text-xl dark:text-white"></i>
					</button>
				</div>

				{/* <!-- Modal body --> */}
				<div className="space-y-6 sm:px-8 px-4 pb-8 pt-2">
					<h2 className="text-black dark:text-white text-sm !leading-[26px] sm:pb-3 ">
						Are you sure you want to delete this comment?
					</h2>
					{/* Comment */}
					<div className="pointer-events-none bg-agrey-50 dark:bg-agrey-800 py-3 rounded-xl">
						<CommentComponent
							name={data.comment.user.name} // You'll need to get the user's name from the userId somehow
							profile_picture={data.comment.user.pictureUrl} // Replace this path accordingly
							// replies={comment.replies} // If your API provides the number of replies
							date={data.comment.date} // Format this date as needed
							userId={data.comment.userId}
						>
							{data.comment.comment}
						</CommentComponent>
					</div>

					{/* Footer */}
					<div className="flex justify-end items-center">
						{/* we still need a delete comment endpoint */}
						<Button
							className={`blue small ${delComment.isLoading && 'loading'}`}
							onClick={handleDeleteComment} // Attach the onClick event handler
						>
							Delete
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
