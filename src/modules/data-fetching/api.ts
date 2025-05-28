import { authApi } from './auth.api';
import { EventActionsApi } from './events-actions.api';
import { eventsApi } from './events.api';
import userEventsApi from './user-events.api';
import UsersApi from './user.api';

const api = {
	auth: authApi,
	events: eventsApi,
	events_actions: EventActionsApi,
	user_events: userEventsApi,
	users: UsersApi,
};

export default api;
