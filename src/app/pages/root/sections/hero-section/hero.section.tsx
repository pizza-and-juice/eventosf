import { useContext } from 'react';
import { Link } from 'react-router-dom';

// components
import Button from '@components/internal/button/button.component';

// services
import SettingsSvcContext from '@shared/services/settings/settings.context';

// static
import ROUTES from '@static/router.data';

export default function HeroSection() {
	const settingsSvc = useContext(SettingsSvcContext);

	return (
		<section className="relative h-screen z-[1] cursor-default">
			{/* img container */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-[-1] grid place-items-center ">
				<img
					src="media/landing/banner-dark.png"
					alt=""
					className={`max-h-[500px] ${settingsSvc.theme === 'light' && 'hidden'}`}
				/>
				<img
					src="media/landing/banner-light.png"
					alt=""
					className={`max-h-[500px] ${settingsSvc.theme === 'dark' && 'hidden'}`}
				/>
			</div>

			{/* content */}
			<div className="h-full flex flex-col justify-center gap-y-6 ">
				<h1 className="text-center  font-bold text-2xl md:text-[56px] text-black  dark:text-white py-6">
					Ready to Power Your Idea?
				</h1>

				<h2 className="text-center text-base md:text-2xl text-black dark:text-white">
					We're on the lookout for groundbreaking ideas that spark{' '}
					<br className="hidden md:block" /> transformation. Have something in mind?
				</h2>
				{/* button div */}
				<div className="flex justify-center ">
					<Link to={ROUTES.events.create}>
						<Button className="blue w-[200px] hover:scale-105 transition duration-300 ease-in-out">
							Comenzar
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
