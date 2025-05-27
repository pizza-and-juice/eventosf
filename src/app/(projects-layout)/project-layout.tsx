import HeaderComponent from '@modules/layout/header/header.component';
import FooterComponent from '@modules/layout/footer/footer.component';
import { Outlet } from 'react-router-dom';
import ProjectQuickViewComponent from 'src/components/not-reusable/project-quickview/project-qv.nr-component';
import { useContext } from 'react';
import LayoutSvcContext from 'src/shared/services/layout/layout.context';
import LayoutService from 'src/shared/services/layout/layout.service';

export default function ProjectLayout() {
	const layoutSvc = useContext<LayoutService>(LayoutSvcContext);

	const projectQv = layoutSvc.getProjectQVState();

	return (
		<>
			{/* *~~*~~*~~ LAYOUT ~~*~~*~~* */}
			<HeaderComponent />
			{projectQv.isOpen && (
				<ProjectQuickViewComponent
					projectId={projectQv.projectId}
					activeTab={projectQv.tab} // Adjusted based on the expected prop name
				/>
			)}

			<div className="h-headerP" />

			<div className=" min-h-screen-2 py-[20px]  ">
				<Outlet />
			</div>

			<FooterComponent />
		</>
	);
}
