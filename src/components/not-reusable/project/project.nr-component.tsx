import { Link } from 'react-router-dom';
import Tag from 'src/components/internal/tags/tags.component';
import Upvote from 'src/components/internal/upvote/upvote.component';
import ROUTES from 'src/static/router.data';
type ProjectComponentProps = {
	id: string;
	imageSrc: string;
	title: string;
	description: string;
	categories: string[];
	upvotes: number;
	isUpvoted: boolean;

	renderComments: boolean;
	totalComments: number;

	onCheckClick: () => void;
	onUpvoteClick?: () => void;
	onCommentClick: () => void;

	renderUpvote: boolean;
};

export default function ProjectComponent({
	id,
	imageSrc,
	title,
	description,
	categories,
	upvotes,
	isUpvoted,
	renderComments,
	totalComments,
	onCheckClick,
	onUpvoteClick,
	onCommentClick,
	renderUpvote,
}: ProjectComponentProps) {
	return (
		<div className="prjt-box w-full p-2 hover:bg-light-700 dark:hover:bg-dark-400 rounded-lg">
			<div className="flex gap-x-8 items-stretch relative">
				{/* details container */}
				<div className="flex-grow min-w-0 flex flex-col sm:flex-row items-stretch  gap-x-6 gap-y-4">
					<div className="basis-[80px] w-[80px] flex-grow-0 flex-shrink-0 sm:basis-[130px] sm:h-[130px] ">
						<Link
							to={ROUTES.projects.details.replace(':id', id.toString())}
							className=""
						>
							<img src={imageSrc} className="w-full h-full" />
						</Link>
					</div>

					<div className="flex-grow min-w-0 ">
						<div className="bg-red-100a flex flex-col justify-between text-left h-full ">
							<div className="space-y-2 cursor-pointer" onClick={onCheckClick}>
								{/* project title  */}
								<div className="flex items-center gap-x-3">
									<h1 className="text-xl font-medium text-black dark:text-white  ">
										{title}
									</h1>

									{/* <div className="w-[26px] h-[26px] bg-light-700 dark:bg-dark-700 text-agrey-700 dark:text-agrey-400 rounded-[4px] grid place-items-center">
										#{id}
									</div> */}
								</div>

								{/* project description */}
								<p className="text-agrey-700 dark:text-agrey-400 text-ellipsis ">
									{description}
								</p>
							</div>
							<div className="flex gap-x-4 ">
								{categories.map((category, index) => (
									<Tag key={index}>{category}</Tag>
								))}

								{renderComments && (
									<button
										className="flex gap-x-2 items-center text-black dark:text-white p-2  hover:text-ablue-200 transition duration-300 ease-in-out"
										onClick={onCommentClick}
									>
										<i className="fa-regular fa-message" />
										<span className="text-sm">{totalComments}</span>
									</button>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* upvote button */}
				<div className="absolute sm:relative flex flex-col justify-end  top-0 right-0">
					{renderUpvote && (
						<Upvote
							upvotes={upvotes}
							size="small"
							onClick={onUpvoteClick!}
							isUpvoted={isUpvoted}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
