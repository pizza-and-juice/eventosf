import { EventStatus } from '@shared/enums/networks-enum';

export type ListUserEventsResponse = {
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

export type ListUserEventsIdsResponse = string[];
