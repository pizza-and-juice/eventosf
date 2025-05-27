import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import LayoutService from 'src/shared/services/layout/layout.service';
import LayoutSvcContext from 'src/shared/services/layout/layout.context';
import Tag from 'src/components/internal/tags/tags.component';
import Upvote from 'src/components/internal/upvote/upvote.component';
import ROUTES from 'src/static/router.data';
import { useMutation, useQuery } from 'react-query';
import QUERY_KEYS from 'src/static/query.keys';
import QueryApi from 'src/shared/api/query-api';
import ProjectMainDetailsSkeleton from 'src/components/skeletons/project/main-details/project-main-details.skeleton';
import ProjectMetadataSkeleton from 'src/components/skeletons/project/metadata/project-metadata.skeleton';
import CommentComponent from 'src/components/internal/comments/comments.component';
import CommentsSkeleton from 'src/components/skeletons/comments/comments.skeleton';
import { AddProjectCommentDto } from 'src/shared/api/dto/project/add-comment.dto';
import { useFormik } from 'formik';

import './project-qv.scss';
import AuthService from 'src/shared/services/auth/auth.service';
import AuthSvcContext from 'src/shared/services/auth/auth.context';
import UserService from 'src/shared/services/user/user.service';
import UserSvcContext from 'src/shared/services/user/user.context';
import ModalService from 'src/shared/services/modal/modal.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import APP_MODALS from 'src/static/enums/app.modals';
import { CommentModel } from 'src/shared/models/projects/project-comment.model';
import { toast } from 'react-toastify';
import Button from 'src/components/internal/button/button.component';
import { isLinkedInURL } from 'src/shared/utils/functions';
import { PROJECT_QV_TABS } from 'src/static/enums/qv.enum';
import ShareProjectPanel from '../share-project/share-project.nr.component';
import { offset, useFloating } from '@floating-ui/react';
import { onUpvoteMutate_singleProject } from 'src/shared/api/mutations/upvote.mutation';
import {
	addCommentFailure,
	addCommentOptimisicUpdate,
	addCommentSuccess,
} from 'src/shared/api/mutations/comments.mutation';

type ProjectQVProps = {
	projectId: number;
	activeTab?: PROJECT_QV_TABS;
};

export default function ProjectQuickViewComponent({
	projectId,
	activeTab: iActiveTab,
}: ProjectQVProps) {
	// *~~~ inject dependencies ~~~* //
	// #region

	const authSvc = useContext<AuthService>(AuthSvcContext);
	const userSvc = useContext<UserService>(UserSvcContext);
	const layoutSvc = useContext<LayoutService>(LayoutSvcContext);
	const modalSvc = useContext<ModalService>(ModalSvcContext);

	const [activeTab, setActiveTab] = useState(iActiveTab || PROJECT_QV_TABS.overview);

	// #endregion

	// *~~~ handle close ~~~* //
	// #region

	const asideRef = useRef<HTMLElement>(null);

	function close() {
		asideRef.current?.classList.add('slide-out');

		function handleTransitionEnd() {
			layoutSvc.closeProjectQV();
			asideRef.current?.removeEventListener('animationend', handleTransitionEnd);
		}

		asideRef.current?.addEventListener('animationend', handleTransitionEnd);
	}

	// close on escape key press
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				close();
			}
		}

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// dispose layout before closing
	const location = useLocation();
	const [dirty, setDirty] = useState(false);
	useEffect(() => {
		setDirty(true);

		return () => {
			if (dirty) {
				layoutSvc.closeProjectQV();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname, dirty]);

	// #endregion

	// *~~~ http req ~~~* //
	// #region
	// GET project data
	const {
		data: projectData,
		isLoading: projectIsLoading,
		isError: projectIsError,
	} = useQuery([QUERY_KEYS.GET_ONE_PROJECT, projectId], () =>
		QueryApi.projects.getOne(projectId)
	);

	// GET user upvotes
	const {
		data: userUpvotes,
		isLoading: userUpvotesLoading,
		isError: userUpvotesError,
	} = useQuery(
		[QUERY_KEYS.GET_USER_ONE_UPVOTE, userSvc.getUserData().id],
		() => QueryApi.user.getUpvotedProject(userSvc.getUserData().id /*, projectId*/),
		{
			enabled: authSvc.isLoggedIn(),
		}
	);

	// POST upvote
	const postUpvoteMutation = useMutation({
		mutationFn: (prjctId: number) =>
			QueryApi.projects.addUpvote(userSvc.getUserData().id, prjctId),

		// optimistic update to have a better performance
		onMutate: (prjctId: number) =>
			onUpvoteMutate_singleProject({
				operation: 1,
				projectId: prjctId,
				userId: userSvc.getUserData().id,
			}),

		onError: () => {
			toast.error('Error upvoting project');
		},
	});

	// DELETE upvote
	const delUpvoteMutation = useMutation({
		mutationFn: (prjctId: number) =>
			QueryApi.projects.delUpvote(userSvc.getUserData().id, prjctId),

		onMutate: (prjctId: number) =>
			onUpvoteMutate_singleProject({
				operation: 0,
				projectId: prjctId,
				userId: userSvc.getUserData().id,
			}),

		onError: () => {
			toast.error('Error delting upvoting project');
		},
	});

	// #endregion

	// *~~~ functions (related to http req) ~~~* //
	// #region

	function isProjectUpvoted(projectId: number) {
		return !authSvc.isLoggedIn()
			? false
			: userUpvotes!.upvotedProjects.some((p) => p.id === projectId);
	}

	async function handleUpvoteBtnClick(projectId: number, isUpvoted: boolean) {
		if (!authSvc.isLoggedIn()) {
			modalSvc.open(APP_MODALS.LOGIN_MODAL);
			return;
		}

		const toggle = isUpvoted ? delUpvoteMutation.mutateAsync : postUpvoteMutation.mutateAsync;

		await toggle(projectId);
	}

	function openImageModal(url: string) {
		modalSvc.open(APP_MODALS.IMAGE_MODAL, {
			imageURl: url,
		});
	}

	// #endregion

	// *~~~ tabs ~~~* //
	// #region
	function OverviewTab() {
		if (projectIsError || (!projectIsLoading && !projectData))
			return <div>Error loading project edtails</div>;

		return (
			<div className="space-y-10">
				{/* Gray divs row */}
				{projectIsLoading ? (
					<div className="grid grid-cols-3 gap-x-2 skeleton-container">
						<div className="skeleton-box w-full h-24"></div>
						<div className="skeleton-box w-full h-24"></div>
						<div className="skeleton-box w-full h-24"></div>
					</div>
				) : (
					<div className="grid grid-cols-3 gap-x-2">
						{projectData.fileUpload1 && (
							<img
								src={projectData.fileUpload1}
								alt=""
								className="cursor-pointer w-full h-[130px] object-cover hover:scale-105 hover:shadow-xl transition duration-500 ease-in-out" // Adjust width (w-full) and height (h-48) as needed
								onClick={() => openImageModal(projectData.fileUpload1)}
							/>
						)}
						{projectData.fileUpload2 && (
							<img
								src={projectData.fileUpload2}
								alt=""
								className="cursor-pointer w-full h-[130px] object-cover hover:scale-105 hover:shadow-xl transition duration-500 ease-in-out"
								onClick={() => openImageModal(projectData.fileUpload2)}
							/>
						)}
						{projectData.fileUpload3 && (
							<img
								src={projectData.fileUpload3}
								alt=""
								className="cursor-pointer w-full h-[130px] object-cover hover:scale-105 hover:shadow-xl transition duration-500 ease-in-out"
								onClick={() => openImageModal(projectData.fileUpload3)}
							/>
						)}
					</div>
				)}

				{/* Paragraphs */}
				<div className="text-sm text-black dark:text-white">
					{projectIsLoading ? (
						<div className="skeleton-container space-y-6">
							<div className="skeleton-title w-[120px]"></div>
							<div className="space-y-4">
								<div className="skeleton-line w-full"></div>
								<div className="skeleton-line w-full"></div>
							</div>
						</div>
					) : (
						<p className="whitespace-pre-line cursor-default">
							{projectData.description}
						</p>
					)}
				</div>
			</div>
		);
	}

	function CommentsTab() {
		// *~~~ replies ~~~* //
		const [replyingTo, setReplyingTo] = useState<number | null>(null);
		const [showReplies, setShowReplies] = useState<number[]>([]); // stores the id of the comments that have their replies shown

		// *~~~ http req ~~~* //
		// GET comments
		const {
			data: comments,
			isLoading: commentsLoading,
			isError: commentsError,
		} = useQuery([QUERY_KEYS.GET_PROJECT_COMMENTS, projectId], () =>
			QueryApi.projects.getComments(projectId)
		);

		// POST comment
		const postComment = useMutation({
			mutationFn: (commentDto: AddProjectCommentDto) =>
				QueryApi.projects.addComment(commentDto),

			onMutate: async (commentDto: AddProjectCommentDto) =>
				await addCommentOptimisicUpdate({
					commentDto: commentDto,
					projectId: projectId,
					userData: {
						name: userSvc.getUserData().name,
						pfp: userSvc.getUserData().pfp,
					},
				}),

			onSuccess: (res, commentDto) => {
				addCommentSuccess({
					res,
					projectId,
					commentDto,
				});
			},

			onError: (_error, _commentDto, context) => {
				addCommentFailure({
					context,
					projectId,
				});
				toast.error('Error posting the comment');
			},
		});

		// *~~~ formik ~~~* //
		const formik = useFormik({
			initialValues: {
				comment: '',
			},
			onSubmit: (values) => {
				if (!authSvc.isLoggedIn()) {
					modalSvc.open(APP_MODALS.LOGIN_MODAL);
					return;
				}

				if (!values.comment) return;

				try {
					postComment.mutate({
						userId: userSvc.getUserData().id,
						projectId: projectId,
						comment: values.comment,
						randomId: -Math.floor(Math.random() * 1000000), // this is for internal use only
					});

					resetForm();
				} catch (error) {
					toast.error('Error posting the comment');
				}
			},
		});

		const { handleSubmit, getFieldProps, resetForm } = formik;

		// *~~~ render reply ~~~* //
		function CommentSubcomponent({ comment }: { comment: CommentModel }) {
			const replyFormik = useFormik({
				initialValues: {
					reply: '',
				},
				onSubmit: (values) => {
					if (!authSvc.isLoggedIn()) {
						modalSvc.open(APP_MODALS.LOGIN_MODAL);
						return;
					}

					if (!values.reply) return;

					try {
						postComment.mutate({
							userId: userSvc.getUserData().id,
							projectId: projectId,
							comment: values.reply,
							replyingTo: comment.id.toString(),
							randomId: -Math.floor(Math.random() * 1000000), // this is for internal use only
						});

						resetForm2();

						setReplyingTo(null);
					} catch (error) {
						toast.error('Error posting the reply');
					}
				},
			});

			const { getFieldProps: getReplyFieldProps, resetForm: resetForm2 } = replyFormik;

			function onReplyClick() {
				if (!authSvc.isLoggedIn()) {
					modalSvc.open(APP_MODALS.LOGIN_MODAL);
					return;
				}

				setReplyingTo(comment.id);
			}

			function onDeleteClick(_: CommentModel, isReply: boolean, parentId?: number) {
				modalSvc.open(APP_MODALS.DELETE_COMMENT, {
					comment: {
						id: _.id,
						userId: _.userId,
						projectId: projectId,
						comment: _.comment,
						date: _.date,
						user: _.user,
					},
					isReply,
					parentId,
				});
			}

			function onShowRepliesClick() {
				if (showReplies.includes(comment.id)) {
					setShowReplies((prev) => prev.filter((id) => id !== comment.id));
				} else {
					setShowReplies((prev) => prev.concat(comment.id));
				}
			}

			return (
				<div className="space-y-4">
					<div className={`${comment.id < 0 ? 'opacity-50 pointer-events-none' : ''}`}>
						<CommentComponent
							name={comment.user.name}
							profile_picture={comment.user.pictureUrl}
							date={comment.date}
							userId={comment.userId}
							onReplyClick={onReplyClick}
							renderReplyBtn={true}
							onDeleteClick={() => onDeleteClick(comment, false)}
							renderDeleteBtn={
								(authSvc.isLoggedIn() &&
									comment.userId === userSvc.getUserData().id) ||
								userSvc.isAdmin()
							}
						>
							{comment.comment}
						</CommentComponent>
					</div>

					{/* reply input */}
					{authSvc.isLoggedIn() && replyingTo && replyingTo === comment.id && (
						<form onSubmit={replyFormik.handleSubmit}>
							<div className="px-4 py-2 rounded-xl bg-light-700 dark:bg-dark-700 space-y-2">
								<div className="flex justify-between items-center">
									<h1 className="space-x-2 text-agrey-700 dark:text-agrey-400">
										<span>
											<i className="fa-solid fa-arrow-turn-left" />
										</span>
										<span>Replying to: {comment.user.name}</span>
									</h1>

									<button
										onClick={() => setReplyingTo(null)}
										className="text-agrey-700 dark:text-agrey-400"
									>
										<i className="fa-solid fa-times"></i>
									</button>
								</div>
								<div className="flex gap-x-4 items-center bg-white dark:bg-dark-800 p-2 rounded-xl">
									<img
										src={userSvc.getUserData().pfp}
										className="w-12 h-12 rounded-full"
									/>
									<div className="flex gap-x-4 flex-grow items-center min-w-0">
										<div className="flex-grow min-w-0">
											<textarea
												className="text-field w-full"
												placeholder="Type your reply here"
												{...getReplyFieldProps('reply')}
											/>
										</div>
										<Button
											type="submit"
											className={`blue small ${
												replyFormik.isSubmitting && 'loading'
											}`}
											disabled={!replyFormik.values.reply}
										>
											Send
										</Button>
									</div>
								</div>
							</div>
						</form>
					)}

					{/* show replies */}
					{comment.replies.length > 0 && (
						<div className="pl-[70px] flex items-center">
							<div className="h-[2.6px] rounded-full w-10 bg-light-700 mr-2 dark:bg-dark-700"></div>
							<button
								className="text-agrey-900 dark:text-white text-sm font-medium hover:text-ablue-200 transition duration-300 ease-in-out"
								onClick={onShowRepliesClick}
							>
								{showReplies.includes(comment.id) ? 'Hide' : 'Show'} Replies (
								{comment.replies.length})
							</button>
						</div>
					)}

					{/* replies */}
					{showReplies.includes(comment.id) && (
						<div className=" pl-8 space-y-4">
							{comment.replies.map((reply, idx2) => (
								<div
									className={`${
										reply.id < 0 ? 'opacity-50 pointer-events-none' : ''
									}`}
									key={idx2}
								>
									<CommentComponent
										name={reply.user.name}
										profile_picture={reply.user.pictureUrl}
										date={reply.date}
										userId={reply.userId}
										children={reply.comment}
										renderReplyBtn={false}
										renderDeleteBtn={
											(authSvc.isLoggedIn() &&
												reply.userId === userSvc.getUserData().id) ||
											userSvc.isAdmin()
										}
										onDeleteClick={() => onDeleteClick(reply, true, comment.id)}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			);
		}

		if (commentsError || (!commentsLoading && !comments))
			return <div>Error loading comments</div>;

		return (
			<>
				{commentsLoading ? (
					<CommentsSkeleton />
				) : (
					<div className="space-y-6 ">
						{comments.map((comment, idx) => (
							<CommentSubcomponent comment={comment} key={idx} />
						))}
					</div>
				)}
				<div className="h-[30px]"></div>
				<form
					onSubmit={handleSubmit}
					className=" absolute bottom-0 left-0 w-full  p-2 px-6 bg-white dark:bg-dark-800"
				>
					<div className="field">
						<div className="form-control">
							<div className="flex gap-x-2">
								<div className="flex-grow w-full">
									<textarea
										{...getFieldProps('comment')}
										className="text-field w-full"
										placeholder="your comment here"
										style={{ resize: 'none', height: '40px' }}
									/>
								</div>
								<div>
									<Button
										type="submit"
										disabled={formik.isSubmitting || !formik.values.comment}
										className="blue small"
									>
										Send
									</Button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</>
		);
	}
	// #endregion

	// *~~~ Share functionality ~~~* //
	// #region

	const [isOpen, setIsOpen] = useState(false);

	const { refs, floatingStyles } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: 'bottom-end',
		middleware: [offset(20)],
	});

	function onShareBtnClick() {
		setIsOpen(!isOpen);
	}

	// #endregion

	// *~~~ render conditionals ~~~* //
	// #region
	if (projectIsError || (!projectIsLoading && !projectData))
		return (
			<>
				<div className="layout_overlay"></div>
				<div>error</div>
			</>
		);

	if (authSvc.isLoggedIn() && (userUpvotesError || (!userUpvotesLoading && !userUpvotes))) {
		<>
			<div className="layout_overlay"></div>
			<div>error fetching user data</div>
		</>;
	}
	// #endregion

	return (
		<div className="">
			<div className="layout_overlay " onClick={close}></div>

			<aside className=" prjct-quickview slide-in h-screen " ref={asideRef}>
				<div className="h-full w-full  flex flex-col  ">
					<header className="h-[72px] px-8 flex justify-between items-center ">
						<Link
							className="text-black dark:text-white"
							title="Expand"
							to={ROUTES.projects.details.replace(/:id/, projectId.toString())}
						>
							<i className="fa-solid fa-expand-alt"></i>
						</Link>

						<button className="text-black dark:text-white" onClick={close}>
							<i className="fa-solid fa-times"></i>
						</button>
					</header>

					{/* main container */}
					<div className="py-10 px-8 space-y-10 flex-grow min-h-0 scroll scroll-sm overflow-auto ">
						{/* main details */}
						{projectIsLoading || userUpvotesLoading ? (
							<section>
								<ProjectMainDetailsSkeleton />
							</section>
						) : (
							<section className="relative">
								<div className="flex flex-grow min-w-0  flex-col sm:flex-row items-stretch  gap-x-6 gap-y-4">
									{/* image */}
									<div className="basis-[80px] w-[80px] flex-grow-0 flex-shrink-0 sm:basis-[130px] sm:h-[130px] ">
										<Link
											to={ROUTES.projects.details.replace(
												':id',
												projectData.id.toString()
											)}
											className=""
										>
											<img
												src={projectData.logoPath}
												className="w-full h-full"
											/>
										</Link>
									</div>

									<div className=" sm:hidden absolute right-0 top-0 sm:top-0 ">
										<Upvote
											size="big"
											upvotes={projectData.totalUpvotes}
											onClick={() =>
												handleUpvoteBtnClick(
													projectId,
													isProjectUpvoted(projectId)
												)
											}
											isUpvoted={isProjectUpvoted(projectId)}
										/>
									</div>

									{/* Content to the right of the image */}
									<div className="flex-grow space-y-2">
										<div className="flex justify-between items-center gap-x-3">
											<h1 className="text-xl font-medium text-black dark:text-white cursor-default">
												{projectData.projectName}
											</h1>
											{userSvc.getUserData().id ===
												projectData.creator.id && (
												<Button
													href={ROUTES.projects.edit.replace(
														/:id/,
														projectId.toString()
													)}
													className="blue small  transition duration-300 ease-in-out"
													tag_type="link"
												>
													Edit
												</Button>
											)}
										</div>
										<p className=" text-agrey-700 dark:text-agrey-400 whitespace-pre-line cursor-default">
											{projectData.bio}
										</p>
										<div className="flex gap-x-4">
											{projectData.categories.map(
												(category: string, index: number) => (
													<Tag key={index}>{category}</Tag>
												)
											)}
										</div>
									</div>
								</div>
								<div className="hidden">
									{/* image */}
									<div className="flex-grow min-w-0 flex flex-col sm:flex-row items-stretch  gap-x-6 gap-y-4">
										<div className="basis-[80px] w-[80px] flex-grow-0 flex-shrink-0 sm:basis-[130px] sm:h-[130px] ">
											<Link
												to={ROUTES.projects.details.replace(
													':id',
													projectData.id.toString()
												)}
												className=""
											>
												<img
													src={projectData.logoPath}
													className="w-full h-full"
												/>
											</Link>
										</div>
										<div className="ml-auto">
											<Upvote
												size="big"
												upvotes={projectData.totalUpvotes}
												onClick={() =>
													handleUpvoteBtnClick(
														projectId,
														isProjectUpvoted(projectId)
													)
												}
												isUpvoted={isProjectUpvoted(projectId)}
											/>
										</div>
									</div>
									{/* Content to the right of the image */}
									<div className="flex-grow min-w-0 space-y-2">
										<div className="flex items-center gap-x-3">
											<h1 className="text-xl font-medium text-black dark:text-white">
												{projectData.projectName}
											</h1>
											{/* <div className="w-[26px] h-[26px] bg-light-700 dark:bg-dark-700 text-agrey-700 dark:text-agrey-400 rounded-[4px] grid place-items-center">
												#{projectData.id}
											</div> */}
										</div>
										<p className=" text-agrey-700 dark:text-agrey-400 whitespace-pre-line">
											{projectData.description}
										</p>
										<div className="flex gap-x-4">
											{projectData.categories.map(
												(category: string, index: number) => (
													<Tag key={index}>{category}</Tag>
												)
											)}
										</div>
									</div>
								</div>
							</section>
						)}

						{/*more details  */}
						{projectIsLoading || userUpvotesLoading ? (
							<section>
								<ProjectMetadataSkeleton />
							</section>
						) : (
							<section className="flex justify-between gap-x-6 w-full">
								<div className="border border-light-700 dark:border-dark-700 flex-grow ">
									<div className="relative flex justify-between lg:gap-x-12 sm:gap-x-6  px-4 py-6">
										{/* created by */}
										<div className="space-y-2 lg:w-full sm:w-[50%]">
											<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
												Created By
											</h2>
											<div className="flex items-center gap-x-3 ">
												<Link
													className="text-link capitalize"
													to={ROUTES.profile.root.replace(
														/:id/,
														projectData.creator.id
													)}
												>
													<img
														src={projectData.creator.pictureUrl}
														alt=""
														className="w-6 h-6 rounded-full hover:scale-110 hover:shadow-md transition duration-300 ease-in-out"
													/>
												</Link>
												<Link
													className="text-link capitalize"
													to={ROUTES.profile.root.replace(
														/:id/,
														projectData.creator.id
													)}
												>
													{projectData.creator.name}
												</Link>
											</div>
										</div>

										{/* Website Column */}
										<div className="space-y-2">
											<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
												Website
											</h2>
											<div>
												{/* Website link */}
												<Link
													className="text-link flex gap-x-2 items-center"
													to={projectData.projectWebsite}
													target="_blank"
													rel="noreferrer noopener"
												>
													<span>
														<i className="fa-solid fa-external-link text-agrey-700 dark:text-agrey-400 hover:text-ablue-200 transition duration-300 ease-in-out"></i>
													</span>
												</Link>
											</div>
										</div>
										<div className="space-y-2 ">
											<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
												Share
											</h2>
											<div className="relative">
												{/* Share button */}
												<button
													className="text-link flex gap-x-2 items-center"
													ref={refs.setReference}
													onClick={onShareBtnClick}
												>
													<span>
														<i className="fa-solid fa-share-alt text-agrey-700 dark:text-agrey-400 hover:text-ablue-200 transition duration-300 ease-in-out"></i>
													</span>
												</button>
												{isOpen && (
													<div
														style={floatingStyles}
														ref={refs.setFloating}
													>
														<ShareProjectPanel
															projectId={projectData.id}
														/>
													</div>
												)}
											</div>
										</div>

										{/* Socials Column */}
										<div className="space-y-2">
											<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
												Socials
											</h2>
											<div className="flex flex-row gap-x-1">
												{/* Twitter */}
												{projectData.twitterLinkedinUrl && (
													<Link
														className="text-link flex gap-x-2 items-center text-agrey-700 dark:text-agrey-400"
														to={projectData.twitterLinkedinUrl}
														target="_blank"
														rel="noreferrer noopener"
													>
														<span>
															{isLinkedInURL(
																projectData.twitterLinkedinUrl
															) ? (
																<i className="fa-brands fa-linkedin hover:text-ablue-200 transition duration-300 ease-in-out" />
															) : (
																<i className="fa-brands fa-twitter hover:text-ablue-200 transition duration-300 ease-in-out" />
															)}
														</span>
													</Link>
												)}
												{projectData.telegramUsername && (
													<Link
														className="text-link flex gap-x-2 items-center"
														to={ROUTES.external.telegram.replace(
															/:user/,
															projectData.telegramUsername
														)}
														target="_blank"
														rel="noreferrer noopener"
													>
														<span>
															<i className="fa-brands fa-telegram text-agrey-700 dark:text-agrey-400 hover:text-ablue-200 transition duration-300 ease-in-out"></i>
														</span>
													</Link>
												)}
											</div>
										</div>
									</div>
								</div>

								<div className="hidden sm:block">
									<Upvote
										size="big"
										upvotes={projectData.totalUpvotes}
										onClick={() =>
											handleUpvoteBtnClick(
												projectId,
												isProjectUpvoted(projectId)
											)
										}
										isUpvoted={isProjectUpvoted(projectId)}
									/>
								</div>
							</section>
						)}

						{/* main content tabs */}
						<section className="space-y-6 ">
							{/* Tabs for Overview and Comments if needed */}
							<div className="flex justify-start items-center">
								<button
									className={`text-sm p-4 dark:text-white ${
										activeTab === PROJECT_QV_TABS.overview
											? 'font-semibold border-b-2 border-ablue-500 text-ablue-500 dark:border-ablue-300 dark:text-ablue-300'
											: ''
									}`}
									onClick={() => setActiveTab(PROJECT_QV_TABS.overview)}
								>
									Overview
								</button>
								<button
									className={`text-sm p-4 dark:text-white ${
										activeTab === PROJECT_QV_TABS.comments
											? 'font-semibold border-b-2 border-ablue-500 text-ablue-500 dark:border-ablue-300 dark:text-ablue-300'
											: ''
									}`}
									onClick={() => setActiveTab(PROJECT_QV_TABS.comments)}
								>
									Comments ({projectData?.totalComments || 0})
								</button>
							</div>

							{/* Content for Overview and Comments */}
							<div className="p-4">
								{activeTab === PROJECT_QV_TABS.overview && <OverviewTab />}
								{activeTab === PROJECT_QV_TABS.comments && <CommentsTab />}
							</div>
						</section>
					</div>
				</div>
			</aside>
		</div>
	);
}
