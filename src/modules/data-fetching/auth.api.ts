import { axios_ } from '@shared/instances/axios';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import {
	LoginResponse,
	LogoutResponse,
	RegisterResponse,
	SessionResponse,
} from './responses/auth.responses';
import endpoints from './endpoints';
// import { faker } from '@faker-js/faker';
// import { UserRole } from '@shared/enums/user-enums';

// if (import.meta.env.VITE_APP_ENV === 'DEV') {
// 	// =====================================
// 	// Register on event response
// 	// =====================================
// 	const res_2: RegisterResponse = {
// 		token: {
// 			access_token: 'example_access_token',
// 			expires_at: 0, // 1 hour from now
// 		},

// 		user: {
// 			id: faker.string.uuid(),
// 			email: faker.internet.email(),
// 			name: faker.person.fullName(),
// 			pfp: faker.image.avatar(),
// 			role: UserRole.USER, // or 'ADMIN'
// 		},
// 	};

// 	mock.onPost(endpoints.auth.register).reply(200, res_2);

// 	// =====================================
// 	// Login on event response
// 	// =====================================
// 	const res_1: LoginResponse = {
// 		token: {
// 			access_token: 'example_access_token',
// 			expires_at: 0, // 1 hour from now
// 		},

// 		user: {
// 			id: faker.string.uuid(),
// 			email: faker.internet.email(),
// 			name: faker.person.fullName(),
// 			pfp: faker.image.avatar(),
// 			role: UserRole.USER, // or 'ADMIN'
// 		},
// 	};

// 	mock.onPost(endpoints.auth.login).reply(200, res_1);

// 	// =====================================
// 	// Logout on event response
// 	// =====================================
// 	mock.onPost(endpoints.auth.logout).reply(200, {
// 		message: 'Logged out successfully',
// 	});

// 	// =====================================
// 	// Session on event response
// 	// =====================================
// 	const res_3: SessionResponse = {
// 		user: {
// 			id: faker.string.uuid(),
// 			email: faker.internet.email(),
// 			name: faker.person.fullName(),
// 			pfp: faker.image.avatar(),
// 			role: UserRole.USER, // or 'ADMIN'
// 		},
// 	};
// 	mock.onGet(endpoints.auth.session).reply(200, res_3);
// }

const authApi = {
	async register(dto: RegisterDto): Promise<RegisterResponse> {
		const res = await axios_<RegisterResponse>({
			method: 'POST',
			url: endpoints.auth.register,
			data: dto,
		});
		return res.data;
	},

	async login(dto: LoginDto): Promise<LoginResponse> {
		const res = await axios_<LoginResponse>({
			method: 'POST',
			url: endpoints.auth.login,
			data: dto,
		});

		return res.data;
	},

	async logout(): Promise<LogoutResponse> {
		const res = await axios_<LogoutResponse>({
			method: 'POST',
			url: endpoints.auth.logout,
		});

		return res.data;
	},

	async session(): Promise<SessionResponse> {
		const res = await axios_<SessionResponse>({
			method: 'GET',
			url: endpoints.auth.session,
		});

		return res.data;
	},
};

export { authApi };
