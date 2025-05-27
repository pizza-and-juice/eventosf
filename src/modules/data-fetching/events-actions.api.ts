import { axios_ } from '@shared/instances/axios';
import endpoints from './endpoints';
import {
	AttendEventResponse,
	RegisterEventResponse,
	UnregisterEventResponse,
} from './responses/events-actions.responses';
import { AttendEventDto, RegisterEventDto, UnregisterEventDto } from './dto/events-actions.dto';

export const EventActionsApi = {
	async register(dto: RegisterEventDto): Promise<RegisterEventResponse> {
		const res = await axios_<RegisterEventResponse>({
			method: 'POST',
			url: endpoints.events_actions.register.replace(':id', dto.eventId),
		});

		return res.data;
	},

	async unregister(dto: UnregisterEventDto): Promise<UnregisterEventResponse> {
		const res = await axios_<UnregisterEventResponse>({
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
