import { ReactNode, useState } from 'react';

// data-fetching
import api from '@modules/data-fetching/api';
import { LoginDto, RegisterDto } from '@modules/data-fetching/dto/auth.dto';
import { axios_ } from '@shared/instances/axios';

import AuthSvcContext from './auth.context';

// static
import { APP_EVENTS } from '@static/enums/app.events';

// shared
import { Role } from '@shared/enums/user-enums';
import { AppStorage, UserData } from '@shared/types';
import STORAGE_KEYS from '@static/storage.keys';

export interface IAuthService {
	isLoggedIn: boolean;
	register(dto: RegisterDto): void;
	login(dto: LoginDto): Promise<void>;
	logout(): Promise<void>;
	restoreSession(): Promise<void>;
}

type Props = {
	storage: AppStorage;
	children: ReactNode;
};

export default function AuthServiceComponent({ children, storage }: Props) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	async function register(dto: RegisterDto): Promise<void> {
		const res = await api.auth.register(dto);

		const user = {
			id: res.user.id,
			email: res.user.email,
			name: res.user.name,
			pfp: res.user.pfp,
			role: res.user.role,
		};

		const token = res.token.access_token;
		storage.set(STORAGE_KEYS.auth_session, token);

		const loggedInEvent = new CustomEvent<UserData>(APP_EVENTS.AUTH_LOGGED_IN, {
			detail: user,
		});
		document.dispatchEvent(loggedInEvent);

		setIsLoggedIn(true);
	}

	async function login(dto: LoginDto): Promise<void> {
		const res = await api.auth.login(dto);

		const user = {
			id: res.user.id,
			email: res.user.email,
			name: res.user.name,
			pfp: res.user.pfp,
			role: res.user.role,
		};

		const token = res.token.access_token;
		storage.set(STORAGE_KEYS.auth_session, token);

		addtokentoHeaders(token); // Añadir el token a los headers de axios

		const loggedInEvent = new CustomEvent<UserData>(APP_EVENTS.AUTH_LOGGED_IN, {
			detail: user,
		});
		document.dispatchEvent(loggedInEvent);

		setIsLoggedIn(true);
	}

	function addtokentoHeaders(token: string): void {
		axios_.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}

	async function logout(): Promise<void> {
		try {
			await api.auth.logout(); // Asegurarse de que logout2() no tenga errores silenciosos
		} catch (err) {
			console.error('Logout failed:', err);
		} finally {
			const loggedOutEvent = new CustomEvent(APP_EVENTS.AUTH_LOGGED_OUT);
			document.dispatchEvent(loggedOutEvent);

			storage.remove(STORAGE_KEYS.auth_session);

			setIsLoggedIn(false);
		}
	}

	async function restoreSession(): Promise<void> {
		const token = storage.get<string>(STORAGE_KEYS.auth_session);

		if (token) {
			try {
				addtokentoHeaders(token); // Añadir el token a los headers de axios
				const res = await api.auth.session();
				const user = {
					id: res.user.id,
					email: res.user.email,
					name: res.user.name,
					pfp: res.user.pfp,
					role: res.user.role as Role,
				};
				const loggedInEvent = new CustomEvent<UserData>(APP_EVENTS.AUTH_LOGGED_IN, {
					detail: user,
				});

				document.dispatchEvent(loggedInEvent);
				setIsLoggedIn(true);
			} catch (err) {
				console.error('Failed to restore session:', err);
				storage.remove(STORAGE_KEYS.auth_session);
				setIsLoggedIn(false);
			}
		}
	}

	// Definir el contexto de forma reactiva dentro del render
	const ctx: IAuthService = {
		isLoggedIn,
		register,
		login,
		logout,
		restoreSession,
	};

	return <AuthSvcContext.Provider value={ctx}>{children}</AuthSvcContext.Provider>;
}
