import { Outlet } from 'react-router-dom';

import HeaderComponent from '@modules/layout/header/header.component';
import FooterComponent from '@modules/layout/footer/footer.component';

export default function MainLayout() {
	return (
		<>
			{/* *~~*~~*~~ LAYOUT ~~*~~*~~* */}
			<HeaderComponent />

			<div className="h-headerP" />

			<div className=" min-h-screen-2 py-[20px]  ">
				<Outlet />
			</div>

			<FooterComponent />
		</>
	);
}
