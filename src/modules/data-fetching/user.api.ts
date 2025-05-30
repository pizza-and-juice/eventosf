// import { faker } from '@faker-js/faker';

import endpoints from './endpoints';
import { ListUsersResponse, RetrieveUserResponse } from './responses/users.responses';
import { axios_ } from '@shared/instances/axios';

// if (import.meta.env.VITE_APP_ENV === 'DEV') {
// 	// =====================================
// 	// List users response
// 	// =====================================
// 	const res_1: RetrieveUserResponse = {
// 		id: faker.string.uuid(),
// 		name: faker.person.fullName(),
// 		email: faker.internet.email(),
// 		pfp: faker.image.avatar(),
// 		role: UserRole.USER,
// 	};

// 	mock.onGet(/\/users\/([a-f0-9-]+)/).reply(200, res_1);
// }

const UsersApi = {
	async list(): Promise<ListUsersResponse> {
		const res = await axios_<ListUsersResponse>({
			method: 'GET',
			url: endpoints.user.list,
		});

		return res.data;
	},

	async retrieve(id: string): Promise<RetrieveUserResponse> {
		const res = await axios_<RetrieveUserResponse>({
			method: 'GET',
			url: endpoints.user.get.replace(':id', id),
		});

		return res.data;
	},
};

export default UsersApi;
