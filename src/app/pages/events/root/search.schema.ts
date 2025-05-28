import { z } from 'zod';

export const searchEventsSchema = z.object({
	search: z.string().min(1, 'Search query must be at least 1 character long'),
});

export type SearchEventsSchema = z.infer<typeof searchEventsSchema>;
