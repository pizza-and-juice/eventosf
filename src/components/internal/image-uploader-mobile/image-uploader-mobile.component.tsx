// react
import { useState, useRef, useEffect } from 'react';

// components
import Spinner from 'src/components/internal/spinner/spinner.component';
import Button from 'src/components/internal/button/button.component';

// scss
import './image-uploader-mobile.component.scss';
import { ImageInvalidDimensions, ImageInvalidType, ImageSizeTooLarge } from 'src/static/app.errors';

const validFileTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'];

type Props = {
	onFileChange: (file: File) => void;
	onFileDelete: () => void;
	className?: string;
	title: string;
	initialImage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

enum States {
	NO_FILE = 'no_file',
	READING_FILE = 'loading',
	FILE_LOADED = 'loaded',
	INITIAL_IMAGE = 'initial_image',
}

export default function ImageUploader({
	onFileChange,
	onFileDelete,
	className,
	title,
	initialImage,
	...rest
}: Props) {
	const [state, setState] = useState<States>(initialImage ? States.READING_FILE : States.NO_FILE);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const [fileData, setFileData] = useState<{
		imageUrl: string;
		name: string;
		type: string;
		width: number;
		height: number;
		file: File;
	} | null>(null);

	useEffect(() => {
		// if there is an initial image read the file and set the state to FILE_LOADED

		if (initialImage) {
			const img = new Image();
			img.src = initialImage;
			img.onload = () => {
				setFileData({
					imageUrl: img.src,
					name: 'initial_image',
					type: 'image',
					width: img.width,
					height: img.height,
					file: new File([], 'initial_image'),
				});
				setState(States.INITIAL_IMAGE);
			};
		}
	}, [initialImage]);

	// *~~~ file change handler ~~~*
	// #region
	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		setState(States.READING_FILE);

		const file: File | null = e.target.files ? e.target.files[0] : null;

		if (!file) {
			setState(States.NO_FILE);
			return;
		}

		const request = {
			file: file,
		};

		const typeHandler = new ValidateFileType();
		const sizeHandler = new ValidateFileSize();

		try {
			typeHandler.setNext(sizeHandler);
			typeHandler.handle(request);
		} catch (e: any) {
			window.alert(e.message);
			setState(States.NO_FILE);
			handleDelete();
			return;
		}

		readFile(file, (img: HTMLImageElement) => {
			const request2 = {
				img: {
					width: img.width,
					height: img.height,
				},
			};

			const dimensionsHandler = new ValidateFileDimensions();

			try {
				dimensionsHandler.handle(request2);
			} catch (e: any) {
				window.alert(e.message);
				setState(States.NO_FILE);
				handleDelete();
				return;
			}

			onFileChange(file);
			setFileData({
				imageUrl: img.src,
				name: file.name,
				type: file.type,
				width: img.width,
				height: img.height,
				file,
			});

			setState(States.FILE_LOADED);
		});
	}

	function readFile(file: File, onLoad: (img: HTMLImageElement) => void) {
		const reader = new FileReader();

		reader.onload = function () {
			const img = new Image();

			img.src = reader.result as string;

			img.onload = () => {
				// After the image has loaded, set the file state with dimensions
				onLoad(img);
			};
		};
		reader.readAsDataURL(file);
	}

	function handleDelete() {
		setFileData(null);
		onFileDelete();

		setState(States.NO_FILE);

		// Clear the input value to allow re-uploading the same file
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}

	// #endregion

	function triggerInput() {
		fileInputRef.current!.onclick = (e: any) => e.stopPropagation();
		fileInputRef.current!.click();
	}

	function RenderComp() {
		switch (state) {
			case States.NO_FILE:
				return (
					<div className={`img_uploader p-4 ${className} `}>
						<div>
							<h1 className="text-abrandc-dark-grey dark:text-white font-medium text-base py-1">
								{title}
							</h1>
							<div className="text-sm text-agrey-700 dark:text-agrey-400 h-[48px] py-1">
								<h2>Size limit 2mb</h2>
								<h2>Images 1600 x 900px</h2>
							</div>
						</div>
						<Button
							onClick={triggerInput}
							type="button"
							className="border dark:border-white border-black dark:text-white hover:border-ablue-300 transition-all duration-200 ease-in-out rounded-full flex justify-center items-center w-fit !h-[36px] px-6 py-1 !text-sm"
						>
							Upload File
						</Button>
					</div>
				);

			case States.READING_FILE:
				return (
					<div className={`img_uploader p-4 pt-9`}>
						<Spinner />
						<h1 className="text-sm text-agrey-700 dark:text-agrey-400">Loading... </h1>
					</div>
				);

			case States.FILE_LOADED:
				return (
					<div className="img_uploader_uploaded">
						<div className="w-full h-full flex justify-center items-center relative">
							{/* image */}

							<img
								src={fileData!.imageUrl}
								alt="uploaded-preview"
								className={
									fileData!.width > fileData!.height
										? 'max-w-full h-auto'
										: 'max-h-full w-auto'
								}
							/>

							{/* control buttons */}
							<div className="absolute flex bottom-0 justify-between w-full p-4">
								<Button
									onClick={triggerInput}
									type="button"
									className="blue border border-transparent transition-all duration-200 ease-in-out rounded-full flex justify-center items-center w-fit !h-[36px] px-6 py-1 !text-sm"
								>
									Change
								</Button>

								<button
									className="text-white rounded-full p-2 bg-black bg-opacity-50"
									onClick={handleDelete}
									type="button"
								>
									<i className="far fa-trash-alt text-[17px]"></i>
								</button>
							</div>
						</div>
					</div>
				);

			case States.INITIAL_IMAGE:
				return (
					<div className="img_uploader_uploaded">
						<div className="w-full h-full flex justify-center items-center relative">
							{/* image */}

							<img
								src={initialImage}
								alt="uploaded-preview"
								className={
									fileData!.width > fileData!.height
										? 'max-w-full h-auto'
										: 'max-h-full w-auto'
								}
							/>

							{/* control buttons */}
							<div className="absolute flex bottom-0 justify-between w-full p-4">
								<Button
									onClick={triggerInput}
									type="button"
									className="blue border border-transparent transition-all duration-200 ease-in-out rounded-full flex justify-center items-center w-fit !h-[36px] px-6 py-1 !text-sm"
								>
									Change
								</Button>

								<button
									className="text-white rounded-full p-2 bg-black bg-opacity-50"
									onClick={handleDelete}
									type="button"
								>
									<i className="far fa-trash-alt text-[17px]"></i>
								</button>
							</div>
						</div>
					</div>
				);
		}
	}

	return (
		<>
			{RenderComp()}

			{/* invisible input to handle re-upload */}

			<input
				type="file"
				accept="image/png,image/jpeg,image/gif,image/webp"
				onChange={handleFileChange}
				ref={fileInputRef}
				className="hidden"
				{...rest}
			/>
		</>
	);
}

abstract class ChainHandler {
	nextHandler: ChainHandler | null = null;

	setNext(handler: ChainHandler): ChainHandler {
		this.nextHandler = handler;
		return handler;
	}

	handle(request: any): any {
		if (this.nextHandler) {
			return this.nextHandler.handle(request);
		}
	}
}

class ValidateFileSize extends ChainHandler {
	handle(request: any): any {
		// 2mb
		if (request.file.size > 2 * 1024 * 1024) {
			throw new ImageSizeTooLarge();
		}

		if (this.nextHandler) {
			return this.nextHandler.handle(request);
		}
	}
}

class ValidateFileType extends ChainHandler {
	handle(request: any): any {
		if (!validFileTypes.includes(request.file.type)) {
			throw new ImageInvalidType();
		}

		if (this.nextHandler) {
			return this.nextHandler.handle(request);
		}
	}
}

class ValidateFileDimensions extends ChainHandler {
	handle(request: any): any {
		if (request.img.width > 2000 || request.img.height > 2000) {
			throw new ImageInvalidDimensions();
		}

		if (this.nextHandler) {
			return this.nextHandler.handle(request);
		}
	}
}
