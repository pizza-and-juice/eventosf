import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// services
import AuthSvcContext from '@shared/services/auth/auth.context';
import ROUTES from 'src/static/router.data';

//

export default function AuthRequiredLayout() {
	const authSvc = useContext(AuthSvcContext);

	if (!authSvc.isLoggedIn) {
		return <Navigate to={ROUTES.root.concat('?a=l')} />;
	}

	// We will then allow the admins to access the dashboard
	return <Outlet />;
}
