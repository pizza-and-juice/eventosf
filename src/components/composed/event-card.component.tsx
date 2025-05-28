import { Link } from 'react-router-dom';

import ROUTES from '@static/router.data';
import Tag from '@components/internal/tags/tags.component';

type Props = {
	id: string;
	title: string;
	subtitle: string;
	image: string;

	isRegistered: boolean;

	// renderComments: boolean;
	confirmed_attendees: number;
	speakers: number;
	attendees_capacity: number;

	// onCheckClick: () => void;
	// onUpvoteClick?: () => void;
	// onCommentClick: () => void;

	// renderUpvote: boolean;
};

export default function EventCard({
	id,
	title,
	subtitle,
	image,

	isRegistered,

	confirmed_attendees,
	speakers,
	attendees_capacity,
}: Props) {
	return (
		<div className="prjt-box w-full p-4 hover:bg-light-700 dark:hover:bg-dark-400 rounded-lg">
			<div className="flex gap-x-8 items-stretch relative">
				{/* details container */}
				<div className="flex-grow min-w-0 flex flex-col sm:flex-row items-stretch  gap-x-6 gap-y-4">
					<div className="basis-[80px] w-[80px] flex-grow-0 flex-shrink-0 sm:basis-[130px] sm:h-[130px] ">
						<Link to={ROUTES.events.details.replace(':id', id.toString())} className="">
							<img src={image} className="w-full h-full" />
						</Link>
					</div>

					<div className="flex-grow min-w-0 ">
						<div className="bg-red-100a flex flex-col justify-between text-left h-full ">
							<Link
								to={ROUTES.events.details.replace(':id', id)}
								className="space-y-2 cursor-pointer"
							>
								{/* project title  */}
								<div className="flex items-center gap-x-3">
									<h1 className="text-xl font-medium text-black dark:text-white  ">
										{title}
									</h1>
								</div>

								{/* project description */}
								<p className="text-agrey-700 dark:text-agrey-400 text-ellipsis ">
									{subtitle}
								</p>
							</Link>
							<div className="flex gap-x-4 ">
								{/* {categories.map((category, index) => (
									<Tag key={index}>{category}</Tag>
								))} */}

								<button className="flex gap-x-2 items-center text-black dark:text-white p-2  hover:text-ablue-200 transition duration-300 ease-in-out">
									<i className="fa-regular fa-users" />
									<span className="text-sm">
										{confirmed_attendees} / {attendees_capacity}
									</span>
								</button>

								<button className="flex gap-x-2 items-center text-black dark:text-white p-2  hover:text-ablue-200 transition duration-300 ease-in-out">
									<i className="fa-regular fa-microphone-stand" />
									<span className="text-sm">{speakers}</span>
								</button>

								{isRegistered && <Tag>Asistencia </Tag>}
							</div>
						</div>
					</div>
				</div>

				{/* upvote button */}
				<div className="absolute sm:relative flex flex-col justify-end  top-0 right-0">
					{/* {renderUpvote && (
						<Upvote
							upvotes={upvotes}
							size="small"
							onClick={onUpvoteClick!}
							isUpvoted={isUpvoted}
						/>
					)} */}
				</div>
			</div>
		</div>
	);
}
