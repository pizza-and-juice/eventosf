import { Link } from 'react-router-dom';
import Button from 'src/components/internal/button/button.component';
import Tag from 'src/components/internal/tags/tags.component';
import ROUTES from 'src/static/router.data';
type ProjectComponentProps = {
	id: number;
	imageSrc: string;
	title: string;
	description: string;
	categories: string[];
	upvotes: number;
	onEdit?: () => void;
	onContact: () => void;
	totalComments: number;
};

export default function ProjectAdminComponent({
	id,
	imageSrc,
	title,
	description,
	categories,
	onContact,
	totalComments,
}: ProjectComponentProps) {
	return (
		<div className="prjt-box w-full p-2 hover:bg-light-700 dark:hover:bg-dark-400 rounded-lg">
			<div className="flex gap-x-8 items-stretch relative">
				{/* details container */}
				<div className="flex-grow flex flex-col sm:flex-row items-stretch gap-x-6 gap-y-4">
					<div className="basis-[80px] w-[80px] flex-grow-0 flex-shrink-0 sm:basis-[130px] sm:h-[130px] ">
						<Link
							to={ROUTES.projects.details.replace(':id', id.toString())}
							className=""
						>
							<img src={imageSrc} className="w-full h-full" />
						</Link>
					</div>
					<div className="flex-grow bg-red-100a flex flex-col justify-between">
						<div className="space-y-2">
							{/* project title */}
							<div className="flex items-center gap-x-3">
								<Link
									to={ROUTES.projects.details.replace(':id', id.toString())}
									className="text-xl font-medium text-black dark:text-white "
								>
									{title}
								</Link>

								<div className="w-[26px] h-[26px] bg-light-700 dark:bg-dark-700 text-agrey-700 dark:text-agrey-400 rounded-[4px] grid place-items-center">
									#{id}
								</div>
							</div>

							{/* project description */}
							<p className="text-agrey-700 dark:text-agrey-400">{description}</p>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex gap-x-4">
								{categories.map((category, index) => (
									<Tag key={index}>{category}</Tag>
								))}

								<div className="flex gap-x-2 items-center text-black dark:text-white p-2  hover:text-ablue-200 transition duration-300 ease-in-out">
									<i className="fa-regular fa-message" />
									<span className="text-sm">{totalComments}</span>
								</div>
							</div>

							<div className="flex gap-x-3">
								<Button
									className="blue small"
									href={ROUTES.admin.projects.edit.replace(/:id/, id.toString())}
									tag_type="link"
								>
									Edit
								</Button>
								<Button onClick={onContact} className="secondary small">
									Contact
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
