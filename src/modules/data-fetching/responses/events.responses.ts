import { EventStatus } from '@shared/enums/networks-enum';

export type ListEventsResponse = {
	events: {
		// basic info
		id: string;
		title: string;
		subtitle: string;
		image: string;

		// location
		country: string;
		city: string;
		address: string;
		start_date: string;
		end_date: string;

		// contact
		webiste?: string;

		// event details
		attendees_capacity: number;

		attendees: number;
		speakers: number;

		status: EventStatus;
		created_at: string;
	}[];
	metadata: {
		items_per_page: number;
		total_items: number;
		current_page: number;
		total_pages: number;
	};
};

export type RetrieveEventResponse = {
	// basic info
	id: string;
	title: string;
	subtitle: string;
	description: string;
	image: string;

	// location
	country: string;
	city: string;
	address: string;
	start_date: string;
	end_date: string;

	// contact
	website?: string;

	// event details
	attendees_capacity: number;

	attendees_list: {
		id: string;
		name: string;
		email: string;
		pfp: string;
		is_speaker: boolean;
	}[];

	host: {
		id: string;
		name: string;
		email: string;
		pfp: string;
	};

	status: EventStatus;
	created_at: string;
};

export type CreateEventResponse = {
	id: string;
};

export type UpdateEventResponse = {
	id: string;
};

export type DeleteEventResponse = {
	id: string;
	message: string;
};
