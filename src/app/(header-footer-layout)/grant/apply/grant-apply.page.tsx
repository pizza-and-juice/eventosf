// react
import { useContext, useEffect, useLayoutEffect, useState } from 'react';

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
import NormalDropdown from 'src/components/internal/dropdown/dropdown.component';
import ProjectCover from 'src/components/internal/project-cover/project-cover.component';

// static
import { DeploymentType } from 'src/static/enums/projects-deployment.enum';
import { useMutation } from 'react-query';
import { AddProjectDto } from 'src/shared/api/dto/project/add-project.dto';
import APP_MODALS from 'src/static/enums/app.modals';
import UserService from 'src/shared/services/user/user.service';
import UserSvcContext from 'src/shared/services/user/user.context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'src/static/router.data';
import DocumentTitleService from 'src/shared/services/doc-title/doc-title.service';
import DocTitleSvcContext from 'src/shared/services/doc-title/doc-title.context';

import styles from './grant.module.css';
import Chip from 'src/components/internal/chip/chip.component';

const twitterRegex = /^(https?:\/\/)?((w{3}\.)?)twitter\.com\/(#!\/)?[a-z0-9_]+$/i;
const linkedInRegex = /^(https?:\/\/)?((w{3}\.)?)linkedin\.com\/.*/i;
const xRegex = /^(https?:\/\/)?((w{3}\.)?)x\.com\/.*/i;

function MainContent() {
	// *~~~ inject dependencies ~~~* //
	// #region dependencies

	useContext<DocumentTitleService>(DocTitleSvcContext).setTitle('Apply for grant');
	const authSvc = useContext<AuthService>(AuthSvcContext);
	const modalSvc = useContext<ModalService>(ModalSvcContext);
	const userSvc = useContext<UserService>(UserSvcContext);

	const navigate = useNavigate();

	// #endregion

	// *~~~ dropdown options ~~~* //
	// #region

	const categoriesOptions = [
		{ id: 0, label: 'NFTs', value: 'nfts' },
		{ id: 1, label: 'GameFi', value: 'gamefi' },
		{ id: 2, label: 'SocialFi', value: 'socialfi' },
		{ id: 3, label: 'Metaverse', value: 'metaverse' },
		{ id: 4, label: 'Wallets', value: 'wallets' },
		{ id: 5, label: 'DAOs', value: 'daos' },
		{ id: 6, label: 'Infrastructure', value: 'infrastructure' },
		{ id: 7, label: 'Layer1', value: 'layer1' },
		{ id: 8, label: 'Layer2', value: 'layer2' },
		{ id: 9, label: 'Defi', value: 'defi' },
		{ id: 10, label: '2-Earn', value: '2-earn' },
		{ id: 11, label: 'Exchanges', value: 'exchanges' },
		{ id: 12, label: 'Software', value: 'software' },
		{ id: 13, label: 'Hardware', value: 'hardware' },
		{ id: 14, label: 'AI', value: 'ai' },
		{ id: 15, label: 'VR/AR', value: 'vr/ar' },
		{ id: 16, label: 'Merchandise', value: 'merchandise' },
		{ id: 17, label: 'Blockchain', value: 'blockchain' },
		{ id: 18, label: 'Technology', value: 'technology' },
		{ id: 19, label: 'Depin', value: 'depin' },
		{ id: 20, label: 'RWA', value: 'rwa' },
		{ id: 21, label: 'Stablecoin', value: 'stablecoin' },
		{ id: 22, label: 'Payment', value: 'payment' },
		{ id: 23, label: 'Supply Chain', value: 'supply chain' },
		{ id: 24, label: 'Privacy', value: 'privacy' },
		{ id: 25, label: 'Other', value: 'other' },
	];

	const frameworkOptions = [
		{ id: 0, label: 'Java', value: 'java' },
		{ id: 1, label: 'JavaScript', value: 'javascript' },
		{ id: 2, label: 'Rust', value: 'rust' },
		{ id: 3, label: 'Solidity', value: 'solidity' },
		{ id: 4, label: 'Move', value: 'move' },
		{ id: 5, label: 'C#', value: 'c#' },
		{ id: 6, label: 'C++', value: 'c++' },
		{ id: 7, label: 'C', value: 'c' },
		{ id: 8, label: 'Python', value: 'python' },
		{ id: 9, label: 'Golang', value: 'golang' },
		{ id: 10, label: 'Other', value: 'other' },
	];

	const deploymentOptions = [
		{ label: 'External VM', value: DeploymentType.EXTERNAL_VM },
		{ label: 'Bitcoin+ side chain', value: DeploymentType.BITCON_DAPP },
		{ label: 'Software based application', value: DeploymentType.SOFTWARE_BASED_APP },
		{ label: 'Ethereum+ side chain', value: DeploymentType.ETH_DAPP },
	];

	const currencyOptions = [
		{ label: 'USDT', value: 'usdt' },
		{ label: 'USDC', value: 'usdc' },
		{ label: 'PWR', value: 'pwr' },
	];

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
		initialValues: {
			// main details
			projectName: '',
			projectBio: '',
			projectIdea: '',
			websiteUrl: '',
			socialMediaUrl: '',

			projectCover: '',

			// grant currency
			currency: '',
			grantAmount: '',

			// project framework
			projectFramework: '',

			// file upload
			file1: '',
			file2: '',
			file3: '',

			// project deployment
			projectDeployment: '',

			// project categories
			projectCategories: [] as string[],

			// contact details
			contactTgUsername: '',
			contactSocialMediaUrl: '',
			contactEmailAddress: '',
			contactWalletAddress: '',

			// accept terms and conditions
			acceptTerms: false,
		},
		validationSchema: yup.object({
			// main details
			projectName: yup
				.string()
				.trim() // Trims whitespace
				.max(100, 'Project name cannot be more than 100 characters') //
				.required('Project name is required')
				.max(100, 'Project name cannot be more than 100 characters') // Set max length
				.test(
					'is-not-blank',
					'Please enter valid data',
					(value) => value?.trim().length > 0
				),

			projectBio: yup
				.string()
				.trim() // Trims whitespace
				.max(160, 'Character limit exceeded')
				.required('Bio is required')
				.test(
					'is-not-blank',
					'Please enter valid data',
					(value) => value?.trim().length > 0
				),

			projectIdea: yup
				.string()
				.trim() // Trims whitespace
				.max(1000, 'Character limit exceeded')
				.required('Description is required')
				.test(
					'is-not-blank',
					'Please enter valid data',
					(value) => value?.trim().length > 0
				),

			projectCover: yup.string().required('required'),
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

			currency: yup.string().required('required'),
			grantAmount: yup.number().required('required'),

			projectFramework: yup.string().required('required'),

			file1: yup.string().required('required'),
			file2: yup.string(),
			file3: yup.string(),

			projectDeployment: yup.string().required('required'),

			projectCategories: yup.array().of(yup.string()).min(1, 'required'),

			contactTgUsername: yup
				.string()
				.required('Telegram Username is required')
				.matches(/^\S*$/, 'Telegram Username should not contain spaces')
				.trim(),
			contactEmailAddress: yup.string().email('Invalid email').required('required'),
			contactSocialMediaUrl: yup
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
			contactWalletAddress: yup
				.string()
				.matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address')
				.required('required'),
		}),

		onSubmit: async (values) => {
			if (!isValid) return;

			if (!authSvc.isLoggedIn()) {
				modalSvc.open(APP_MODALS.LOGIN_MODAL);
				return;
			}

			// try uploading images first

			const images = [
				{ key: 'projectCover', file: values.projectCover },
				{ key: 'file1', file: values.file1 },
			];

			values.file2 && images.push({ key: 'file2', file: values.file2 });
			values.file3 && images.push({ key: 'file3', file: values.file3 });

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
					const file = images[i].file as any as File;

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
					const file = images[i].file as any as File;
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

			const formData: AddProjectDto = {
				projectName: values.projectName,
				bio: values.projectBio,
				description: values.projectIdea,
				projectWebsite: values.websiteUrl,
				socialMediaUrl: values.socialMediaUrl,
				logo: imgUrls.projectCover,
				fileUpload1: imgUrls.file1,
				fileUpload2: imgUrls.file2,
				fileUpload3: imgUrls.file3,
				// projectFramework: codingLangValue,
				projectDeployment: values.projectDeployment,

				currency: values.currency,
				grantAmount: +values.grantAmount,
				framework: values.projectFramework,

				categories: JSON.stringify(values.projectCategories),

				telegramUsername: values.contactTgUsername,
				email: values.contactEmailAddress,
				twitterLinkedinUrl: values.contactSocialMediaUrl,
				walletAddress: values.contactWalletAddress,
				gUserId: userSvc.getUserData().id,
			};

			try {
				const res = await postProjectMutation.mutateAsync(formData);
				toast.info('Project submitted successfully');

				navigate(ROUTES.projects.details.replace(/:id/, res.id));
			} catch (err) {
				toast.error('Something went wrong, try again');
			}
		},
	});

	const {
		getFieldProps,
		handleSubmit,
		values,
		touched,
		errors,
		isValid,
		isSubmitting,
		setFieldValue,
	} = formik;

	// #endregion

	// *~~~ http req ~~~* //
	const postProjectMutation = useMutation({
		mutationFn: (fData: AddProjectDto) => QueryApi.projects.add(fData),
	});

	const signedUrlMutation = useMutation({
		mutationFn: (filename: string) => QueryApi.images.getPresignedUrl(filename),
	});

	const postImgMutation = useMutation({
		mutationFn: ({ file, signedUrl }: { file: File; signedUrl: string }) =>
			QueryApi.images.postImage(signedUrl, file),
	});

	function onCategoryChange(e: any) {
		const { value } = e.target;
		const categories = values.projectCategories;

		if (categories.length >= 3) {
			return;
		}

		setFieldValue('projectCategories', [...categories, value]);
	}

	function removeCategory(category: string) {
		const categories = values.projectCategories;

		const newCategories = categories.filter((c) => c !== category);

		setFieldValue('projectCategories', newCategories);
	}

	// set project cover file
	function onLogoUpload(file: File) {
		setFieldValue('projectCover', file);
	}
	// set first file image uploader
	const fileToUpload1 = (file: any) => {
		setFieldValue('file1', file);
	};
	// set second folder image uploader
	const fileToUpload2 = (file: any) => {
		setFieldValue('file2', file);
	};
	// set third folder for image uploader
	const fileToUpload3 = (file: any) => {
		setFieldValue('file3', file);
	};

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

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		// Check if the form is submitting and if there are any errors
		if (isSubmitting && !isValid) {
			// Scroll to the top of the page
			window.scrollTo({
				top: 0,
				behavior: 'smooth', // Optional: for smooth scrolling
			});
		}
		if (isSubmitting && !isValid) {
			// Scroll to the top of the page

			toast.error('Please enter valid data for all required fields.');
		}
	}, [isSubmitting, errors, isValid]);

	return (
		<main className="w-full lg:max-w-[700px] 2xl:max-w-[940px] 3xl:max-w-[1324px] space-y-10">
			{/* titles */}
			<section className="space-y-2">
				<h1 className="text-xl sm:text-4xl font-bold text-black dark:text-white">
					Apply For Grant
				</h1>

				<p className="text-sm sm:text-base  text-agrey-700 dark:text-agrey-400">
					Apply for a PWR Blockchain Grant today and transform your vision into reality.
					Our grants are designed to empower innovators and pioneers like you!
				</p>
			</section>

			<form onSubmit={handleSubmit} className="space-y-10">
				{/* project details */}
				<section className="space-y-6" id="grant.apply.project-details">
					{/* project details titles */}
					<div>
						<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
							Project Details
						</h2>
						<p className="text-sm sm:text-base  text-agrey-700 dark:text-agrey-400">
							Please add your project information, this will be visible for others to
							see.
						</p>
					</div>

					{/* project details con section */}
					<fieldset className="space-y-4">
						{/* project name */}
						<div className="field space-y-1">
							<label className="text-xs  text-black dark:text-white">
								Project Name *
							</label>
							<div className="form-control">
								<input
									type="text"
									placeholder="Enter your project name"
									className={`text-field ${touched.projectName && errors.projectName && 'invalid'
										}`}
									{...getFieldProps('projectName')}
								/>
								{touched.projectName && errors.projectName && (
									<div className="text-ared-500 text-xs">
										{errors.projectName}
									</div>
								)}
							</div>
						</div>

						{/* project cover  */}
						<div className="field space-y-1">
							<label
								htmlFor=""
								className="text-abrandc-dark-black text-[12px] font-normal dark:text-white"
							>
								Project cover *
							</label>

							<ProjectCover onFileChange={onLogoUpload} onFileDelete={deleteLogo} />

							{touched.projectCover && errors.projectCover && (
								<div className="text-ared-500 text-xs">{errors.projectCover}</div>
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
									className={` text-field h-[152px] ${touched.projectBio && errors.projectBio && 'invalid'
										}`}
									{...getFieldProps('projectBio')}
								></textarea>
								{touched.projectBio && errors.projectBio && (
									<div className="text-ared-500 text-xs">{errors.projectBio}</div>
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
									className={` text-field h-[152px] ${touched.projectIdea && errors.projectIdea && 'invalid'
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
									className={` text-field ${touched.websiteUrl && errors.websiteUrl && 'invalid'
										}`}
									{...getFieldProps('websiteUrl')}
								/>
								{touched.websiteUrl && errors.websiteUrl && (
									<div className="text-ared-500 text-xs">{errors.websiteUrl}</div>
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
									className={`text-field ${touched.socialMediaUrl && errors.socialMediaUrl && 'invalid'
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
				<section className="space-y-6" id="grant.apply.file-upload">
					<div>
						<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
							File Upload *
						</h2>
						<p className="text-sm sm:text-base text-agrey-700 dark:text-agrey-400">
							Please add your project information, this will be visible for others to
							see.
						</p>
					</div>

					<fieldset>
						{/* upload images */}
						<div className="field">
							<div className="grid grid-cols-1 grid-rows-3 sm:grid-cols-3 sm:grid-rows-1 gap-x-6 gap-y-3">
								<ImageUploader
									onFileChange={fileToUpload1}
									onFileDelete={deleteFile1}
									title="Upload File 1"
								/>
								<ImageUploader
									onFileChange={fileToUpload2}
									onFileDelete={deleteFile2}
									title="Upload File 2"
								/>
								<ImageUploader
									onFileChange={fileToUpload3}
									onFileDelete={deleteFile3}
									title="Upload File 3"
								/>
							</div>

							{touched.file1 && errors.file1 && (
								<div className="text-ared-500 text-xs">{errors.file1}</div>
							)}
						</div>
					</fieldset>
				</section>

				{/* grant currency */}
				<section className="space-y-6" id="grant.apply.grant-details">
					<div>
						<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
							Grant Details
						</h2>
						<p className="text-sm sm:text-base text-agrey-700 dark:text-agrey-400">
							Select a preferred grant currency
						</p>
					</div>

					<fieldset className="space-y-4">
						{/* grant  currency */}
						<div className="field space-y-1">
							<label className="text-xs text-black dark:text-white">currency *</label>
							<div className="grid grid-cols-3 gap-x-3">
								{currencyOptions.map((option, idx) => (
									<div className="form-control" key={idx}>
										<label className="flex items-center gap-x-2  h-[48px] p-2.5 bg-light-900 dark:bg-dark-900 rounded-xl cursor-pointer border border-transparent hover:border-ablue-200 hover:dark:border hover:dark:border-ablue-400">
											<input
												className="checkbox"
												type="radio"
												{...getFieldProps('currency')}
												value={option.value}
											/>
											<h6 className="text-black dark:text-white">
												{option.label}
											</h6>
										</label>
									</div>
								))}
							</div>

							{touched.currency && errors.currency && (
								<div className="text-ared-500 text-xs">{errors.currency}</div>
							)}
						</div>

						{/* grant amount */}
						<div className="field space-y-1">
							<label className="text-xs  text-black dark:text-white">
								Ideal Grant Amount (approx. in USD) *
							</label>
							<div className="form-control">
								<input
									type="number"
									placeholder="Enter the Grant Amount"
									className={`text-field ${touched.grantAmount && errors.grantAmount && 'invalid'
										}`}
									{...getFieldProps('grantAmount')}
								/>
								{touched.grantAmount && errors.grantAmount && (
									<div className="text-ared-500 text-xs">
										{errors.grantAmount}
									</div>
								)}
							</div>
						</div>
					</fieldset>
				</section>

				{/* project framework */}
				<section className="space-y-6" id="grant.apply.project-framework">
					<div>
						<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
							Project Framework
						</h2>
						<p className="text-sm sm:text-base text-agrey-700 dark:text-agrey-400">
							Select the programming language or framework your project will be using.
						</p>
					</div>

					<fieldset>
						<div className="field space-y-1">
							<label className="text-abrandc-dark-black text-[12px] font-normal dark:text-white">
								framework or programming language *
							</label>
							<div className="form-control">
								<NormalDropdown
									className={`${touched.projectFramework &&
										errors.projectFramework &&
										'invalid'
										}`}
									options={frameworkOptions}
									{...getFieldProps('projectFramework')}
								/>
							</div>

							{touched.projectFramework && errors.projectFramework && (
								<div className="text-ared-500 text-xs">
									{errors.projectFramework}
								</div>
							)}
						</div>
					</fieldset>
				</section>

				{/* Project Deployment */}
				<section className="space-y-6 " id="grant.apply.project-deployment">
					<div>
						<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
							Project Deployment
						</h2>
						<p className="text-sm sm:text-base text-agrey-700 dark:text-agrey-400">
							Select how you want to deploy your project
						</p>
					</div>

					<fieldset>
						{/* grant  currency */}
						<div className="field space-y-1">
							<label
								htmlFor=""
								className="text-abrandc-dark-black text-[12px] font-normal dark:text-white"
							>
								type of deployment *
							</label>
							<div className=" grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2 gap-3">
								{deploymentOptions.map((option, idx) => (
									<div className="form-control" key={idx}>
										<label className="flex items-center gap-x-2  h-[48px] p-2.5 bg-light-900 dark:bg-dark-900 rounded-xl cursor-pointer border border-transparent hover:border-ablue-200 hover:dark:border hover:dark:border-ablue-400">
											<input
												className="checkbox"
												type="radio"
												{...getFieldProps('projectDeployment')}
												value={option.value}
											/>
											<h6 className="text-black dark:text-white">
												{option.label}
											</h6>
										</label>
									</div>
								))}

								{touched.projectDeployment && errors.projectDeployment && (
									<div className="text-ared-500 text-xs">
										{errors.projectDeployment}
									</div>
								)}
							</div>
						</div>
					</fieldset>
				</section>

				{/* project categories */}
				<section className="space-y-6" id="grant.apply.project-categories">
					<div>
						<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
							Categories
						</h2>
						<p className="text-sm sm:text-base text-agrey-700 dark:text-agrey-400">
							Select the categories for your project (3 Max.)
						</p>
					</div>

					<fieldset className="space-y-4">
						<div className="field space-y-1">
							<label className="text-abrandc-dark-black text-[12px] font-normal dark:text-white">
								categories *
							</label>

							<div className="form-control">
								<NormalDropdown
									className={`${touched.projectCategories &&
										errors.projectCategories &&
										'invalid'
										}`}
									options={categoriesOptions.filter(
										(c) => !values.projectCategories.includes(c.value)
									)}
									name="projectCategories"
									onChange={onCategoryChange}
									disabled={values.projectCategories.length >= 3}
								/>
							</div>

							<ul className="flex gap-x-4">
								{values.projectCategories.map((c, id) => (
									<li key={id}>
										<Chip onDelete={() => removeCategory(c)}>{c}</Chip>
									</li>
								))}
							</ul>
							{touched.projectCategories && errors.projectCategories && (
								<div className="text-ared-500 text-xs">
									{errors.projectCategories}
								</div>
							)}
						</div>
					</fieldset>
				</section>

				{/* contact details */}
				<section className="space-y-6" id="grant.apply.contact-details">
					<div>
						<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
							Contact Details
						</h2>
						<p className="text-sm sm:text-base text-agrey-700 dark:text-agrey-400">
							Please enter your personal contact details
						</p>
					</div>

					<fieldset className="space-y-4">
						{/* telegram username */}
						<div className="field space-y-1">
							<label className="text-xs  text-black dark:text-white">
								Telegram Username *
							</label>
							<div className="form-control">
								<input
									type="text"
									placeholder="Enter your telegram username"
									className={`text-field !pl-9 ${touched.contactTgUsername &&
										errors.contactTgUsername &&
										'invalid'
										}`}
									{...getFieldProps('contactTgUsername')}
								/>
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 text-black dark:text-white">
									<i className="fa-regular fa-at"></i>
								</div>
							</div>
							{touched.contactTgUsername && errors.contactTgUsername && (
								<div className="text-ared-500 text-xs">
									{errors.contactTgUsername}
								</div>
							)}
						</div>

						{/* email */}
						<div className="field space-y-1">
							<label className="text-xs  text-black dark:text-white">
								Email Address *
							</label>
							<div className="form-control">
								<input
									type="text"
									placeholder="Enter your email"
									className={`text-field ${touched.contactEmailAddress &&
										errors.contactEmailAddress &&
										'invalid'
										}`}
									{...getFieldProps('contactEmailAddress')}
								/>
								{touched.contactEmailAddress && errors.contactEmailAddress && (
									<div className="text-ared-500 text-xs">
										{errors.contactEmailAddress}
									</div>
								)}
							</div>
						</div>

						{/* twitter / linked in */}
						<div className="field space-y-1">
							<label className="text-xs text-black dark:text-white">
								Twitter/LinkedIn profile *
							</label>
							<div className="form-control">
								<input
									type="text"
									placeholder="Enter your Twitter or LinkedIn profile"
									className={`text-field ${touched.contactSocialMediaUrl &&
										errors.contactSocialMediaUrl &&
										'invalid'
										}`}
									{...getFieldProps('contactSocialMediaUrl')}
								/>
								{touched.contactSocialMediaUrl && errors.contactSocialMediaUrl && (
									<div className="text-ared-500 text-xs">
										{errors.contactSocialMediaUrl}
									</div>
								)}
							</div>
						</div>

						{/* Wallet address */}
						<div className="field space-y-1">
							<label className="text-xs  text-black dark:text-white">
								Wallet Address *
							</label>
							<div className="form-control">
								<input
									type="text"
									placeholder="Enter your wallet address"
									className={`text-field ${touched.contactWalletAddress &&
										errors.contactWalletAddress &&
										'invalid'
										}`}
									{...getFieldProps('contactWalletAddress')}
								/>
								{touched.contactWalletAddress && errors.contactWalletAddress && (
									<div className="text-ared-500 text-xs">
										{errors.contactWalletAddress}
									</div>
								)}
							</div>
						</div>
					</fieldset>
				</section>

				{/* send */}
				<section className="space-y-6" id="grant.apply.submit">
					<div>
						<label className="flex items-center gap-x-2">
							<input
								type="checkbox"
								className="checkbox"
								// onChange={() => checked.value.dispatch(!checked.value)}
								{...getFieldProps('acceptTerms')}
							/>
							<span className="text-sm text-agrey-700">
								By proceeding you agree to PWR’s{' '}
								<a
									href="https://www.pwrlabs.io/community-terms"
									target="_blank"
									rel="noopener noreferrer"
									className="underline hover:text-ablue-200 transition duration-200 ease-n-out"
								>
									Terms of Use
								</a>{' '}
								and{' '}
								<a
									href="https://www.pwrlabs.io/community-privacy"
									target="_blank"
									rel="noopener noreferrer"
									className=" underline hover:text-ablue-200 transition duration-200 ease-n-out"
								>
									Privacy Policy
								</a>
								.
							</span>
						</label>
					</div>

					<div>
						<Button
							disabled={!values.acceptTerms}
							className={`blue ${isSubmitting && 'loading'}`}
							type="submit"
						>
							Submit request
						</Button>
					</div>
				</section>
			</form>
		</main>
	);
}

function Sidebar() {
	const [activeSection, setActiveSection] = useState<number>(0);
	const link_group = [
		{
			title: 'Apply',
			links: [
				{
					name: 'Project Details',
					onClick: () => {
						window.location.href = '#grant.apply.project-details';
					},
				},
				{
					name: 'File Upload',
					onClick: () => {
						window.location.href = '#grant.apply.file-upload';
					},
				},
				{
					name: 'Grant Details',
					onClick: () => {
						window.location.href = '#grant.apply.grant-details';
					},
				},
				{
					name: 'Project Framework',
					onClick: () => {
						window.location.href = '#grant.apply.project-framework';
					},
				},
				{
					name: 'Project Deployment',
					onClick: () => {
						window.location.href = '#grant.apply.project-deployment';
					},
				},
				{
					name: 'Personal Contact',
					onClick: () => {
						window.location.href = '#grant.apply.contact-details';
					},
				},
			],
		},
	];

	useLayoutEffect(() => {
		const sec1 = document.getElementById('grant.apply.project-details')!;
		const sec2 = document.getElementById('grant.apply.file-upload')!;
		const sec3 = document.getElementById('grant.apply.grant-details')!;
		const sec4 = document.getElementById('grant.apply.project-framework')!;
		const sec5 = document.getElementById('grant.apply.project-deployment')!;
		const sec6 = document.getElementById('grant.apply.contact-details')!;

		const secs = [sec1, sec2, sec3, sec4, sec5, sec6];

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
	}, []);

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
										className={`prj-aside-button ${idx2 === activeSection && 'active'
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

export default function ApplyForGrantPage() {
	return (
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
	);
}
