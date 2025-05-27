import { axios_, axios_m, mock } from '@shared/instances/axios';
import endpoints from './endpoints';
import {
	AttendEventResponse,
	RegisterEventResponse,
	UnregisterEventResponse,
} from './responses/events-actions.responses';
import { AttendEventDto, RegisterEventDto, UnregisterEventDto } from './dto/events-actions.dto';

if (import.meta.env.VITE_APP_ENV === 'DEV') {
	// =====================================
	// Register on event response
	// =====================================

	const res_1: RegisterEventResponse = {
		message: 'Successfully registered for the event',
	};

	const error_res_1 = {
		code: '400_LIMIT_REACHED',
		message: 'Limit reached for this event',
	};

	mock.onPost(/\/events\/([a-f0-9-]+)\/register/).reply(201, res_1);

	// =====================================
	// Unregister on event response
	// =====================================
	const res_2: UnregisterEventResponse = {
		message: 'Successfully unregistered from the event',
	};

	mock.onDelete(/\/events\/([a-f0-9-]+)\/unregister/).reply(201, res_2);
}

export const EventActionsApi = {
	async register(dto: RegisterEventDto): Promise<RegisterEventResponse> {
		console.log(endpoints.events_actions.register.replace(':id', dto.eventId));
		const res = await axios_m<RegisterEventResponse>({
			method: 'POST',
			url: endpoints.events_actions.register.replace(':id', dto.eventId),
		});

		return res.data;
	},

	async unregister(dto: UnregisterEventDto): Promise<UnregisterEventResponse> {
		const res = await axios_m<UnregisterEventResponse>({
			method: 'DELETE',
			url: endpoints.events_actions.unregister.replace(':id', dto.eventId),
			data: dto,
		});

		return res.data;
	},

	async attend(dto: AttendEventDto): Promise<AttendEventResponse> {
		const res = await axios_<AttendEventResponse>({
			method: 'POST',
			url: endpoints.events_actions.attend.replace(':id', dto.eventId),
			data: dto,
		});

		return res.data;
	},
};
