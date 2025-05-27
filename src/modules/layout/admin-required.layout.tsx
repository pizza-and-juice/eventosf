import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// services
import UserSvcContext from '@shared/services/user/user.context';

// static
import ROUTES from '@static/router.data';

export default function AdminRequiredLayout() {
	const userSvc = useContext(UserSvcContext);

	if (!userSvc.isAdmin()) {
		return <Navigate to={ROUTES.root} />;
	}

	return <Outlet />;
}
