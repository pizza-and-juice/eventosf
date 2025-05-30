import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from 'src/components/internal/button/button.component';
import DocTitleSvcContext from 'src/shared/services/doc-title/doc-title.context';
import DocumentTitleService from 'src/shared/services/doc-title/doc-title.service';
import ROUTES from 'src/static/router.data';

export default function NotFoundPage() {
	const docTitleSvc = useContext<DocumentTitleService>(DocTitleSvcContext);
	docTitleSvc.setTitle('404 Not found');

	return (
		<div className="flex flex-col items-center justify-top min-h-screen px-4 dark:bg-dark-800 mt-[7%]">
			<h1 className="text-8xl font-extrabold tracking-tight text-black dark:text-white">
				404
			</h1>
			<p className="mt-4 text-xl text-agrey-700 dark:text-agrey-400 ">
				The page you are looking for doesn’t exist or has been removed.
			</p>
			<p className="mt-2 text-lg text-agrey-700 dark:text-agrey-400">
				Please go back to the homepage.
			</p>

			<Link to={ROUTES.root} className="mt-6">
				<Button className="blue">Explore Projects</Button>
			</Link>
		</div>
	);
}
