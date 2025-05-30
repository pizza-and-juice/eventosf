// third party
import React, { useState } from 'react';

// context
import UserSvcContext from './user.context';

// shared
import { UserRole } from '@shared/enums/user-enums';
import { UserData } from '@shared/types';

export interface IUserService {
	setUserData(userData: UserData): void;
	getUserData(): UserData;
	isAdmin(): boolean;
}

export default function UserServiceComponent({ children }: { children: React.ReactNode }) {
	const [_userData, _setUserData] = useState<UserData>({
		id: '',
		email: '',
		name: '',
		pfp: '',
		role: UserRole.NULL,
	});

	function setUserData(userData: UserData) {
		_setUserData(userData);
	}

	function getUserData() {
		return _userData;
	}

	function isAdmin(): boolean {
		return _userData.role === UserRole.ADMIN || _userData.role === UserRole.SUPERADMIN;
	}

	const ctx: IUserService = {
		setUserData,
		getUserData,
		isAdmin,
	};

	return <UserSvcContext.Provider value={ctx}>{children}</UserSvcContext.Provider>;
}
