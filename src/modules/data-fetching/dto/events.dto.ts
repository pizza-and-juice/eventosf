export type CreateEventDto = {
	// basic info
	title: string;
	subtitle: string;
	description: string;
	image: File;

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
};
