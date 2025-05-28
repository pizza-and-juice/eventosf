import { faker } from '@faker-js/faker';

import endpoints from './endpoints';
import { ListUsersResponse, RetrieveUserResponse } from './responses/users.responses';
import { axios_m, mock } from '@shared/instances/axios';
import { Role } from '@shared/enums/user-enums';

if (import.meta.env.VITE_APP_ENV === 'DEV') {
	// =====================================
	// List users response
	// =====================================
	const res_1: RetrieveUserResponse = {
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
		pfp: faker.image.avatar(),
		role: Role.USER,
	};

	mock.onGet(/\/users\/([a-f0-9-]+)/).reply(200, res_1);
}

const UsersApi = {
	async list(): Promise<ListUsersResponse> {
		const res = await axios_m<ListUsersResponse>({
			method: 'GET',
			url: endpoints.user.list,
		});

		return res.data;
	},

	async retrieve(id: string): Promise<RetrieveUserResponse> {
		const res = await axios_m<RetrieveUserResponse>({
			method: 'GET',
			url: endpoints.user.get.replace(':id', id),
		});

		return res.data;
	},
};

export default UsersApi;
