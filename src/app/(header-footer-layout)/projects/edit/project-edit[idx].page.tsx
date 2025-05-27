// react
import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';

// formik
import * as yup from 'yup';
import { useFormik } from 'formik';

// react query
import QueryApi from 'src/shared/api/query-api';

// services and contexts
import AuthSvcContext from 'src/shared/services/auth/auth.context';
import AuthService from 'src/shared/services/auth/auth.service';
import ModalService from 'src/shared/services/modal/modal.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';

// components
import Button from 'src/components/internal/button/button.component';
import ImageUploader from 'src/components/internal/image-uploader-mobile/image-uploader-mobile.component';
import ProjectCover from 'src/components/internal/project-cover/project-cover.component';

// static

import { UseQueryResult, useMutation } from 'react-query';
import APP_MODALS from 'src/static/enums/app.modals';
import UserService from 'src/shared/services/user/user.service';
import UserSvcContext from 'src/shared/services/user/user.context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'src/static/router.data';
import DocumentTitleService from 'src/shared/services/doc-title/doc-title.service';
import DocTitleSvcContext from 'src/shared/services/doc-title/doc-title.context';

// import styles from './grant.module.css';
import styles from 'src/app/(header-footer-layout)/grant/apply/grant.module.css';

const twitterRegex = /^(https?:\/\/)?((w{3}\.)?)twitter\.com\/(#!\/)?[a-z0-9_]+$/i;
const linkedInRegex = /^(https?:\/\/)?((w{3}\.)?)linkedin\.com\/.*/i;
const xRegex = /^(https?:\/\/)?((w{3}\.)?)x\.com\/.*/i;

import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import QUERY_KEYS from 'src/static/query.keys';
import { EditProjectDto } from 'src/shared/api/dto/project/edit-project.dto';
import { OneProjectModel } from 'src/shared/models/projects/project.model';

function MainContent() {
	const { projectQuery, formik } = useContext(QueryCtx);

	const {
		data: projectData,
		isLoading: projectIsLoading,
		isError: projectIsError,
	} = projectQuery;

	const { handleSubmit, setFieldValue, getFieldProps, values, touched, errors, isSubmitting } =
		formik;

	// *~~~ fx ~~~* //

	// set project cover file
	function onLogoUpload(file: File) {
		setFieldValue('projectCover', file);
	}
	// set first file image uploader
	function fileToUpload1(file: any) {
		setFieldValue('file1', file);
	}

	function fileToUpload2(file: any) {
		setFieldValue('file2', file);
	}
	// set third folder for image uploader
	function fileToUpload3(file: any) {
		setFieldValue('file3', file);
	}

	function deleteLogo() {
		setFieldValue('projectCover', '');
	}

	function deleteFile1() {
		setFieldValue('file1', '');
	}

	function deleteFile2() {
		setFieldValue('file2', '');
	}

	function deleteFile3() {
		setFieldValue('file3', '');
	}

	if (projectIsError || (!projectIsLoading && !projectData)) {
		return <div className="text-center">Something went wrong, try again</div>;
	}

	return (
		<main className="w-full lg:max-w-[700px] 2xl:max-w-[940px] 3xl:max-w-[1324px] space-y-10">
			{/* titles */}
			<section className="space-y-2">
				<h1 className="text-xl sm:text-4xl font-bold text-black dark:text-white">
					Edit Submission
				</h1>
			</section>

			{projectIsLoading ? (
				<div className="dark:text-white">Loading...</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-10">
					{/* project details */}
					<section className="space-y-6" id="project-details">
						{/* project details titles */}
						<div>
							<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
								Project Details
							</h2>
							<p className="text-sm sm:text-base  text-agrey-700 dark:text-agrey-400">
								Please add your project information, this will be visible for others
								to see.
							</p>
						</div>

						{/* project details con section */}
						<fieldset className="space-y-4">
							{/* project cover  */}
							<div className="field space-y-1">
								<label
									htmlFor=""
									className="text-abrandc-dark-black text-[12px] font-normal dark:text-white"
								>
									Project cover *
								</label>

								<ProjectCover
									onFileChange={onLogoUpload}
									onFileDelete={deleteLogo}
									initialImage={projectData.logoPath}
								/>

								{touched.projectCover && errors.projectCover && (
									<div className="text-ared-500 text-xs">
										{errors.projectCover}
									</div>
								)}
							</div>

							{/* project bio section */}
							<div className="field space-y-1">
								<div className="flex justify-between">
									<label className="text-xs  text-black dark:text-white">
										Project Bio *
									</label>
									<h6 className="text-sm  text-agrey-700  dark:text-agrey-400">
										{values.projectBio.length}/160
									</h6>
								</div>

								{/* project Bio field control div */}
								<div className="form-control">
									<textarea
										placeholder="Type here..."
										className={` text-field h-[152px] ${
											touched.projectBio && errors.projectBio && 'invalid'
										}`}
										{...getFieldProps('projectBio')}
										value={formik.values.projectBio}
									></textarea>
									{touched.projectBio && errors.projectBio && (
										<div className="text-ared-500 text-xs">
											{errors.projectBio}
										</div>
									)}
								</div>
							</div>

							{/* describe idea */}
							<div className="field space-y-1">
								<div className="flex justify-between">
									<label className="text-xs  text-black dark:text-white">
										Describe your idea/project *
									</label>
									<h6 className="text-sm  text-agrey-700  dark:text-agrey-400">
										{values.projectIdea.length}/1000
									</h6>
								</div>

								{/* describe your idea field control div */}
								<div className="form-control">
									<textarea
										placeholder="Type here..."
										className={` text-field h-[152px] ${
											touched.projectIdea && errors.projectIdea && 'invalid'
										}`}
										{...getFieldProps('projectIdea')}
									></textarea>
									{touched.projectIdea && errors.projectIdea && (
										<div className="text-ared-500 text-xs">
											{errors.projectIdea}
										</div>
									)}
								</div>
							</div>

							{/* project website  */}
							<div className="field space-y-1">
								<label className="text-xs text-black dark:text-white">
									Project Website *
								</label>
								<div className="form-control">
									<input
										type="text"
										placeholder="Enter your Website URL"
										className={` text-field ${
											touched.websiteUrl && errors.websiteUrl && 'invalid'
										}`}
										{...getFieldProps('websiteUrl')}
									/>
									{touched.websiteUrl && errors.websiteUrl && (
										<div className="text-ared-500 text-xs">
											{errors.websiteUrl}
										</div>
									)}
								</div>
							</div>

							{/* your LinkedIn/Twitter handle section */}
							<div className="field space-y-1">
								<label className="text-xs text-black dark:text-white">
									Project Twitter/LinkedIn *
								</label>
								<div className="form-control">
									<input
										type="text"
										placeholder="Enter your Twitter or LinkedIn URL"
										className={`text-field ${
											touched.socialMediaUrl &&
											errors.socialMediaUrl &&
											'invalid'
										}`}
										{...getFieldProps('socialMediaUrl')}
									/>
									{touched.socialMediaUrl && errors.socialMediaUrl && (
										<div className="text-ared-500 text-xs">
											{errors.socialMediaUrl}
										</div>
									)}
								</div>
							</div>
						</fieldset>
					</section>

					{/* upload files */}
					<section className="space-y-6" id="file-upload">
						<div>
							<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
								File Upload
							</h2>
							<p className="text-sm sm:text-base text-agrey-700 dark:text-agrey-400">
								Please add your project information, this will be visible for others
								to see.
							</p>
						</div>

						<fieldset>
							{/* upload images */}
							<div className="field">
								<div className="grid grid-cols-1 grid-rows-3 sm:grid-cols-3 sm:grid-rows-1 gap-x-6 gap-y-3">
									<ImageUploader
										title="File 1"
										onFileChange={fileToUpload1}
										onFileDelete={deleteFile1}
										initialImage={values.file1}
									/>
									<ImageUploader
										title="File 2"
										onFileChange={fileToUpload2}
										onFileDelete={deleteFile2}
										initialImage={values.file2}
									/>
									<ImageUploader
										title="File 3"
										onFileChange={fileToUpload3}
										onFileDelete={deleteFile3}
										initialImage={values.file3}
									/>
								</div>

								{touched.file1 && errors.file1 && (
									<div className="text-ared-500 text-xs">{errors.file1}</div>
								)}
							</div>
						</fieldset>
					</section>

					{/* send */}
					<section className="space-y-6" id="submit">
						<div>
							<label className="flex items-center gap-x-2">
								<input
									type="checkbox"
									className="checkbox !rounded"
									{...getFieldProps('acceptTerms')}
								/>
								<span className="text-sm text-agrey-700">
									By proceeding you agree to PWR’s{' '}
									<a
										href="https://www.pwrlabs.io/community-terms"
										target="_blank"
										className="text-ablue-500"
									>
										Terms of use
									</a>{' '}
									and{' '}
									<a
										href="https://www.pwrlabs.io/community-privacy"
										target="_blank"
										className="text-ablue-500"
									>
										Privacy Policy
									</a>
								</span>
							</label>
						</div>

						<div>
							<Button
								disabled={!values.acceptTerms}
								className={`blue ${isSubmitting && 'loading'}`}
								type="submit"
							>
								Save
							</Button>
						</div>
					</section>
				</form>
			)}
		</main>
	);
}

function Sidebar() {
	const { projectQuery } = useContext<QueryCtxType>(QueryCtx);

	const { isLoading } = projectQuery;

	const [activeSection, setActiveSection] = useState<number>(0);
	const link_group = [
		{
			title: 'Edit',
			links: [
				{
					name: 'Project Details',
					onClick: () => {
						window.location.href = '#project-details';
					},
				},
				{
					name: 'File Upload',
					onClick: () => {
						window.location.href = '#file-upload';
					},
				},
			],
		},
	];

	useLayoutEffect(() => {
		if (isLoading) return;

		const sec1 = document.getElementById('project-details')!;
		const sec2 = document.getElementById('file-upload')!;

		const secs = [sec1, sec2];

		window.addEventListener('scroll', navHighlighter);

		function navHighlighter() {
			// Get current scroll position
			const scrollY = window.scrollY;

			// Now we loop through sections to get height, top and ID values for each
			secs.forEach((current) => {
				const sectionHeight = current.offsetHeight;
				const sectionTop = current.offsetTop - 125;

				/*
						- If our current scroll position enters the space where current section on screen is, add .active class to corresponding navigation link, else remove it
						- To know which link needs an active class, we use sectionId variable we are getting while looping through sections as an selector
					*/
				if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
					setActiveSection(secs.indexOf(current));
				}
			});
		}

		return () => {
			window.removeEventListener('scroll', navHighlighter);
		};
	}, [isLoading]);

	return (
		<aside
			id="projects_sidebar"
			className="project-aside min-w-[200px] hidden lg:block sticky top-headerP"
		>
			{/* container Section */}
			<div className="space-y-12 ">
				{link_group.map((group, index) => (
					<section className="space-y-4" key={index}>
						<h1 className="font-bold text-agrey-700 dark:text-white">{group.title}</h1>
						<ul className="list-none ">
							{group.links.map((link, idx2) => (
								<li className="" key={idx2}>
									<button
										onClick={link.onClick}
										className={`prj-aside-button ${
											idx2 === activeSection && 'active'
										}`}
									>
										{link.name}
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

export default function EditProfilePage() {
	return (
		<QueryComponent>
			<div className="container-2 mx-auto mb-24">
				<div className="subcontainer">
					{/* Sidebar */}
					<div>
						<Sidebar />
					</div>

					{/* Main */}
					<MainContent />
				</div>
			</div>
		</QueryComponent>
	);
}

type QueryCtxType = {
	projectQuery: UseQueryResult<OneProjectModel, unknown>;
	formik: ReturnType<
		typeof useFormik<{
			projectCover: string;
			projectBio: string;
			projectIdea: string;
			websiteUrl: string;
			socialMediaUrl: string;
			file1: string;
			file2: string;
			file3: string;
			acceptTerms: boolean;
		}>
	>;
};

// @ts-expect-error - untyped library
const QueryCtx = createContext<QueryCtxType>();

function QueryComponent({ children }: { children: React.ReactNode }) {
	// *~~~ inject dependencies ~~~* //
	// #region dependencies

	useContext<DocumentTitleService>(DocTitleSvcContext).setTitle('Apply for grant');
	const authSvc = useContext<AuthService>(AuthSvcContext);
	const modalSvc = useContext<ModalService>(ModalSvcContext);
	const userSvc = useContext<UserService>(UserSvcContext);

	const navigate = useNavigate();

	const params = useParams<{ id: string }>();
	const projectId = Number(params.id);

	// #endregion

	// *~~~ scroll hanlders ~~~* //
	// #region
	useEffect(() => {
		document.querySelector('html')!.classList.add(styles.scroll_offset_top);

		return () => {
			document.querySelector('html')!.classList.remove(styles.scroll_offset_top);
		};
	}, []);

	// #endregion

	// *~~~ formik ~~~* //
	// #region

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			// main details
			projectCover: '',

			projectBio: '',
			projectIdea: '',
			websiteUrl: '',
			socialMediaUrl: '',

			// file upload
			file1: '',
			file2: '',
			file3: '',

			// accept terms and conditions
			acceptTerms: false,
		},
		validationSchema: yup.object({
			// main details
			projectCover: yup.mixed().required('required'),

			projectBio: yup.string().max(160, 'Character limit exceeded').required('required'),
			projectIdea: yup.string().max(1000, 'Character limit exceeded').required('required'),
			websiteUrl: yup.string().url('Invalid URL').required('required'),

			socialMediaUrl: yup
				.string()
				.required('required')
				.test(
					'is-twitter-or-linkedin',
					'URL must be a Twitter or LinkedIn URL',
					(value: string) => {
						return (
							twitterRegex.test(value) ||
							linkedInRegex.test(value) ||
							xRegex.test(value)
						);
					}
				),

			file1: yup.mixed().required('required'),
			file2: yup.mixed(),
			file3: yup.mixed(),
		}),

		onSubmit: async (values) => {
			if (!isValid) return;

			if (!authSvc.isLoggedIn()) {
				modalSvc.open(APP_MODALS.LOGIN_MODAL);
				return;
			}

			// identify data that changed

			const images = [];

			values.projectCover !== projectData!.logoPath &&
				images.push({ key: 'projectCover', file: values.projectCover as any as File });

			values.file1 !== projectData!.fileUpload1 &&
				images.push({ key: 'file1', file: values.file1 as any as File });

			values.file2 !== projectData!.fileUpload2 &&
				values.file2 &&
				images.push({ key: 'file2', file: values.file2 as any as File });

			values.file3 !== projectData!.fileUpload3 &&
				values.file3 &&
				images.push({ key: 'file3', file: values.file3 as any as File });

			const imgUrls: Record<string, string> = {
				projectCover: '',
				file1: '',
				file2: '',
				file3: '',
			};

			const signedUrls = [];
			const filenames = [];
			try {
				const date = Date.now();
				for (let i = 0; i < images.length; i++) {
					const file = images[i].file;

					// prettier-ignore
					const filename = `projects/${userSvc.getUserData().id}/${date}/${file.name}`;
					const res = await signedUrlMutation.mutateAsync(filename);

					signedUrls.push(res);
					filenames.push(filename);
				}
			} catch (err) {
				toast.error('Images couldnt be uploaded, try again');
				return;
			}

			try {
				for (let i = 0; i < images.length; i++) {
					const file = images[i].file;

					await postImgMutation.mutateAsync({
						file,
						signedUrl: signedUrls[i],
					});

					const key_ = images[i].key;

					imgUrls[key_] = `${import.meta.env.VITE_APP_IMG_URL}/${filenames[i]}`;
				}
			} catch (err) {
				toast.error('Images couldnt be uploaded, try again');
				return;
			}

			const formData: EditProjectDto = {
				id: projectId,
			};

			projectData!.logoPath !== values.projectCover &&
				Object.assign(formData, { logo: imgUrls.projectCover });

			projectData!.fileUpload1 !== values.file1 &&
				Object.assign(formData, { fileUpload1: imgUrls.file1 });

			if (projectData!.fileUpload2 !== values.file2) {
				if (!values.file2) {
					Object.assign(formData, { fileUpload2: '' });
				} else {
					Object.assign(formData, { fileUpload2: imgUrls.file2 });
				}
			}

			if (projectData!.fileUpload3 !== values.file3) {
				if (!values.file3) {
					Object.assign(formData, { fileUpload3: '' });
				} else {
					Object.assign(formData, { fileUpload3: imgUrls.file3 });
				}
			}

			projectData!.bio !== values.projectBio &&
				Object.assign(formData, { bio: values.projectBio });

			projectData!.description !== values.projectIdea &&
				Object.assign(formData, { description: values.projectIdea });
			projectData!.projectWebsite !== values.websiteUrl &&
				Object.assign(formData, { projectWebsite: values.websiteUrl });
			projectData!.twitterLinkedinUrl !== values.socialMediaUrl &&
				Object.assign(formData, { twitterLinkedinUrl: values.socialMediaUrl });

			if (Object.entries(formData).length === 1) return toast.info('No changes made');

			try {
				await editProjectMutation.mutateAsync(formData);
				toast.info('Project updated successfully');

				navigate(ROUTES.projects.details.replace(/:id/, projectId.toString()));
			} catch (err) {
				toast.error('Something went wrong, try again');
			}
		},
	});

	const { values, isValid } = formik;

	// #endregion

	// *~~~ http req ~~~* //
	// #region

	const projectQuery = useQuery(
		[QUERY_KEYS.GET_ONE_PROJECT, projectId],
		() => QueryApi.projects.getOne(projectId),
		{
			onSuccess: (data) => {
				formik.setValues({
					...values,

					// images
					projectCover: data.logoPath,
					file1: data.fileUpload1,
					file2: data.fileUpload2,
					file3: data.fileUpload3,

					projectBio: data.bio,
					projectIdea: data.description,
					websiteUrl: data.projectWebsite,
					socialMediaUrl: data.twitterLinkedinUrl,
				});
			},
		}
	);
	const { data: projectData } = projectQuery;

	const editProjectMutation = useMutation({
		mutationFn: (fData: EditProjectDto) => QueryApi.projects.editProject(fData),
	});

	const signedUrlMutation = useMutation({
		mutationFn: (filename: string) => QueryApi.images.getPresignedUrl(filename),
	});

	const postImgMutation = useMutation({
		mutationFn: ({ file, signedUrl }: { file: File; signedUrl: string }) =>
			QueryApi.images.postImage(signedUrl, file),
	});

	// #endregion

	// *~~~ http req ~~~* //

	const ctxObject = {
		projectQuery,
		formik,
	};

	return <QueryCtx.Provider value={ctxObject}>{children}</QueryCtx.Provider>;
}
