import { axios_m, mock } from '@shared/instances/axios';
import {
	ListUserEventsIdsResponse,
	ListUserEventsResponse,
} from './responses/user-events.responses';
import endpoints from './endpoints';
import { faker } from '@faker-js/faker';
import { EventStatus } from '@shared/enums/networks-enum';
import axios from 'axios';

if (import.meta.env.VITE_APP_ENV === 'DEV') {
	// =====================================
	// List User Events Response
	// =====================================
	const res_1: ListUserEventsResponse = {
		events: new Array(10).fill(0).map(() => ({
			id: faker.string.uuid(),
			title: faker.book.title(),
			subtitle: faker.lorem.sentence(),
			description: faker.lorem.paragraph(),
			image: faker.image.urlPicsumPhotos(),

			country: faker.location.country(),
			city: faker.location.city(),
			address: faker.location.streetAddress(),
			start_date: faker.date.future().toString(),
			end_date: faker.date.future().toString(),

			attendees_capacity: faker.number.int({ min: 50, max: 1000 }),

			attendees: 0,
			speakers: 0,

			status: Math.random() > 0.5 ? EventStatus.INCOMING : EventStatus.COMPLETED,
			created_at: faker.date.past().toString(),
		})),
		metadata: {
			items_per_page: 10,
			total_items: 50,
			current_page: 1,
			total_pages: 5,
		},
	};

	mock.onGet(endpoints.user_events.list).reply(200, res_1);

	// =====================================
	// List User Events Registered IDs Response
	// =====================================
	mock.onGet(endpoints.user_events.list_registered_ids).reply((config) => {
		const { event_ids } = config.params as { event_ids: string[] };
		if (!event_ids || !Array.isArray(event_ids) || event_ids.length === 0) {
			return [400, 'Event IDs are required'];
		}

		return [200, event_ids.filter(() => Math.random() > 0.5)];
	});
}

type ReqParams = {
	userId: string;
	limit?: number;
	offset?: number;
	status?: EventStatus;
	created_by?: string;
};

type Req2Params = {
	event_ids: string[];
};

const userEventsApi = {
	async list(params: ReqParams): Promise<ListUserEventsResponse> {
		const res = await axios_m<ListUserEventsResponse>({
			method: 'GET',
			url: endpoints.user_events.list,
			params,
		});

		return res.data;
	},

	async list_registered_ids(params: Req2Params): Promise<ListUserEventsIdsResponse> {
		const res = await axios_m<ListUserEventsIdsResponse>({
			method: 'GET',
			url: endpoints.user_events.list_registered_ids,
			params,
		});

		return res.data;
	},
};

export default userEventsApi;
