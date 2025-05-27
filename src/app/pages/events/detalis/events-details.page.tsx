/* eslint-disable no-mixed-spaces-and-tabs */

import { signal } from '@preact/signals-react';
import { useFormik } from 'formik';
import { createContext, useContext, useEffect, useState } from 'react';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFloating, offset } from '@floating-ui/react';
import Button from 'src/components/internal/button/button.component';
import CommentComponent from 'src/components/internal/comments/comments.component';
import Tag from 'src/components/internal/tags/tags.component';
import Upvote from 'src/components/internal/upvote/upvote.component';
import CommentsSkeleton from 'src/components/skeletons/comments/comments.skeleton';
import ProjectMainDetailsSkeleton from 'src/components/skeletons/project/main-details/project-main-details.skeleton';
import { AddProjectCommentDto } from 'src/shared/api/dto/project/add-comment.dto';
import QueryApi from 'src/shared/api/query-api';
import { CommentModel } from 'src/shared/models/projects/project-comment.model';
import { OneProjectModel } from 'src/shared/models/projects/project.model';
import AuthSvcContext from 'src/shared/services/auth/auth.context';
import AuthService from 'src/shared/services/auth/auth.service';
import DocTitleSvcContext from 'src/shared/services/doc-title/doc-title.context';
import DocumentTitleService from 'src/shared/services/doc-title/doc-title.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import ModalService from 'src/shared/services/modal/modal.service';
import UserSvcContext from 'src/shared/services/user/user.context';
import UserService from 'src/shared/services/user/user.service';
import { isLinkedInURL } from 'src/shared/utils/functions';
import APP_MODALS from 'src/static/enums/app.modals';
import QUERY_KEYS from 'src/static/query.keys';
import ROUTES from 'src/static/router.data';
import ShareProjectPanel from 'src/components/not-reusable/share-project/share-project.nr.component';
import { onUpvoteMutate_singleProject } from 'src/shared/api/mutations/upvote.mutation';
import {
	addCommentFailure,
	addCommentOptimisicUpdate,
	addCommentSuccess,
} from 'src/shared/api/mutations/comments.mutation';
import api from '@modules/data-fetching/api';
import {
	EventDetailsPageCtx,
	EventDetailsPageCtxType,
} from '@modules/events/details/events-details.context';
import EventsDetailsView from '@modules/events/details/event-details.view';
import SummaryTab from '@modules/events/details/tabs/summary.tab';
import AttendeesTab from '@modules/events/details/tabs/attendees.tab';

type QueryCtxType = {
	projectQuery: UseQueryResult<OneProjectModel, unknown>;
};

// @ts-expect-error - untyped library
const QueryCtx = createContext<QueryCtxType>();

function QueryComponent({ children }: { children: React.ReactNode }) {
	const params = useParams<{ id: string }>();
	const projectId = Number(params.id);

	// *~~~ http req ~~~* //
	const projectQuery = useQuery([QUERY_KEYS.GET_ONE_PROJECT, projectId], () =>
		QueryApi.projects.getOne(projectId)
	);

	const ctxObject = {
		projectQuery,
	};

	return <QueryCtx.Provider value={ctxObject}>{children}</QueryCtx.Provider>;
}

export default function EventsDetailsPage() {
	// #region dependencies
	useContext<DocumentTitleService>(DocTitleSvcContext).setTitle('Evento');
	const authSvc = useContext(AuthSvcContext);
	const userSvc = useContext(UserSvcContext);
	const modalSvc = useContext(ModalSvcContext);
	const params = useParams<{ id: string }>();
	const eventId = params.id!;

	// #endregion

	// #region todo
	// +todo not here, and isn't even working
	// useEffect(() => {
	// 	const handleBeforeUnload = () => {
	// 		tabHandler.setActiveTab(PROJECT_DETAILS_TABS.overview);
	// 	};

	// 	window.addEventListener('beforeunload', handleBeforeUnload);

	// 	return () => {
	// 		window.removeEventListener('beforeunload', handleBeforeUnload);
	// 	};
	// }, [tabHandler]);

	// #endregion

	// #region http request

	const eventQuery = useQuery({
		queryKey: [QUERY_KEYS.RETRIEVE_EVENT, eventId],
		queryFn: () => api.events.retrieve(eventId),
	});

	// GET user registration
	// const {
	// 	data: userUpvotes,
	// 	isLoading: userUpvotesLoading,
	// 	isError: userUpvotesError,
	// } = useQuery(
	// 	[QUERY_KEYS.GET_USER_ONE_UPVOTE, userSvc.getUserData().id],
	// 	() => QueryApi.user.getUpvotedProject(userSvc.getUserData().id /*, projectId*/),
	// 	{
	// 		enabled: authSvc.isLoggedIn(),
	// 	}
	// );

	// POST register
	// const postUpvoteMutation = useMutation({
	// 	mutationFn: (prjctId: number) =>
	// 		QueryApi.projects.addUpvote(userSvc.getUserData().id, prjctId),

	// 	// optimistic update to have a better performance
	// 	onMutate: (prjctId: number) =>
	// 		onUpvoteMutate_singleProject({
	// 			operation: 1,
	// 			projectId: prjctId,
	// 			userId: userSvc.getUserData().id,
	// 		}),

	// 	onError: () => {
	// 		toast.error('Error upvoting project');
	// 	},
	// });

	// DELETE unregister
	// const delUpvoteMutation = useMutation({
	// 	mutationFn: (prjctId: number) =>
	// 		QueryApi.projects.delUpvote(userSvc.getUserData().id, prjctId),

	// 	onMutate: (prjctId: number) =>
	// 		onUpvoteMutate_singleProject({
	// 			operation: 0,
	// 			projectId: prjctId,
	// 			userId: userSvc.getUserData().id,
	// 		}),

	// 	onError: () => {
	// 		toast.error('Error upvoting project');
	// 	},
	// });

	// #endregion

	// *~~~ tabs ~~~* //
	// #region tabs

	const [activeTab, setActiveTab] = useState(0);

	const tabs = [
		{
			id: 0,
			label: 'Resumen',
			onClick: () => {
				setActiveTab(0);
			},
			Component: SummaryTab,
		},
		{
			id: 1,
			label: `Participantes`,
			onClick: () => {
				setActiveTab(1);
			},
			Component: AttendeesTab,
		},
	];

	// function ContentTab() {
	// 	if (projectIsError || (!projectIsLoading && !projectData))
	// 		return <div>Error loading project edtails</div>;
	// 	const openImageModal = (url: string) => {
	// 		modalSvc.open(APP_MODALS.IMAGE_MODAL, {
	// 			imageURl: url,
	// 		});
	// 	};
	// 	return (
	// 		<div className="space-y-10">
	// 			{/* Gray divs row */}
	// 			{projectIsLoading ? (
	// 				<div className="grid grid-cols-3 gap-x-2 skeleton-container">
	// 					<div className="skeleton-box w-full h-24"></div>
	// 					<div className="skeleton-box w-full h-24"></div>
	// 					<div className="skeleton-box w-full h-24"></div>
	// 				</div>
	// 			) : (
	// 				<div className="grid grid-cols-3 gap-x-2">
	// 					{projectData.fileUpload1 && (
	// 						<img
	// 							src={projectData.fileUpload1}
	// 							alt=""
	// 							className="cursor-pointer w-full h-48 object-cover hover:shadow-2xl transition duration-300 ease-in-out" // Adjust width (w-full) and height (h-48) as needed
	// 							onClick={() => openImageModal(projectData.fileUpload1)}
	// 						/>
	// 					)}
	// 					{projectData.fileUpload2 && (
	// 						<img
	// 							src={projectData.fileUpload2}
	// 							alt=""
	// 							className="cursor-pointer w-full h-48 object-cover hover:shadow-2xl transition duration-300 ease-in-out"
	// 							onClick={() => openImageModal(projectData.fileUpload2)}
	// 						/>
	// 					)}

	// 					{projectData.fileUpload3 && (
	// 						<img
	// 							src={projectData.fileUpload3}
	// 							alt=""
	// 							className="cursor-pointer w-full h-48 object-cover hover:shadow-2xl transition duration-300 ease-in-out"
	// 							onClick={() => openImageModal(projectData.fileUpload3)}
	// 						/>
	// 					)}
	// 				</div>
	// 			)}

	// 			{/* Paragraphs */}
	// 			<div className="text-sm text-black dark:text-white">
	// 				{projectIsLoading ? (
	// 					<div className="skeleton-container space-y-6">
	// 						<div className="skeleton-title w-[120px]"></div>
	// 						<div className="space-y-4">
	// 							<div className="skeleton-line w-full"></div>
	// 							<div className="skeleton-line w-[90%]"></div>
	// 							<div className="skeleton-line w-[95%]"></div>
	// 						</div>
	// 					</div>
	// 				) : (
	// 					<p className="whitespace-pre-line cursor-default">
	// 						{projectData.description}
	// 					</p>
	// 				)}
	// 			</div>
	// 		</div>
	// 	);
	// }

	// function CommentsTab() {
	// 	// *~~~ replies ~~~* //
	// 	const [replyingTo, setReplyingTo] = useState<number | null>(null);
	// 	const [showReplies, setShowReplies] = useState<number[]>([]); // stores the id of the comments that have their replies shown

	// 	// *~~~ http req ~~~* //
	// 	// GET comments
	// 	const {
	// 		data: comments,
	// 		isLoading: commentsLoading,
	// 		isError: commentsError,
	// 	} = useQuery([QUERY_KEYS.GET_PROJECT_COMMENTS, projectId], () =>
	// 		QueryApi.projects.getComments(projectId)
	// 	);

	// 	// POST comment
	// 	const postComment = useMutation({
	// 		mutationFn: (commentDto: AddProjectCommentDto) =>
	// 			QueryApi.projects.addComment(commentDto),

	// 		onMutate: async (commentDto: AddProjectCommentDto) =>
	// 			await addCommentOptimisicUpdate({
	// 				commentDto: commentDto,
	// 				projectId: projectId,
	// 				userData: {
	// 					name: userSvc.getUserData().name,
	// 					pfp: userSvc.getUserData().pfp,
	// 				},
	// 			}),

	// 		onSuccess: (res, commentDto) => {
	// 			addCommentSuccess({
	// 				res,
	// 				projectId,
	// 				commentDto,
	// 			});
	// 		},

	// 		onError: (_error, _commentDto, context) => {
	// 			addCommentFailure({
	// 				context,
	// 				projectId,
	// 			});
	// 			toast.error('Error posting the comment');
	// 		},
	// 	});

	// 	// *~~~ formik ~~~* //
	// 	const formik = useFormik({
	// 		initialValues: {
	// 			comment: '',
	// 		},
	// 		onSubmit: (values) => {
	// 			if (!authSvc.isLoggedIn()) {
	// 				modalSvc.open(APP_MODALS.LOGIN_MODAL);
	// 				return;
	// 			}

	// 			if (!values.comment) return;

	// 			try {
	// 				postComment.mutate({
	// 					userId: userSvc.getUserData().id,
	// 					projectId: projectId,
	// 					comment: values.comment,
	// 					randomId: -Math.floor(Math.random() * 1000000), // this is for internal use only
	// 				});

	// 				resetForm();
	// 			} catch (error) {
	// 				toast.error('Error posting the comment');
	// 			}
	// 		},
	// 	});

	// 	const { handleSubmit, getFieldProps, resetForm } = formik;

	// 	// *~~~ render reply ~~~* //
	// 	function CommentSubcomponent({ comment }: { comment: CommentModel }) {
	// 		const replyFormik = useFormik({
	// 			initialValues: {
	// 				reply: '',
	// 			},
	// 			onSubmit: (values) => {
	// 				if (!authSvc.isLoggedIn()) {
	// 					modalSvc.open(APP_MODALS.LOGIN_MODAL);
	// 					return;
	// 				}

	// 				if (!values.reply) return;

	// 				try {
	// 					postComment.mutate({
	// 						userId: userSvc.getUserData().id,
	// 						projectId: projectId,
	// 						comment: values.reply,
	// 						replyingTo: comment.id.toString(),
	// 						randomId: -Math.floor(Math.random() * 1000000), // this is for internal use only
	// 					});

	// 					resetForm2();

	// 					setReplyingTo(null);
	// 				} catch (error) {
	// 					toast.error('Error posting the reply');
	// 				}
	// 			},
	// 		});

	// 		const { getFieldProps: getReplyFieldProps, resetForm: resetForm2 } = replyFormik;

	// 		function onReplyClick() {
	// 			if (!authSvc.isLoggedIn()) {
	// 				modalSvc.open(APP_MODALS.LOGIN_MODAL);
	// 				return;
	// 			}

	// 			setReplyingTo(comment.id);
	// 		}

	// 		function onShowRepliesClick() {
	// 			if (showReplies.includes(comment.id)) {
	// 				setShowReplies((prev) => prev.filter((id) => id !== comment.id));
	// 			} else {
	// 				setShowReplies((prev) => prev.concat(comment.id));
	// 			}
	// 		}

	// 		function onDeleteClick(_: CommentModel, isReply: boolean, parentId?: number) {
	// 			modalSvc.open(APP_MODALS.DELETE_COMMENT, {
	// 				comment: {
	// 					id: _.id,
	// 					userId: _.userId,
	// 					projectId: projectId,
	// 					comment: _.comment,
	// 					date: _.date,
	// 					user: _.user,
	// 				},
	// 				isReply,
	// 				parentId,
	// 			});
	// 		}

	// 		return (
	// 			<div className="space-y-4">
	// 				<div className={`${comment.id < 0 ? 'opacity-50 pointer-events-none' : ''}`}>
	// 					<CommentComponent
	// 						name={comment.user.name}
	// 						profile_picture={comment.user.pictureUrl}
	// 						date={comment.date}
	// 						userId={comment.userId}
	// 						onReplyClick={onReplyClick}
	// 						renderReplyBtn={true}
	// 						onDeleteClick={() => onDeleteClick(comment, false)}
	// 						renderDeleteBtn={
	// 							(authSvc.isLoggedIn() &&
	// 								comment.userId === userSvc.getUserData().id) ||
	// 							userSvc.isAdmin()
	// 						}
	// 					>
	// 						{comment.comment}
	// 					</CommentComponent>
	// 				</div>

	// 				{/* reply input */}
	// 				{authSvc.isLoggedIn() && replyingTo && replyingTo === comment.id && (
	// 					<form onSubmit={replyFormik.handleSubmit}>
	// 						<div className="cursor-default px-4 py-2 rounded-xl bg-light-700 dark:bg-dark-700 space-y-2">
	// 							<div className="flex justify-between items-center">
	// 								<h1 className="space-x-2 text-agrey-700 dark:text-agrey-400 cursor-default">
	// 									<span>
	// 										<i className="cursor-default fa-solid fa-arrow-turn-left" />
	// 									</span>
	// 									<span className="cursor-default">
	// 										Replying to: {comment.user.name}
	// 									</span>
	// 								</h1>

	// 								<button
	// 									onClick={() => setReplyingTo(null)}
	// 									className="text-agrey-700 dark:text-agrey-400"
	// 								>
	// 									<i className="fa-solid fa-times"></i>
	// 								</button>
	// 							</div>
	// 							<div className="flex gap-x-4 items-center bg-white dark:bg-dark-800 p-2 rounded-xl">
	// 								<img
	// 									src={userSvc.getUserData().pfp}
	// 									className="w-12 h-12 rounded-full"
	// 								/>
	// 								<div className="flex gap-x-4 flex-grow items-center min-w-0">
	// 									<div className="flex-grow min-w-0">
	// 										<textarea
	// 											className="text-field w-full"
	// 											placeholder="Type your reply here"
	// 											{...getReplyFieldProps('reply')}
	// 										/>
	// 									</div>
	// 									<Button
	// 										type="submit"
	// 										className={`blue small ${
	// 											replyFormik.isSubmitting && 'loading'
	// 										}`}
	// 										disabled={!replyFormik.values.reply}
	// 									>
	// 										Send
	// 									</Button>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					</form>
	// 				)}

	// 				{/* show replies */}
	// 				{comment.replies.length > 0 && (
	// 					<div className="pl-[70px] flex items-center">
	// 						<div className="h-[2.6px] rounded-full w-10 bg-[#F1F3F5] mr-2 dark:bg-[#27282D]"></div>
	// 						<button
	// 							className="text-agrey-900 dark:text-white text-sm font-medium hover:text-ablue-200 transition duration-300 ease-in-out"
	// 							onClick={onShowRepliesClick}
	// 						>
	// 							{showReplies.includes(comment.id) ? 'Hide' : 'Show'} Replies (
	// 							{comment.replies.length})
	// 						</button>
	// 					</div>
	// 				)}

	// 				{/* replies */}
	// 				{showReplies.includes(comment.id) && (
	// 					<div className=" pl-8 space-y-4">
	// 						{comment.replies.map((reply, idx2) => (
	// 							<div
	// 								className={`${
	// 									reply.id < 0 ? 'opacity-50 pointer-events-none' : ''
	// 								}`}
	// 								key={idx2}
	// 							>
	// 								<CommentComponent
	// 									name={reply.user.name}
	// 									profile_picture={reply.user.pictureUrl}
	// 									date={reply.date}
	// 									userId={reply.userId}
	// 									children={reply.comment}
	// 									renderReplyBtn={false}
	// 									renderDeleteBtn={
	// 										(authSvc.isLoggedIn() &&
	// 											reply.userId === userSvc.getUserData().id) ||
	// 										userSvc.isAdmin()
	// 									}
	// 									onDeleteClick={() => onDeleteClick(reply, true, comment.id)}
	// 								/>
	// 							</div>
	// 						))}
	// 					</div>
	// 				)}
	// 			</div>
	// 		);
	// 	}

	// 	if (commentsError || (!commentsLoading && !comments))
	// 		return <div>Error loading comments</div>;

	// 	return (
	// 		<div className="relative ">
	// 			{commentsLoading ? (
	// 				[1, 2, 3].map((_, idx) => <CommentsSkeleton key={idx} />)
	// 			) : (
	// 				<div className="space-y-6">
	// 					{comments.map((comment, idx) => (
	// 						<CommentSubcomponent comment={comment} key={idx} />
	// 					))}
	// 				</div>
	// 			)}
	// 			<div className="h-[30px] "></div>

	// 			<form
	// 				onSubmit={handleSubmit}
	// 				className=" sticky bottom-0 left-0 w-full  p-2 px-6 bg-white dark:bg-dark-800"
	// 			>
	// 				<div className="field">
	// 					<div className="form-control">
	// 						<div className="flex gap-x-2">
	// 							<div className="flex-grow min-w-0">
	// 								<textarea
	// 									{...getFieldProps('comment')}
	// 									className="text-field"
	// 									placeholder="your comment here"
	// 									style={{ resize: 'none', height: '40px' }}
	// 								/>
	// 							</div>
	// 							<div>
	// 								<Button
	// 									type="submit"
	// 									disabled={formik.isSubmitting || !formik.values.comment}
	// 									className="blue small"
	// 								>
	// 									Send
	// 								</Button>
	// 							</div>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			</form>
	// 		</div>
	// 	);
	// }

	// #endregion

	// *~~~ functions (related to http req) ~~~* //
	// #region

	// function isProjectUpvoted(projectId: number) {
	// 	return !authSvc.isLoggedIn()
	// 		? false
	// 		: userUpvotes!.upvotedProjects.some((p) => p.id === projectId);
	// }

	// async function handleUpvoteBtnClick(projectId: number, isUpvoted: boolean) {
	// 	if (!authSvc.isLoggedIn()) {
	// 		modalSvc.open(APP_MODALS.LOGIN_MODAL);
	// 		return;
	// 	}

	// 	const toggle = isUpvoted ? delUpvoteMutation.mutateAsync : postUpvoteMutation.mutateAsync;

	// 	await toggle(projectId);
	// }

	// #endregion

	// *~~~ Share functionality ~~~* //
	// #region

	// const [isOpen, setIsOpen] = useState(false);

	// const { refs, floatingStyles } = useFloating({
	// 	open: isOpen,
	// 	onOpenChange: setIsOpen,
	// 	placement: 'left',
	// 	middleware: [offset(20)],
	// });

	// const { refs: tabletRefs, floatingStyles: tabletFloatingStyles } = useFloating({
	// 	open: isOpen,
	// 	onOpenChange: setIsOpen,
	// 	placement: 'left-start',
	// 	middleware: [offset(20)],
	// });

	// const { refs: mobileRefs, floatingStyles: mobileFloatingStyles } = useFloating({
	// 	open: isOpen,
	// 	onOpenChange: setIsOpen,
	// 	placement: 'right-end',
	// 	middleware: [offset(20)],
	// });

	// function onShareBtnClick() {
	// 	setIsOpen(!isOpen);
	// }

	// #endregion

	// *~~~ fx ~~~* //
	// #region
	// function openContactModal(project: OneProjectModel) {
	// 	modalSvc.open(APP_MODALS.CONTACT_MODAL, {
	// 		grantAmount: project.grantAmount,
	// 		currency: project.currency,
	// 		framework: project.framework,
	// 		projectDeployment: project.projectDeployment,
	// 		telegramUsername: project.telegramUsername,
	// 		email: project.email,
	// 		twitterLinkedinUrl: project.twitterLinkedinUrl,
	// 		walletAddress: project.walletAddress,
	// 	});
	// }

	// function onDeleteProjectClick(_: OneProjectModel) {
	// 	modalSvc.open(APP_MODALS.DELETE_PROJECT, {
	// 		project: _,
	// 	});
	// }
	// #endregion

	// *~~~ render ~~~* //
	// if (projectIsError || (!projectIsLoading && !projectData)) return <div>error</div>;

	// if (authSvc.isLoggedIn() && (userUpvotesError || (!userUpvotesLoading && !userUpvotes))) {
	// 	<div>error fetching user data</div>;
	// }

	const ctx: EventDetailsPageCtxType = {
		refs: {},
		fn: {},
		state: {
			activeTab,
			tabs,
		},
		queries: {
			eventQuery,
		},
	};

	return (
		<EventDetailsPageCtx.Provider value={ctx}>
			<EventsDetailsView />
		</EventDetailsPageCtx.Provider>
	);
}
