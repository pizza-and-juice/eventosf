// react
import { useState } from 'react';

// components
import CommentComponent from 'src/components/internal/comments/comments.component';
import Tag from 'src/components/internal/tags/tags.component';
import Status from 'src/components/internal/status/status.component';
import Upvote from 'src/components/internal/upvote/upvote.component';

// scss files
import 'src/components/internal/checkbox/checkbox.scss';
import 'src/components/internal/text-field/text-field.scss';
import 'src/components/internal/text-link/text-link.component.scss';
import SearchBarDropdown from 'src/components/internal/search-bar-dropdown/search-bar-dropdown.component';
import Pagination from 'src/components/internal/pagination/pagination.component';
import ProjectCover from 'src/components/internal/project-cover/project-cover.component';
import Chip from 'src/components/internal/chip/chip.component';

export default function UiKit() {
	const [val, setVal] = useState('');

	const options = [
		{
			id: 0,
			label: 'option1',
			value: 'option-1',
		},
		{
			id: 1,
			label: 'option2',
			value: 'option-2',
		},
		{
			id: 2,
			label: 'option3',
			value: 'option-3',
		},
		{
			id: 3,
			label: 'option4',
			value: 'option-4',
		},
	];

	const [upvotes] = useState<number>(99);

	// handle image component
	const [, setFile] = useState<any>();

	// set project cover file
	const fileToUpload = (file: any) => {
		setFile(file);
	};

	// implementing pagination
	const [currentPage, setCurrentPage] = useState<number>(1);

	const paginationMetadata = {
		totalPages: 10,
		currentPage: currentPage,
		itemsPerPage: 5,
		totalItems: 50,
		nextPage: currentPage < 10 ? currentPage + 1 : -1,
		previousPage: currentPage > 1 ? currentPage - 1 : -1,
		startIndex: 1,
		endIndex: 5,
	};

	const handlePageChange = (page: any) => {
		setCurrentPage(page);
	};

	const [categories, setCategories] = useState<any[]>(['cat1', 'cat2']);

	function removeCategory(category: string) {
		setCategories(categories.filter((cat) => cat !== category));
	}

	return (
		<div className="container-2 mx-auto space-y-8">
			<h1 className="text-2xl text-black dark:text-white">UI Kit</h1>

			{/* Comments */}
			<CommentComponent
				userId="1"
				profile_picture="/images/person.svg"
				name="Danielle Russell"
				date="Oct 24"
				renderReplyBtn={true}
				onReplyClick={() => {}}
			>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore{' '}
			</CommentComponent>

			<br />
			<br />

			{/* checkbox */}
			<section>
				<h1 className="text-black dark:text-white text-xl">Checkbox</h1>
				<br />

				{/* Checkbox circle */}
				<input disabled={true} className="checkbox" type="checkbox" />

				{/* Checkbox square */}
				<input disabled={false} className="checkbox !rounded" type="checkbox" />
			</section>

			{/* text field */}
			<section>
				<h1 className="text-black dark:text-white text-xl">Text field</h1>
				<br />

				<form className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						{/* input field */}
						<div className="field">
							<label className="text-black dark:text-white">normal</label>

							<div className="form-control">
								<input
									className="text-field "
									type="text"
									placeholder="Enter a message"
								/>
							</div>
						</div>

						{/* input field */}
						<div className="field">
							<label className="text-ared-500">invalid</label>

							<div className="form-control">
								<input
									className="text-field invalid"
									type="text"
									placeholder="Enter a message"
								/>
							</div>
						</div>

						{/* input field */}
						<div className="field">
							<label className="text-black dark:text-white">Disabled</label>

							<div className="form-control">
								<input
									disabled
									className="text-field"
									type="text"
									placeholder="Enter a message"
									value="read only"
								/>
							</div>
						</div>
					</div>
				</form>
			</section>

			{/* text area */}
			<section>
				<h1 className="text-black dark:text-white text-xl">Text area</h1>
				<br />

				<form className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						{/* input field */}
						<div className="field">
							<label className="text-black dark:text-white">normal</label>

							<div className="form-control">
								<textarea
									placeholder="Enter a message"
									className="text-field"
								></textarea>
							</div>
						</div>

						{/* input field */}
						<div className="field">
							<label className="text-ared-500">invalid</label>

							<div className="form-control">
								<textarea
									placeholder="Enter a message"
									className="text-field invalid"
								></textarea>
							</div>
						</div>

						{/* input field */}
						<div className="field">
							<label className="text-black dark:text-white">Disabled</label>

							<div className="form-control">
								<textarea
									disabled
									value="read only"
									placeholder="Enter a message"
									className="text-field"
								></textarea>
							</div>
						</div>
					</div>
				</form>
			</section>

			<div className="flex gap-x-2">
				{categories.map((category, index) => (
					<Chip onDelete={() => removeCategory(category)} key={index}>
						{category}
					</Chip>
				))}
			</div>

			{/* tags */}
			<Tag size="" disabled={false} w_cross={true} selected={false}>
				Category
			</Tag>

			<br />
			<br />

			{/* status */}
			{/* status can be pending, approved, rejected */}
			<Status status="approved" />

			<br />
			<br />

			{/* text links */}
			<a href="https://www.example.com" className="text-link">
				www.textlinks.com
			</a>

			<br />
			<br />

			{/* text area */}
			<section>
				<h1 className="text-black dark:text-white text-xl">Upvotes</h1>
				<br />

				{/* upvote */}
				<h1>Small</h1>
				<Upvote upvotes={upvotes} size="small" isUpvoted={false} onClick={() => {}} />

				<br />
				<h1 className="text-black dark:text-white">Big</h1>
				<Upvote upvotes={upvotes} size="big" isUpvoted={false} onClick={() => {}} />
			</section>

			<br />
			<br />

			{/* Image uploader */}
			{/* <ImageUploaderMobile file_number={1} /> */}

			<br />
			<br />

			{/* Project cover */}
			<div className="max-w-[700px]">{/* <ProjectCover type="cover" /> */}</div>

			<br />
			<br />

			<div className="flex gap-x-12">
				{/* dropdown */}
				<div className="w-[200px]">
					{/* <NormalDropdown
						value={val}
						onChange={(e) => setVal(e.target.value)}
						options={options}
					></NormalDropdown> */}
				</div>
				{/* search bar dropdown */}
				<div className="w-[200px]">
					<SearchBarDropdown
						w_image={true}
						name=""
						value={val}
						onChange={(e) => setVal(e.target.value)}
						options={options}
					/>
				</div>
			</div>

			<br />
			<br />

			{/* project cover  */}
			<div className="field space-y-1">
				<label
					htmlFor=""
					className="text-abrandc-dark-black text-[12px] font-normal dark:text-white"
				>
					Project cover
				</label>
				<ProjectCover
					type={'cover'}
					onFileChange={fileToUpload}
					onFileDelete={() => {
						setFile(null);
					}}
				/>
			</div>

			<br />
			<br />

			<Pagination metadata={paginationMetadata} onPageChange={handlePageChange} />

			<br />
			<br />
		</div>
	);
}
