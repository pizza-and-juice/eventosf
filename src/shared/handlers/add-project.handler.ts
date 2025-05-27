import { PresignedUrlError, UploadImageError } from 'src/static/app.errors';
import QueryApi from '../api/query-api';
import { ChainHandler } from './abstract-handler';

type AddProjectRequest = {
	images: {
		key: string;
		file: File;
	}[];
	userId: string;
};

export class UploadImageHandler extends ChainHandler {
	async handle(request: AddProjectRequest): Promise<void> {
		const images = request.images;
		const userId = request.userId;

		const imgUrls: { [key: string]: string } = {
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
				const filename = `projects/${userId}/${date}/${file.name}`;
				const res = await QueryApi.images.getPresignedUrl(filename);

				signedUrls.push(res);
				filenames.push(filename);
			}
		} catch (err) {
			throw new PresignedUrlError();
		}

		try {
			for (let i = 0; i < images.length; i++) {
				const file = images[i].file as any as File;

				await QueryApi.images.postImage(signedUrls[i], file);

				const key_ = images[i].key;

				imgUrls[key_] = `${import.meta.env.VITE_APP_IMG_URL}/${filenames[i]}`;
			}
		} catch (err) {
			throw new UploadImageError();
		}
	}
}
