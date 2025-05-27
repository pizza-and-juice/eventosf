import { ReactNode, useState } from 'react';

// import { getCustomerSession, login2, logout2, registerAction } from '@lib/data/customer';
import { LoginDto, RegisterDto } from '@modules/data-fetching/dto/auth.dto';

import { APP_EVENTS } from '@static/enums/app.events';
import { UserData } from '@shared/models/user/user.model';
import api from '@modules/data-fetching/api';

import AuthSvcContext from './auth.context';
import { Role } from '@shared/enums/user-enums';

export interface IAuthService {
	isLoggedIn: boolean;
	access_token: string;
	register(dto: RegisterDto): void;
	login(email: string, password: string): Promise<void>;
	logout(): Promise<void>;
	restoreSession(isLoggedIn: boolean): Promise<void>;
}

export default function AuthServiceComponent({ children }: { children: ReactNode }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [access_token, setAccessToken] = useState('');

	async function register(dto: RegisterDto): Promise<void> {
		await api.auth.register(dto);
		setIsLoggedIn(true);
	}

	async function login(email: string, password: string): Promise<void> {
		try {
			const dto: LoginDto = {
				email,
				password,
			};

			await api.auth.login(dto);

			// const user = await getCustomerSession();
			const user = {
				id: '123',
				email: 'example@gmail.com',
				first_name: 'John',
				last_name: 'Doe',
				pfp: 'https://example.com/pfp.jpg',
				role: Role.USER,
			};

			const loggedInEvent = new CustomEvent<UserData>(APP_EVENTS.AUTH_LOGGED_IN, {
				detail: {
					id: user.id,
					email: user.email,
					first_name: user.first_name || 'Unkown User',
					last_name: user.last_name || 'Unkown User',
					pfp: user.pfp || '',
					role: user.role,
				},
			});
			document.dispatchEvent(loggedInEvent);

			setIsLoggedIn(true);
		} catch (err) {
			console.error('Login failed:', err);
		}
	}

	async function logout(): Promise<void> {
		try {
			await api.auth.logout(); // Asegurarse de que logout2() no tenga errores silenciosos

			const loggedOutEvent = new CustomEvent(APP_EVENTS.AUTH_LOGGED_OUT);
			document.dispatchEvent(loggedOutEvent);

			setIsLoggedIn(false);
		} catch (err) {
			console.error('Logout failed:', err);
		}
	}

	async function restoreSession(isUserLoggedIn: boolean): Promise<void> {
		if (isUserLoggedIn) {
			try {
				const user = {
					id: '123',
					email: 'example@gmail.com',
					first_name: 'John',
					last_name: 'Doe',
					pfp: 'https://example.com/pfp.jpg',
					role: Role.USER,
				};
				const loggedInEvent = new CustomEvent<UserData>(APP_EVENTS.AUTH_LOGGED_IN, {
					detail: {
						id: user.id,
						email: user.email,
						first_name: user.first_name || 'Unkown User',
						last_name: user.last_name || 'Unkown User',
						pfp: user.pfp || '',
						role: user.role,
					},
				});

				document.dispatchEvent(loggedInEvent);
				setIsLoggedIn(true);
			} catch (err) {
				return;
			}
		}
	}

	// Definir el contexto de forma reactiva dentro del render
	const ctx: IAuthService = {
		access_token,
		isLoggedIn,
		register,
		login,
		logout,
		restoreSession,
	};

	return <AuthSvcContext.Provider value={ctx}>{children}</AuthSvcContext.Provider>;
}
