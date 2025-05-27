import { Outlet } from 'react-router-dom';

import HeaderComponent from '@modules/layout/header/header.component';
import FooterComponent from '@modules/layout/footer/footer.component';

export default function LandingLayout() {
	return (
		<>
			{/* *~~*~~*~~ LAYOUT ~~*~~*~~* */}
			<HeaderComponent />

			{/* <div className="h-headerP" /> */}

			<div className=" min-h-screen-2 ">
				<Outlet />
			</div>

			<FooterComponent />
		</>
	);
}
