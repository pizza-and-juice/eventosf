import { useContext, useRef } from 'react';

import ModalService from 'src/shared/services/modal/modal.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import APP_MODALS from 'src/static/enums/app.modals';
import Button from 'src/components/internal/button/button.component';
import QueryApi from 'src/shared/api/query-api';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { OneProjectModel } from 'src/shared/models/projects/project.model';
import ProjectComponent from 'src/components/not-reusable/project/project.nr-component';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'src/static/router.data';

type DelProjectModalProps = {
	modalId: APP_MODALS;
	data: {
		project: OneProjectModel;
	};
};

export default function DeleteProjectModal({ modalId, data }: DelProjectModalProps) {
	// *~~~ dependencies ~~~* //
	const navigate = useNavigate();

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

	async function handleDeleteProject() {
		delProject.mutate(data.project.id);
	}

	const delProject = useMutation({
		mutationFn: (projectId: number) => QueryApi.projects.delete(projectId),
		onSuccess: () => {
			navigate(ROUTES.projects.root);
			toast.success('Project deleted successfully');
			close();
		},
		onError: () => {
			toast.error('Error deleting project');
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
						Delete Project
					</h1>
					<button>
						<i onClick={close} className="fas fa-times text-xl dark:text-white"></i>
					</button>
				</div>

				{/* <!-- Modal body --> */}
				<div className="space-y-6 sm:px-8 px-4 pb-8 pt-2">
					<h2 className="text-black dark:text-white text-sm !leading-[26px] sm:pb-3 ">
						Are you sure you want to delete this project?
					</h2>
					{/* project */}
					<div className="pointer-events-none bg-agrey-50 dark:bg-agrey-800 py-3 rounded-xl">
						<ProjectComponent
							isUpvoted={false}
							id={data.project.id}
							imageSrc={data.project.logoPath}
							title={data.project.projectName}
							description={data.project.bio}
							categories={data.project.categories}
							upvotes={data.project.totalUpvotes}
							onCheckClick={() => {}}
							onUpvoteClick={() => {}}
							onCommentClick={() => {}}
							totalComments={data.project.totalComments}
							renderComments={false}
							renderUpvote={false}
						/>
					</div>

					{/* Footer */}
					<div className="flex justify-end items-center">
						{/* we still need a delete comment endpoint */}
						<Button
							className={`blue small ${delProject.isLoading && 'loading'}`}
							onClick={handleDeleteProject} // Attach the onClick event handler
						>
							Delete
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
