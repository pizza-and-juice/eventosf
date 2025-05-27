import { Link } from 'react-router-dom';
import ROUTES from 'src/static/router.data';

type Props = {
	children: React.ReactNode;
	name: string;
	profile_picture: string;
	date: string;
	userId: string;

	renderReplyBtn?: boolean; // new prop to indicate if the comment can have replies
	onReplyClick?: () => void;

	renderDeleteBtn?: boolean; // new prop to indicate if the comment can be deleted
	onDeleteClick?: () => void;
};

export default function CommentComponent({
	children,
	name,
	profile_picture,
	date,
	userId,

	renderReplyBtn = false, // default to true
	onReplyClick = () => {},

	renderDeleteBtn = false, // default to true
	onDeleteClick = () => {},
}: Props) {
	return (
		<div className="px-2">
			{/* Header */}
			<div className="flex gap-x-4 w-full">
				{/* Profile Image */}
				<Link
					className="text-link capitalize flex-shrink-0"
					to={ROUTES.profile.root.replace(/:id/, userId)}
				>
					<img src={profile_picture} className="w-12 h-12 rounded-full" />
				</Link>
				{/* <img src={profile_picture} className="w-12 h-12 rounded-full" /> */}

				{/* Comment */}
				<div className="flex-grow min-w-0 space-y-1  ">
					{/* name and date */}
					<div className="flex justify-between items-center">
					<h1 className="text-black dark:text-white font-medium break-words whitespace-normal max-w-full">{name}</h1>
						<h2 className="text-sm text-agrey-700 dark:text-agrey-400">
							{date}
						</h2>{' '}
						{/* Use formattedDate here */}
					</div>
					{/* Text */}
					<p className="text-black dark:text-white font-medium break-words whitespace-normal max-w-full">{children}</p>

					<div className="flex">
						{renderReplyBtn && ( // Conditionally render the Reply button based on canReply
							<button
								title="Reply to the Comment"
								className="text-sm text-agrey-900 dark:text-white hover:text-ablue-200 mr-3 transition duration-300 ease-in-out font-medium " // Added font-bold class from Tailwind CSS
								onClick={onReplyClick}
							>
								Reply
							</button>
						)}
						{renderDeleteBtn && (
							<button
								title="Delete Comment"
								className="text-sm text-ared-500 hover:text-ared-600 transition duration-300 ease-in-out font-bold"
								onClick={onDeleteClick}
							>
								<i className="fas fa-trash "></i>
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}