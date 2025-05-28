// third party
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// services
import AuthSvcContext from '@shared/services/auth/auth.context';
import UserSvcContext from '@shared/services/user/user.context';

// context
import { ProfileCtxType, ProfilePageCtx } from '@modules/profile/profile.context';
import ProfileView from '@modules/profile/profile.view';

// static
import QUERY_KEYS from '@static/query.keys';

// data fetching
import api from '@modules/data-fetching/api';
import ProfileEventsTab from '@modules/profile/tabs/profile-events.tab';
import ProfileCreatedEventsTab from '@modules/profile/tabs/profile-created-events.tab';

export default function ProfilePage() {
	// #region dependencies
	const authSvc = useContext(AuthSvcContext);
	const userSvc = useContext(UserSvcContext);

	// get param
	const params = useParams<{ id: string }>();

	const userId = params.id!;

	const [ownProfile, setOwnProfile] = useState(
		authSvc.isLoggedIn && userSvc.getUserData().id.toLowerCase() === userId.toLocaleLowerCase()
	);

	useEffect(() => {
		setOwnProfile(
			authSvc.isLoggedIn && userSvc.getUserData().id.toLowerCase() === userId.toLowerCase()
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, authSvc.isLoggedIn]);

	// #endregion

	// #region tabs
	const [activeTab, setActiveTab] = useState(0);

	const tabs = [
		{
			id: 0,
			label: 'Eventos',
			onClick: () => {
				setActiveTab(0);
			},
			Component: ProfileEventsTab,
			admin: true,
			self: false,
		},
		{
			id: 1,
			label: `Eventos creados`,
			onClick: () => {
				setActiveTab(1);
			},
			Component: ProfileCreatedEventsTab,
			admin: true,
			self: true,
		},
	];

	// #endregion

	// #region http reqs

	const userQuery = useQuery({
		queryKey: [QUERY_KEYS.RETRIEVE_USER, userId],
		queryFn: () => api.users.retrieve(userId),
	});

	// #endregion

	// #region fn
	// #endregion

	const ctxObject: ProfileCtxType = {
		queries: {
			userQuery,
		},

		state: {
			userId,
			ownProfile,

			activeTab,
			tabs,
		},
	};

	return (
		<ProfilePageCtx.Provider value={ctxObject}>
			<ProfileView />
		</ProfilePageCtx.Provider>
	);
}
