import { axios_ } from '@shared/instances/axios';
import endpoints from './endpoints';
import {
	CreateEventResponse,
	DeleteEventResponse,
	ListEventsResponse,
	RetrieveEventResponse,
	UpdateEventResponse,
} from './responses/events.responses';
import { CreateEventDto } from './dto/events.dto';

// import { faker } from '@faker-js/faker';
// import { EventStatus } from '@shared/enums/networks-enum';
import { FilterEvents } from '@shared/enums/events-filter.enum';

// if (import.meta.env.VITE_APP_ENV === 'DEV') {
// 	// =====================================
// 	// List Events Mock Response
// 	// =====================================
// 	const res_1: ListEventsResponse = {
// 		events: new Array(10).fill(0).map(() => ({
// 			id: faker.string.uuid(),
// 			title: faker.book.title(),
// 			subtitle: faker.lorem.sentence(),
// 			description: faker.lorem.paragraph(),
// 			image: faker.image.urlPicsumPhotos(),

// 			country: faker.location.country(),
// 			city: faker.location.city(),
// 			address: faker.location.streetAddress(),
// 			start_date: faker.date.future().toString(),
// 			end_date: faker.date.future().toString(),

// 			attendees_capacity: faker.number.int({ min: 50, max: 1000 }),

// 			attendees: 0,
// 			speakers: 0,

// 			status: EventStatus.INCOMING,
// 			created_at: faker.date.past().toString(),
// 		})),
// 		metadata: {
// 			items_per_page: 10,
// 			total_items: 50,
// 			current_page: 1,
// 			total_pages: 5,
// 		},
// 	};

// 	mock.onGet(endpoints.events.list).reply(200, res_1);

// 	// =====================================
// 	// Retrieve Event Mock Response
// 	// =====================================
// 	const res_2: RetrieveEventResponse = {
// 		id: faker.string.uuid(),
// 		title: faker.book.title(),
// 		subtitle: faker.lorem.sentence(),
// 		description: faker.lorem.paragraph(),
// 		image: faker.image.urlPicsumPhotos(),

// 		website: Math.random() > 0.5 ? faker.internet.url() : undefined,

// 		country: faker.location.country(),
// 		city: faker.location.city(),
// 		address: faker.location.streetAddress(),
// 		start_date: faker.date.future().toString(),
// 		end_date: faker.date.future().toString(),

// 		attendees_capacity: faker.number.int({ min: 50, max: 1000 }),

// 		attendees_list: new Array(123).fill(0).map(() => ({
// 			id: faker.string.uuid(),
// 			name: faker.person.fullName(),
// 			email: faker.internet.email(),
// 			pfp: faker.image.avatar(),
// 			is_speaker: faker.datatype.boolean({ probability: 0.02 }),
// 		})),

// 		host: {
// 			id: faker.string.uuid(),
// 			name: faker.person.fullName(),
// 			pfp: faker.image.avatar(),
// 			email: faker.internet.email(),
// 		},

// 		status: EventStatus.INCOMING,
// 		created_at: faker.date.past().toString(),
// 	};

// 	mock.onGet(/\/events\/([a-f0-9-]+)/).reply(200, res_2);

// 	// =====================================
// 	// Create Event Mock Response
// 	// =====================================

// 	const res_3: CreateEventResponse = {
// 		id: faker.string.uuid(),
// 	};

// 	mock.onPost(endpoints.events.create).reply(201, res_3);

// 	// =====================================
// 	// Delete Event Mock Response
// 	// =====================================

// 	const res_5: DeleteEventResponse = {
// 		id: faker.string.uuid(),
// 		message: 'Event deleted successfully',
// 	};

// 	mock.onDelete(/\/events\/([a-f0-9-]+)/).reply(200, res_5);
// }

type ListParams = {
	limit?: number;
	offset?: number;
	search?: string;
	status?: FilterEvents;
	created_by?: string;
};

const eventsApi = {
	async list(params: ListParams): Promise<ListEventsResponse> {
		const res = await axios_<ListEventsResponse>({
			method: 'GET',
			url: endpoints.events.list,
			params,
		});

		return res.data;
	},

	async retrieve(id: string): Promise<RetrieveEventResponse> {
		const res = await axios_<RetrieveEventResponse>({
			method: 'GET',
			url: endpoints.events.retrieve.replace(':id', id),
		});

		return res.data;
	},

	async create(dto: CreateEventDto): Promise<CreateEventResponse> {
		// transform dto to form data
		const formData = new FormData();
		for (const key in dto) {
			if (Object.prototype.hasOwnProperty.call(dto, key)) {
				const value = dto[key as keyof CreateEventDto];
				if (value !== undefined) {
					formData.append(key, value as any);
				}
			}
		}

		const res = await axios_<CreateEventResponse>({
			method: 'POST',
			url: endpoints.events.create,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			data: formData,
		});
		return res.data;
	},

	async update(id: string, dto: CreateEventDto): Promise<UpdateEventResponse> {
		const res = await axios_<UpdateEventResponse>({
			method: 'PATCH',
			url: endpoints.events.update.replace(':id', id),
			data: dto,
		});

		return res.data;
	},

	async delete(id: string): Promise<DeleteEventResponse> {
		const res = await axios_<DeleteEventResponse>({
			method: 'DELETE',
			url: endpoints.events.delete.replace(':id', id),
		});

		return res.data;
	},
};

export { eventsApi };
