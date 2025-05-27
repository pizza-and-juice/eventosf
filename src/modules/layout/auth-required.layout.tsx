import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// services
import AuthSvcContext from '@shared/services/auth/auth.context';
import ROUTES from 'src/static/router.data';

//

export default function AuthRequiredLayout() {
	const authSvc = useContext(AuthSvcContext);

	// We are checking if the user is authenticated
	const isAuthenticated = authSvc.isLoggedIn();

	// here we are checking if the user is an admin or not, i don`t know how to identify an admin but this will give you some insights about the logic i wanted to implement
	// const isAdmin = true;

	// here we are redirecting unauthenticated users to the login page so that they can login
	if (!isAuthenticated) {
		return <Navigate to={ROUTES.root} />;
	}

	// We will then allow the admins to access the dashboard
	return <Outlet />;
}
