import { Link } from 'react-router-dom';

import './footer.component.scss';
import ImagoTipo from '@components/logos/pwr-imagotipo/pwr-imagotipo.logo';

export default function FooterComponent() {
	const socials = [
		{
			icon: <i className="fa-brands fa-x-twitter"></i>,
			label: 'Twitter',
			href: 'https://twitter.com/miseventos',
		},
		{
			icon: <i className="fab fa-instagram" />,
			label: 'Instagram',
			href: 'https://www.instagram.com/miseventos',
		},
		{
			icon: <i className="fab fa-tiktok" />,
			label: 'TikTok',
			href: 'https://www.tiktok.com/@miseventos',
		},
	];

	return (
		<footer className="dark:bg-dark-900 bg-light-900 md:py-20 py-10 overflow-hidden">
			<div className="sm:px-20 px-8">
				{/* Navigation */}
				<div>
					<ImagoTipo />
				</div>

				<hr className="dark:border-agrey-800 border-agrey-300 my-8" />

				<div className="flex md:flex-row flex-col items-center gap-4 w-full">
					{socials.map((item, index) => (
						<Link
							key={index}
							to={item.href}
							target="_blank"
							rel="noreferrer noopener"
							className="bg-abrandc-dark-grey dark:bg-white text-white dark:text-abrandc-dark-blackish rounded-2xl h-[60px] w-[134px] transition duration-600 ease-in-out hover:bg-ablue-400 dark:hover:bg-ablue-400 dark:hover:text-white hover:text-white hover:scale-105"
						>
							<div className="flex items-center gap-x-4 py-3 px-4 ">
								<i className="text-2xl">{item.icon}</i>
								<h2 className="text-xs font-medium leading-[18px]">{item.label}</h2>
							</div>
						</Link>
					))}
				</div>

				<div className="flex flex-col md:flex-row justify-between items-center gap-y-5 mt-6 py-1">
					<h1 className="text-sm font-medium dark:text-white text-abrandc-dark-black">
						Mis eventos. All Rights reserved
					</h1>
					<div className="flex items-center gap-x-8 dark:text-agrey-400 text-agrey-700 text-sm font-medium">
						<Link to="https://example.com" target="_blank">
							Terminos
						</Link>
						<Link to="https://example.com" target="_blank">
							Privacidad
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
