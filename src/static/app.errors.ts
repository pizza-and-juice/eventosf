import ERROR_CODES from 'src/static/enums/error-codes.enum';

// auth errors

export interface AppError {
	message: string;
	code: number;
}

// *~~~ image errors ~~~* //
export class ImageSizeTooLarge extends Error {
	message: string = 'Size of the image is too large';
	code = ERROR_CODES.IMAGE_SIZE_TOO_LARGE;
}

export class ImageInvalidType extends Error {
	message: string = 'image format is not supported';
	code = ERROR_CODES.IMAGE_INVALID_TYPE;
}

export class ImageInvalidDimensions extends Error {
	message: string =
		'Image dimensions are invalid, make sure the image is not bigger than 1000x1000 and is a square';
	code = ERROR_CODES.IMAGE_INVALID_DIMENSIONS;
}

export class PresignedUrlError extends Error {
	message: string = 'Error while uploading image';
	code = ERROR_CODES.IMAGE_PRESIGNED_URL_ERROR;
}

export class UploadImageError extends Error {
	message: string = 'Error while uploading image';
	code = ERROR_CODES.UPLOAD_IMAGE_ERROR;
}
