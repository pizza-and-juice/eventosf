/* eslint-disable no-mixed-spaces-and-tabs */

import { signal } from '@preact/signals-react';
import { useFormik } from 'formik';
import { createContext, useContext, useEffect, useState } from 'react';
import { UseQueryResult, useMutation, useQuery } from 'react-query';
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

function MainContent() {
	// *~~~ inject dependencies ~~~* //
	// #region
	useContext<DocumentTitleService>(DocTitleSvcContext).setTitle('Project Details');
	const authSvc = useContext<AuthService>(AuthSvcContext);
	const userSvc = useContext<UserService>(UserSvcContext);
	const modalSvc = useContext<ModalService>(ModalSvcContext);
	const tabHandler = useContext<TabHandler>(tabCxt);
	const queryCtx = useContext<QueryCtxType>(QueryCtx);

	// +todo not here, and isn't even working
	useEffect(() => {
		const handleBeforeUnload = () => {
			tabHandler.setActiveTab(PROJECT_DETAILS_TABS.overview);
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [tabHandler]);
	const params = useParams<{ id: string }>();
	const projectId = Number(params.id);
	// #endregion

	// *~~~ http req ~~~* //
	// #region
	// GET project data
	const {
		data: projectData,
		isLoading: projectIsLoading,
		isError: projectIsError,
	} = queryCtx.projectQuery;

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
			toast.error('Error upvoting project');
		},
	});

	// #endregion

	// *~~~ tabs ~~~* //
	// #region
	const tabs = {
		links: [
			{
				label: 'Overview',
				onClick: () => {
					tabHandler.setActiveTab(PROJECT_DETAILS_TABS.overview);
				},
				tab: PROJECT_DETAILS_TABS.overview,
			},
			{
				label: `Comments (${projectData?.totalComments || 0})`,
				onClick: () => {
					tabHandler.setActiveTab(PROJECT_DETAILS_TABS.comments);
				},
				tab: PROJECT_DETAILS_TABS.comments,
			},
		],
		getActive: () => tabHandler.getActiveTab(),
	};

	function ContentTab() {
		if (projectIsError || (!projectIsLoading && !projectData))
			return <div>Error loading project edtails</div>;
		const openImageModal = (url: string) => {
			modalSvc.open(APP_MODALS.IMAGE_MODAL, {
				imageURl: url,
			});
		};
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
								className="cursor-pointer w-full h-48 object-cover hover:shadow-2xl transition duration-300 ease-in-out" // Adjust width (w-full) and height (h-48) as needed
								onClick={() => openImageModal(projectData.fileUpload1)}
							/>
						)}
						{projectData.fileUpload2 && (
							<img
								src={projectData.fileUpload2}
								alt=""
								className="cursor-pointer w-full h-48 object-cover hover:shadow-2xl transition duration-300 ease-in-out"
								onClick={() => openImageModal(projectData.fileUpload2)}
							/>
						)}

						{projectData.fileUpload3 && (
							<img
								src={projectData.fileUpload3}
								alt=""
								className="cursor-pointer w-full h-48 object-cover hover:shadow-2xl transition duration-300 ease-in-out"
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
								<div className="skeleton-line w-[90%]"></div>
								<div className="skeleton-line w-[95%]"></div>
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

			function onShowRepliesClick() {
				if (showReplies.includes(comment.id)) {
					setShowReplies((prev) => prev.filter((id) => id !== comment.id));
				} else {
					setShowReplies((prev) => prev.concat(comment.id));
				}
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
							<div className="cursor-default px-4 py-2 rounded-xl bg-light-700 dark:bg-dark-700 space-y-2">
								<div className="flex justify-between items-center">
									<h1 className="space-x-2 text-agrey-700 dark:text-agrey-400 cursor-default">
										<span>
											<i className="cursor-default fa-solid fa-arrow-turn-left" />
										</span>
										<span className='cursor-default'>Replying to: {comment.user.name}</span>
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
							<div className="h-[2.6px] rounded-full w-10 bg-[#F1F3F5] mr-2 dark:bg-[#27282D]"></div>
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
			<div className="relative ">
				{commentsLoading ? (
					[1, 2, 3].map((_, idx) => <CommentsSkeleton key={idx} />)
				) : (
					<div className="space-y-6">
						{comments.map((comment, idx) => (
							<CommentSubcomponent comment={comment} key={idx} />
						))}
					</div>
				)}
				<div className="h-[30px] "></div>

				<form
					onSubmit={handleSubmit}
					className=" sticky bottom-0 left-0 w-full  p-2 px-6 bg-white dark:bg-dark-800"
				>
					<div className="field">
						<div className="form-control">
							<div className="flex gap-x-2">
								<div className="flex-grow min-w-0">
									<textarea
										{...getFieldProps('comment')}
										className="text-field"
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
			</div>
		);
	}

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

	// #endregion

	// *~~~ Share functionality ~~~* //
	// #region

	const [isOpen, setIsOpen] = useState(false);

	const { refs, floatingStyles } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: 'left',
		middleware: [offset(20)],
	});

	const { refs: tabletRefs, floatingStyles: tabletFloatingStyles } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: 'left-start',
		middleware: [offset(20)],
	});

	const { refs: mobileRefs, floatingStyles: mobileFloatingStyles } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: 'right-end',
		middleware: [offset(20)],
	});

	function onShareBtnClick() {
		setIsOpen(!isOpen);
	}

	// #endregion

	// *~~~ fx ~~~* //
	// #region
	function openContactModal(project: OneProjectModel) {
		modalSvc.open(APP_MODALS.CONTACT_MODAL, {
			grantAmount: project.grantAmount,
			currency: project.currency,
			framework: project.framework,
			projectDeployment: project.projectDeployment,
			telegramUsername: project.telegramUsername,
			email: project.email,
			twitterLinkedinUrl: project.twitterLinkedinUrl,
			walletAddress: project.walletAddress,
		});
	}

	function onDeleteProjectClick(_: OneProjectModel) {
		modalSvc.open(APP_MODALS.DELETE_PROJECT, {
			project: _,
		});
	}
	// #endregion

	// *~~~ render ~~~* //
	if (projectIsError || (!projectIsLoading && !projectData)) return <div>error</div>;

	if (authSvc.isLoggedIn() && (userUpvotesError || (!userUpvotesLoading && !userUpvotes))) {
		<div>error fetching user data</div>;
	}

	return (
		<main className="flex gap-x-10">
			{/* Main Content */}
			<div className="flex-grow min-w-0 space-y-10 ">
				{/* project main info */}
				{projectIsLoading || userUpvotesLoading ? (
					<section>
						<ProjectMainDetailsSkeleton />
					</section>
				) : (
					<section className="flex flex-col sm:flex-row gap-x-6 gap-y-4 relative">
						{/* image */}
						<img src={projectData.logoPath} alt="" className="w-[130px] h-[130px]" />

						{/* edit button mobile */}
						<div className="block lg:hidden absolute right-0 bottom-0 sm:top-0 ">
							{userSvc.getUserData().id === projectData.creator.id ? (
								<Button
									href={ROUTES.projects.edit.replace(/:id/, projectId.toString())}
									className="blue small "
									tag_type="link"
								>
									Edit
								</Button>
							) : null}
						</div>

						<div className="sm:hidden absolute right-0 top-0">
							<Upvote
								size="big"
								upvotes={projectData.totalUpvotes}
								onClick={() =>
									handleUpvoteBtnClick(projectId, isProjectUpvoted(projectId))
								}
								isUpvoted={isProjectUpvoted(projectId)}
							/>
						</div>

						{/* Content to the right of the image */}
						<div className="flex-grow space-y-2">
							<div className="flex items-center gap-x-3">
								<h1 className="text-xl font-medium text-black dark:text-white cursor-default">
									{projectData.projectName}
								</h1>
								{/* <div className="w-[26px] h-[26px] bg-light-700 dark:bg-dark-700 text-agrey-700 dark:text-agrey-400 rounded-[4px] grid place-items-center">
									#{projectData.id}
								</div> */}
							</div>
							<p className=" text-agrey-700 dark:text-agrey-400 whitespace-pre-line cursor-default">
								{projectData.bio}
							</p>
							<div className="flex gap-x-4">
								{projectData.categories.map((category: string, index: number) => (
									<Tag key={index}>{category}</Tag>
								))}
							</div>
						</div>
					</section>
				)}

				{projectIsLoading
					? null
					: userSvc.isAdmin() && (
							<div className="block lg:hidden space-y-2">
								<hr />

								<div className="space-y-2">
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
										Admin operations
									</h2>
									<div className="flex flex-wrap gap-2">
										<Button
											href={ROUTES.admin.projects.edit.replace(
												/:id/,
												projectId.toString()
											)}
											className="blue small "
											tag_type="link"
										>
											Edit
										</Button>
										<Button
											className="blue small"
											onClick={() => openContactModal(projectData)}
										>
											Contact
										</Button>
										<Button
											className="red small"
											onClick={() => onDeleteProjectClick(projectData)}
										>
											Delete
										</Button>
									</div>
								</div>

								<hr />
							</div>
					  )}

				{/* project metadata tablet  */}
				{projectIsLoading || userUpvotesLoading ? (
					<>
						<div className=" flex skeleton-container lg:hidden md:flex">
							<div className="skeleton-box w-[82%] h-28 flex-shrink-0 mr-5"></div>
							<div className="bg-light-700 dark:bg-dark-700 w-28 h-28 flex-shrink-0"></div>
						</div>
					</>
				) : (
					<section className="hidden sm:flex lg:hidden justify-between gap-x-6 ">
						<div className="border border-light-700 dark:border-dark-700 flex-grow">
							<div className="flex justify-between gap-x-12 px-4 py-6">
								{/* created by */}
								<div className="space-y-2">
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium">
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
												className="w-6 h-6 rounded-full "
											/>
										</Link>
										<Link
											className="text-link capitalize  dark:text-agrey-400"
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
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium">
										Website
									</h2>
									<div>
										{/* Website link */}
										<Link
											className="text-link flex gap-x-2 items-center"
											to={projectData.projectWebsite}
										>
											<span>
												<i className="fa-solid fa-external-link dark:text-agrey-400 hover:text-ablue-200  transition duration-300 ease-in-out"></i>
											</span>
										</Link>
									</div>
								</div>

								<div className="space-y-2">
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium">
										Share
									</h2>
									<div className="relative">
										{/* Share button */}
										<button
											className="text-link flex gap-x-2 items-center"
											onClick={onShareBtnClick}
											ref={tabletRefs.setReference}
										>
											<span>
												<i className="fa-solid fa-share-alt text-agrey-700 dark:text-agrey-400 hover:text-ablue-200 transition duration-300 ease-in-out"></i>
											</span>
										</button>
										{isOpen && (
											<div
												ref={tabletRefs.setFloating}
												style={tabletFloatingStyles}
											>
												<ShareProjectPanel projectId={projectId} />
											</div>
										)}
									</div>
								</div>

								{/* Socials Column */}
								<div className="space-y-2">
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium">
										Socials
									</h2>
									<div className="flex flex-row gap-x-1">
										{/* Twitter */}
										<Link
											className="text-link flex gap-x-2 items-center text-agrey-700 dark:text-agrey-400"
											to={projectData.twitterLinkedinUrl}
											target="_blank"
											rel="noreferrer noopener"
										>
											<span>
												{isLinkedInURL(projectData.twitterLinkedinUrl) ? (
													<i className="fa-brands fa-linkedin hover:text-ablue-200 transition duration-300 ease-in-out" />
												) : (
													<i className="fa-brands fa-twitter hover:text-ablue-200 transition duration-300 ease-in-out" />
												)}
											</span>
										</Link>

										{/* LinkedIn */}
										<Link
											className="text-link flex gap-x-2 items-center text-agrey-700 dark:text-agrey-400"
											to={ROUTES.external.telegram.replace(
												/:user/,
												projectData.telegramUsername
											)}
											target="_blank"
											rel="noreferrer noopener"
										>
											<span>
												<i className="fa-brands fa-telegram hover:text-ablue-200 transition duration-300 ease-in-out"></i>
											</span>
										</Link>
									</div>
								</div>
							</div>
						</div>

						<Upvote
							size="big"
							upvotes={projectData.totalUpvotes}
							onClick={() =>
								handleUpvoteBtnClick(projectId, isProjectUpvoted(projectId))
							}
							isUpvoted={isProjectUpvoted(projectId)}
						></Upvote>
					</section>
				)}

				{/* project metadata mobile  */}
				{projectIsLoading ? (
					<div className="text-black dark:text-white md:hidden sm:block ">
						<>
							<div className="skeleton-title w-[20%] mb-5" />
							<div className="skeleton-line w-[10%] mb-5" />
							<div className="skeleton-box w-[10%] h-3 mb-10" />
							<div className=" flex skeleton-container ">
								<div className="skeleton-box w-full h-40 flex-shrink-0 mr-5"></div>
							</div>
						</>
					</div>
				) : (
					<section className="sm:hidden">
						<div className="border border-light-700 dark:border-dark-700">
							<div className="grid grid-cols-2 grid-rows-2 gap-x-6 gap-y-4 p-3">
								{/* created by */}
								<div className="space-y-2">
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
										Created By
									</h2>
									<div className="flex items-center gap-x-3">
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
												className="w-6 h-6 rounded-full hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out"
											/>
										</Link>
										<Link
											className="text-link capitalize dark:text-agrey-400"
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
												<i className="fa-solid fa-external-link hover:text-ablue-200 dark:text-agrey-400 transition duration-300 ease-in-out"></i>
											</span>
										</Link>
									</div>
								</div>
								<div className="space-y-2">
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
										Share
									</h2>
									<div className="relative">
										{/* Share button */}
										<button
											className="text-link flex gap-x-2 items-center"
											onClick={onShareBtnClick}
											ref={mobileRefs.setReference}
										>
											<span>
												<i className="fa-solid fa-share-alt text-agrey-700 dark:text-agrey-400 hover:text-ablue-200 transition duration-300 ease-in-out"></i>
											</span>
										</button>
										{isOpen && (
											<div
												ref={mobileRefs.setFloating}
												style={mobileFloatingStyles}
											>
												<ShareProjectPanel projectId={projectId} />
											</div>
										)}
									</div>
								</div>
								{/* grant */}
								{/* <div className="mb-4">
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium">
										Grant amount
									</h2>
									<h2 className="text-black dark:text-white font-medium">
										${projectData.grantAmount} USD
									</h2>
								</div> */}

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
												to={projectData.telegramUsername}
												target="_blank"
												rel="noreferrer noopener"
											>
												<span>
													<i className="fa-brands fa-telegram text-[#5F5F74] dark:text-[#BBBAD2] hover:text-ablue-200 transition duration-300 ease-in-out"></i>
												</span>
											</Link>
										)}
									</div>
								</div>
							</div>
						</div>
					</section>
				)}

				{/* tabs | only on mobile devices */}
				<section className="lg:hidden">
					<div className="flex gap-x-6 items-center ">
						{tabs.links.map((tab, idx) => (
							<button
								className={`text-sm py-4 border-b-2 text-black dark:text-white ${
									tabs.getActive() === tab.tab
										? ' border-ablue-500 !text-ablue-500 dark:border-ablue-300 dark:!text-ablue-300'
										: 'border-transparent'
								}`}
								key={idx}
								onClick={tab.onClick}
							>
								{tab.label}
							</button>
						))}
					</div>
				</section>

				{/* tabs */}
				{tabHandler.getActiveTab() === PROJECT_DETAILS_TABS.overview && <ContentTab />}
				{tabHandler.getActiveTab() === PROJECT_DETAILS_TABS.comments && <CommentsTab />}
			</div>

			{/* project metadata desktop*/}
			<aside className="min-w-[200px] hidden lg:block">
				<div className="sticky top-[120px] space-y-10">
					{projectIsLoading || userUpvotesLoading ? (
						<div className="space-y-4 flex-grow">
							<div className="skeleton-box w-28 h-28 " />

							<div className="">
								<div className=" mt-10 mb-10">
									<div className="skeleton-title w-14 mb-3" />
									<div className="skeleton-line w-28" />
								</div>
								<div className="  mb-6">
									<div className="skeleton-title w-14  mb-3" />
									<div className="skeleton-line w-12" />
								</div>
								<div className="mt-10 mb-10">
									<div className="skeleton-title w-14  mb-5" />
									<div className="skeleton-line w-10" />
								</div>
								<div className="  mb-10">
									<div className="skeleton-title w-14  mb-5" />
									<div className="skeleton-line w-12" />
								</div>
							</div>
						</div>
					) : (
						<>
							<Upvote
								size="big"
								onClick={() =>
									handleUpvoteBtnClick(projectId, isProjectUpvoted(projectId))
								}
								upvotes={projectData.totalUpvotes}
								isUpvoted={isProjectUpvoted(projectId)}
							/>

							<div className="details space-y-6">
								{/* created by */}
								<div className="space-y-2">
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
										Created By
									</h2>
									<div className="flex items-center gap-x-3">
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
												className="w-6 h-6 rounded-full hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out"
											/>
										</Link>

										<Link
											className="text-link capitalize dark:text-agrey-400"
											to={ROUTES.profile.root.replace(
												/:id/,
												projectData.creator.id
											)}
										>
											{projectData.creator.name}
										</Link>
									</div>
								</div>

								{/* grant */}
								{/* <div className="mb-4">
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium">
										Grant amount
									</h2>
									<h2 className="text-black dark:text-white font-medium">
										${projectData.grantAmount} USD
									</h2>
								</div> */}

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
												<i className="fa-solid fa-external-link hover:text-ablue-200 dark:text-agrey-400 transition duration-300 ease-in-out"></i>
											</span>
										</Link>
									</div>
								</div>

								<div className="space-y-2">
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
										Share
									</h2>
									<div className="relative">
										{/* Share button */}
										<button
											className="relative text-link flex gap-x-2 items-center"
											onClick={onShareBtnClick}
											ref={refs.setReference}
										>
											<span>
												<i className="fa-solid fa-share-alt text-agrey-700 dark:text-agrey-400 hover:text-ablue-200 transition duration-300 ease-in-out"></i>
											</span>
										</button>
										{isOpen && (
											<div ref={refs.setFloating} style={floatingStyles}>
												<ShareProjectPanel projectId={projectId} />
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
												className="text-link flex gap-x-2 items-center text-agrey-700 dark:text-agrey-400"
												to={ROUTES.external.telegram.replace(
													/:user/,
													projectData.telegramUsername
												)}
												target="_blank"
												rel="noreferrer noopener"
											>
												<span>
													<i className="fa-brands fa-telegram hover:text-ablue-200 transition duration-300 ease-in-out"></i>
												</span>
											</Link>
										)}
									</div>
								</div>

								{/* edit buttons */}
								{userSvc.getUserData().id === projectData.creator.id && (
									<div className="flex gap-2">
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

										<Button
											className="red small"
											onClick={() => onDeleteProjectClick(projectData)}
										>
											Delete
										</Button>
									</div>
								)}

								{/* admin ops */}
								{userSvc.isAdmin() && (
									<>
										<hr />

										<div className="space-y-2">
											<h2 className="text-sm text-agrey-700 dark:text-agrey-400 font-medium cursor-default">
												Admin operations
											</h2>
											<div className="flex flex-wrap gap-2">
												<Button
													href={ROUTES.admin.projects.edit.replace(
														/:id/,
														projectId.toString()
													)}
													className="blue small "
													tag_type="link"
												>
													Edit
												</Button>
												<Button
													className="blue small"
													onClick={() => openContactModal(projectData)}
												>
													Contact
												</Button>
												<Button
													className="red small"
													onClick={() =>
														onDeleteProjectClick(projectData)
													}
												>
													Delete
												</Button>
											</div>
										</div>
									</>
								)}
							</div>
						</>
					)}
				</div>
			</aside>
		</main>
	);
}

function Sidebar() {
	// ctx
	const { projectQuery } = useContext(QueryCtx);

	const tabHandler = useContext<TabHandler>(tabCxt);

	const tab_group = [
		{
			title: 'Project name',
			links: [
				{
					label: 'Overview',
					onClick: () => {
						tabHandler.setActiveTab(PROJECT_DETAILS_TABS.overview);
					},
					tab: PROJECT_DETAILS_TABS.overview,
				},
				{
					label: `Comments (${projectQuery.data?.totalComments || 0})`,
					onClick: () => {
						tabHandler.setActiveTab(PROJECT_DETAILS_TABS.comments);
					},
					tab: PROJECT_DETAILS_TABS.comments,
				},
			],
			getActive: () => tabHandler.getActiveTab(),
		},
	];

	return (
		<aside
			id="projects_sidebar"
			className="project-aside min-w-[200px] hidden lg:block sticky top-headerP"
		>
			{/* container Section */}
			<div className="space-y-12 ">
				{tab_group.map((group, index) => (
					<section className="space-y-4" key={index}>
						<h1 className="font-bold text-agrey-700 dark:text-white cursor-default">
							{group.title}
						</h1>
						<ul className="list-none ">
							{group.links.map((tab, idx2) => (
								<li className="" key={idx2}>
									<button
										onClick={tab.onClick}
										className={`prj-aside-button ${
											tab.tab === group.getActive() && 'active'
										}`}
									>
										{tab.label}
									</button>
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
		</aside>
	);
}

export default function ProjectDetailsPage() {
	return (
		<QueryComponent>
			<div className="container-2 ">
				<div className="subcontainer">
					{/* Sidebar */}
					<div>
						<Sidebar />
					</div>

					{/* Main */}
					<div className="flex-grow min-w-0">
						<MainContent />
					</div>
				</div>
			</div>
		</QueryComponent>
	);
}

enum PROJECT_DETAILS_TABS {
	overview = '_',
	comments = '__',
}

class TabHandler {
	private activeTab = signal(PROJECT_DETAILS_TABS.overview);

	getActiveTab() {
		return this.activeTab.value;
	}

	setActiveTab(tab: PROJECT_DETAILS_TABS) {
		this.activeTab.value = tab;
	}
}

const tabCxt = createContext<TabHandler>(new TabHandler());