import HeaderComponent from '@modules/data-fetching/layout/header/header.component';
import { Outlet } from 'react-router-dom';

export default function HeaderLayout() {
	return (
		<>
			{/* *~~*~~*~~ LAYOUT ~~*~~*~~* */}
			<HeaderComponent />

			<div className="h-headerP" />

			<div className="min-h-screen-2 py-[40px]">
				<Outlet />
			</div>

			<div className="h-[100px]"></div>
		</>
	);
}
