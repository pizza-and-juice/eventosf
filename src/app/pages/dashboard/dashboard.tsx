import UserSvcContext from '@shared/services/user/user.context';
import { useContext } from 'react';

export default function DashboardPage() {
	const userSvc = useContext(UserSvcContext);

	return (
		<main className="container-3 mx-auto">
			<div className="h-screen">
				<h1 className="text-3xl font-bold text-center mt-10 text-black dark:text-white">
					Dashboard
				</h1>
				<p className="text-center text-2xl mt-4 text-black dark:text-white">
					Hola <span className="text-blue-500">{userSvc.getUserData().name}</span>
					<br />
					desde aqui puedes administrar los usuarios y recursos de mis datos{' '}
				</p>
			</div>
		</main>
	);
}
