'use client';

import { UserData } from '@shared/models/user/user.model';
import React, { useState } from 'react';
import UserSvcContext from './user.context';
import { Role } from '@shared/enums/user-enums';

export interface IUserService {
	setUserData(userData: UserData): void;
	getUserData(): UserData;
	isAdmin(): boolean;
}

export default function UserServiceComponent({ children }: { children: React.ReactNode }) {
	const [_userData, _setUserData] = useState<UserData>({
		id: '',
		email: '',
		first_name: '',
		last_name: '',
		pfp: '',
		role: Role.NULL,
	});

	function setUserData(userData: UserData) {
		_setUserData(userData);
	}

	function getUserData() {
		return _userData;
	}

	function isAdmin(): boolean {
		return true;
		return _userData.role === Role.ADMIN || _userData.role === Role.SUPERADMIN;
	}

	const ctx: IUserService = {
		setUserData,
		getUserData,
		isAdmin,
	};

	return <UserSvcContext.Provider value={ctx}>{children}</UserSvcContext.Provider>;
}
