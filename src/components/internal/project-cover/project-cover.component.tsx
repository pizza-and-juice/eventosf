// react
import React, { useState, useRef } from 'react';

// components
import Spinner from 'src/components/internal/spinner/spinner.component';
import Button from 'src/components/internal/button/button.component';

// scss
import './project-cover.component.scss';
import { ImageInvalidDimensions, ImageInvalidType, ImageSizeTooLarge } from 'src/static/app.errors';
import { reduceFileName } from 'src/shared/utils/formatters';

const validFileTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'];

type Props = {
	onFileChange: (file: File) => void;
	onFileDelete: () => void;
	className?: string;
	initialImage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

enum States {
	NO_FILE = 'no_file',
	READING_FILE = 'loading',
	FILE_LOADED = 'loaded',
	ERROR = 'error',
	INITIAL_IMAGE = 'initial_image',
}

export default function ProjectCover({
	onFileChange,
	onFileDelete,
	className,
	initialImage,
	...rest
}: Props) {
	const [state, setState] = useState<States>(
		initialImage ? States.INITIAL_IMAGE : States.NO_FILE
	);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const [fileData, setFileData] = useState<{
		imageUrl: string;
		name: string;
		type: string;
		width: number;
		height: number;
		file: File;
	} | null>(null);

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
					<div className={`cover_uploader p-3  ${className}`}>
						<div className="flex items-center gap-x-4  ">
							{/* left side */}
							<div className="w-[64px] h-[64px] bg-light-700 dark:bg-dark-700" />

							{/* right side */}
							<div className="flex-grow min-w-0 sm:flex sm:justify-between sm:items-center space-y-1.5 sm:space-y-0">
								<div className="space-y-2">
									<h1 className="text-agrey-900 dark:text-white font-medium">
										Add a project logo/cover
									</h1>
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 ">
										Recommended 300 x 300
									</h2>
								</div>
								<Button
									onClick={triggerInput}
									type="button"
									className="border dark:border-white border-black dark:text-white hover:border-ablue-300 transition-all duration-200 ease-in-out rounded-full flex justify-center items-center w-fit !h-[36px] px-6 py-1 !text-sm"
								>
									Upload Cover
								</Button>
							</div>
						</div>
					</div>
				);

			case States.READING_FILE:
				return (
					<div className="cover_uploader p-3">
						<div className="flex gap-x-4 items-center ">
							{/* image */}
							<div className="flex justify-center items-center w-[64px] h-[64px] bg-light-700 dark:bg-dark-700">
								<Spinner />
							</div>
							<h2 className="text-sm text-agrey-700">Uploading...</h2>
						</div>
					</div>
				);

			case States.FILE_LOADED:
				return (
					<div className={`cover_uploader p-3 ${className}`}>
						<div className="flex items-center gap-x-4">
							{/* left side */}
							<div className="w-[64px] h-[64px] overflow-hidden">
								<img src={fileData!.imageUrl} className="w-full h-full" />
							</div>

							<div className="flex-grow min-w-0 sm:flex sm:justify-between sm:items-center space-y-1.5 sm:space-y-0">
								{/* right side */}
								<div className="space-y-2">
									<h1 className="text-agrey-900 dark:text-white font-medium">
										{reduceFileName(fileData!.name)}
									</h1>
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 ">
										Recommended 300 x 300
									</h2>
								</div>

								{/*  */}
								<div className="flex flex-row-reverse justify-end sm:flex-row  items-center gap-x-4 ">
									<button
										className="text-agrey-700 rounded-full"
										onClick={handleDelete}
										type="button"
									>
										<i className="far fa-trash-alt text-[17px]"></i>
									</button>
									<Button
										onClick={triggerInput}
										type="button"
										className="border dark:border-white border-black dark:text-white hover:border-ablue-300 transition-all duration-200 ease-in-out rounded-full flex justify-center items-center w-fit !h-[36px] px-6 py-1 !text-sm"
									>
										Change Cover
									</Button>
								</div>
							</div>
						</div>
					</div>
				);

			case States.INITIAL_IMAGE:
				return (
					<div className={`cover_uploader p-3 ${className}`}>
						<div className="flex items-center gap-x-4">
							{/* left side */}
							<div className="w-[64px] h-[64px] overflow-hidden">
								<img src={initialImage!} className="w-full h-full" />
							</div>

							<div className="flex-grow min-w-0 sm:flex sm:justify-between sm:items-center space-y-1.5 sm:space-y-0">
								{/* right side */}
								<div className="space-y-2">
									<h1 className="text-agrey-900 dark:text-white font-medium">
										Project cover
									</h1>
									<h2 className="text-sm text-agrey-700 dark:text-agrey-400 ">
										Recommended 300 x 300
									</h2>
								</div>

								{/*  */}
								<div className="flex flex-row-reverse justify-end sm:flex-row  items-center gap-x-4 ">
									<button
										className="text-agrey-700 rounded-full"
										onClick={handleDelete}
										type="button"
									>
										<i className="far fa-trash-alt text-[17px]"></i>
									</button>
									<Button
										onClick={triggerInput}
										type="button"
										className="border dark:border-white border-black dark:text-white hover:border-ablue-300 transition-all duration-200 ease-in-out rounded-full flex justify-center items-center w-fit !h-[36px] px-6 py-1 !text-sm"
									>
										Change Cover
									</Button>
								</div>
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
		if (
			request.img.width > 1000 ||
			request.img.height > 1000 ||
			request.img.width !== request.img.height
		) {
			throw new ImageInvalidDimensions();
		}

		if (this.nextHandler) {
			return this.nextHandler.handle(request);
		}
	}
}
