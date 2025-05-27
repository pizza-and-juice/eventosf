import OwnProfile from './(own-profile)/own-profile';
import OtherProfile from './(other-profile)/other-profile';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import AuthService from 'src/shared/services/auth/auth.service';
import AuthSvcContext from 'src/shared/services/auth/auth.context';
import UserService from 'src/shared/services/user/user.service';
import UserSvcContext from 'src/shared/services/user/user.context';

export default function ProfilePage() {
	const authSvc = useContext<AuthService>(AuthSvcContext);
	const userSvc = useContext<UserService>(UserSvcContext);

	const { id } = useParams();

	const user = userSvc.getUserData();

	if (!authSvc.isLoggedIn()) return <OtherProfile />;

	if (id !== user.id) return <OtherProfile />;

	return <OwnProfile />;
}
