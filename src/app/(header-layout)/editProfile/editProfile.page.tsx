// react
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// formik
import { useFormik } from 'formik';

// auth svc
import AuthService from 'src/shared/services/auth/auth.service';
import AuthSvcContext from 'src/shared/services/auth/auth.context';

// react query
import QUERY_KEYS from 'src/static/query.keys';
import QueryApi from 'src/shared/api/query-api';
import { useMutation } from 'react-query';
import { useQuery } from 'react-query';

// components
import '../../../components/internal/text-field/text-field.scss';
import Button from 'src/components/internal/button/button.component';

// static
import { EditProfileInfoDto } from 'src/shared/api/dto/profile/edit-profile.dto';
import UserService from 'src/shared/services/user/user.service';
import UserSvcContext from 'src/shared/services/user/user.context';
import ROUTES from 'src/static/router.data';
import DocumentTitleService from 'src/shared/services/doc-title/doc-title.service';
import DocTitleSvcContext from 'src/shared/services/doc-title/doc-title.context';
import { toast } from 'react-toastify';
import ProfileCover from 'src/components/internal/profile-cover/profile-cover.component';
import * as Yup from 'yup';

// Validation schema using Yup
// const validationSchema = Yup.object({
// 	name: Yup.string().required('Name is required'),
// 	bio: Yup.string().required('Bio is required'),
// 	twitterProfile: Yup.string().url('Invalid Twitter URL'),
// 	linkedInProfile: Yup.string().url('Invalid LinkedIn URL'),
// 	telegramProfile: Yup.string(),
// });

export default function EditProfilePage() {
	// *~~~ inject dependencies ~~~* //
	// #region
	useContext<DocumentTitleService>(DocTitleSvcContext).setTitle('Edit Profile');
	const authSvc = useContext<AuthService>(AuthSvcContext);
	const userSvc = useContext<UserService>(UserSvcContext);

	const navigate = useNavigate();
	// #endregion

	const [file, setFile] = useState<File>();
	const validationSchema = Yup.object({
		name: Yup.string().required('Name is required'),
		bio: Yup.string().required('Bio is required'),
		twitterProfile: Yup.string().matches(
			/^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}\/?$/,
			'Invalid Twitter URL'
		),
		linkedInProfile: Yup.string().matches(
			/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
			'Invalid LinkedIn URL'
		),
		telegramProfile: Yup.string(),
	});
	function fileToUpload(file: any) {
		setFile(file);
	}

	// fetch profile
	const {
		data: profileData,
		isLoading: profileDataLoading,
		// isError: profileError,
	} = useQuery(
		[QUERY_KEYS.PROFILE_DATA, userSvc.getUserData().id],
		() => QueryApi.user.googleGetInfo(userSvc.getUserData().id),
		{
			onSuccess: (data) => {
				formik.setValues({
					name: data.name,
					bio: data.bio,
					twitterProfile: data.twitterUrl,
					linkedInProfile: data.linkedinUrl,
					telegramProfile: data.telegramUrl,
				});
			},
			enabled: !!authSvc.isLoggedIn(),
		}
	);

	const formik = useFormik({
		initialValues: {
			name: '',
			bio: '',
			twitterProfile: '',
			linkedInProfile: '',
			telegramProfile: '',
		},
		validationSchema,

		// validationSchema,
		onSubmit: () => {
			updateProfileData();
		},
	});

	const editProfileInfo = useMutation({
		mutationFn: (data: EditProfileInfoDto) => QueryApi.profile.editProfile(data),
	});

	const signedUrlMutation = useMutation({
		mutationFn: (filename: string) => QueryApi.images.getPresignedUrl(filename),
	});

	const postImgMutation = useMutation({
		mutationFn: ({ file, signedUrl }: { file: File; signedUrl: string }) =>
			QueryApi.images.postImage(signedUrl, file),
	});

	async function updateProfileData() {
		let newFile = '';
		if (file) {
			const extension = file.name.split('.').pop();
			const filename = `users/pfp/${userSvc.getUserData().id}/pfp.${extension}`;
			try {
				const url = await signedUrlMutation.mutateAsync(filename);

				await postImgMutation.mutateAsync({ file, signedUrl: url });

				newFile = `${import.meta.env.VITE_APP_IMG_URL}/${filename}`;
			} catch (error) {
				toast.error('Error uploading image');
				// console.error(error)
				return;
			}
		}

		const formData: EditProfileInfoDto = {
			id: userSvc.getUserData().id,
		};

		profileData!.name !== formik.values.name &&
			Object.assign(formData, { name: formik.values.name });
		profileData!.bio !== formik.values.bio &&
			Object.assign(formData, { bio: formik.values.bio });
		profileData!.twitterUrl !== formik.values.twitterProfile &&
			Object.assign(formData, { twitterUrl: formik.values.twitterProfile });

		profileData!.linkedinUrl !== formik.values.linkedInProfile &&
			Object.assign(formData, { linkedinUrl: formik.values.linkedInProfile });

		profileData!.telegramUrl !== formik.values.telegramProfile &&
			Object.assign(formData, { telegramUrl: formik.values.telegramProfile });

		if (newFile) Object.assign(formData, { pictureUrl: newFile });

		try {
			await editProfileInfo.mutateAsync(formData);

			toast.info('Profile updated successfully');

			navigate(ROUTES.profile.root.replace(':id', userSvc.getUserData().id));
		} catch (error) {
			toast.error('Error updating profile');
			// console.error(error)
		}
	}

	if (!profileData || profileDataLoading) return <div>Loading...</div>;

	return (
		<main className="max-w-[940px] lg:mx-auto mx-4">
			<div className="space-y-10">
				{/* Header */}
				<div className="space-y-2 px-2">
					<h1 className="dark:text-white text-4xl !leading-[44px] font-bold py-1">
						Edit Profile
					</h1>
				</div>
				{/* Body */}
				{/* profile photo */}
				<div className="space-y-1">
					<h3 className="dark:text-white text-xs !leading-[18px]">Profile Photo</h3>
					<ProfileCover
						onFileChange={fileToUpload}
						title="Profile picture"
						onFileDelete={() => setFile(undefined)}
						initialImage={profileData.pictureUrl}
					/>
				</div>
				<form onSubmit={formik.handleSubmit} className="space-y-4">
					{/* Name Input */}
					<div className="field space-y-1 pb-[18px]">
						<label
							htmlFor="name"
							className="dark:text-white text-xs !leading-[18px] px-2"
						>
							Name
						</label>
						<input
							id="name"
							name="name"
							type="text"
							placeholder="Enter your name"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.name}
							className="text-field"
						/>

						{formik.touched.name && formik.errors.name ? (
							<div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
						) : null}
					</div>

					{/* Bio Input */}
					<div className="field space-y-1 !pb-[18px]">
						<label
							htmlFor="bio"
							className="dark:text-white text-xs !leading-[18px] px-2"
						>
							Bio
						</label>
						<textarea
							id="bio"
							name="bio"
							placeholder="A short bio..."
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.bio}
							className="text-field"
						></textarea>
						{formik.touched.bio && formik.errors.bio ? (
							<div className="text-red-500 text-xs mt-1">{formik.errors.bio}</div>
						) : null}
					</div>

					{/* Twitter Profile Input */}
					<div className="field space-y-1 !pb-[18px]">
						<div className="relative">
							<label
								htmlFor="twitterProfile"
								className="dark:text-white text-xs !leading-[18px] px-2"
							>
								Twitter Profile
							</label>
							<input
								id="twitterProfile"
								name="twitterProfile"
								type="text"
								placeholder="https://www.twitter.com/username"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.twitterProfile}
								className="text-field pl-11"
							/>
							<i className="fa-brands fa-x-twitter absolute left-3.5 bottom-[15px] dark:text-agrey-400 text-agrey-700"></i>
						</div>

						{formik.touched.twitterProfile && formik.errors.twitterProfile ? (
							<div className="text-red-500 text-xs mt-1">
								{formik.errors.twitterProfile}
							</div>
						) : null}
					</div>

					{/* LinkedIn Profile Input */}
					<div className="field space-y-1 !pb-[18px]">
						<div className="relative">
							<label
								htmlFor="linkedInProfile"
								className="dark:text-white text-xs !leading-[18px] px-2"
							>
								LinkedIn Profile
							</label>
							<input
								id="linkedInProfile"
								name="linkedInProfile"
								type="text"
								placeholder="https://www.linkedin.com/in/username"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.linkedInProfile}
								className="text-field pl-11"
							/>
							<i className="fa-brands fa-linkedin-in absolute left-3.5 bottom-[15px] dark:text-agrey-400 text-agrey-700"></i>
						</div>
						{formik.touched.linkedInProfile && formik.errors.linkedInProfile ? (
							<div className="text-red-500 text-xs mt-1">
								{formik.errors.linkedInProfile}
							</div>
						) : null}
					</div>

					{/* Telegram Profile Input */}
					<div className="field space-y-1 !pb-[18px]">
						<div className="relative">
							<label
								htmlFor="telegramProfile"
								className="dark:text-white text-xs !leading-[18px] px-2"
							>
								Telegram Profile
							</label>
							<input
								id="telegramProfile"
								name="telegramProfile"
								type="text"
								placeholder="username"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.telegramProfile}
								className="text-field pl-11"
							/>
							<i className="fa-solid fa-paper-plane absolute left-3.5 bottom-[15px] dark:text-agrey-400 text-agrey-700"></i>
						</div>
						{formik.touched.telegramProfile && formik.errors.telegramProfile ? (
							<div className="text-red-500 text-xs mt-1">
								{formik.errors.telegramProfile}
							</div>
						) : null}
					</div>

					{/* Submit Button */}
					<div className="flex justify-start !mt-10 ">
						<Button
							disabled={!formik.dirty}
							type="submit"
							className={`blue !w-[96px] hover:scale-105 transition duration-300 ease-in-out ${
								formik.isSubmitting && 'loading'
							}`}
						>
							Save
						</Button>
					</div>
				</form>
			</div>
		</main>
	);
}
