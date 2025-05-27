import { axios_ } from '@shared/instances/axios';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import {
	LoginResponse,
	LogoutResponse,
	RegisterResponse,
	SessionResponse,
} from './responses/auth.responses';
import endpoints from './endpoints';

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
