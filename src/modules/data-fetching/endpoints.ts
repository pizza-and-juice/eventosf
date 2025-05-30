const _baseUrl = import.meta.env.VITE_APP_API;

const endpoints = {
	baseUrl: _baseUrl,

	auth: {
		register: `${_baseUrl}/auth/register`, // POST
		login: `${_baseUrl}/auth/login`, // POST
		logout: `${_baseUrl}/auth/logout`, // POST
		session: `${_baseUrl}/auth/session`, // GET
	},

	events: {
		list: `${_baseUrl}/events/list`, // GET
		retrieve: `${_baseUrl}/events/retrieve/:id`, // GET
		create: `${_baseUrl}/events/create`, // POST
		update: `${_baseUrl}/events/:id`, // PUT
		delete: `${_baseUrl}/events/delete/:id`, // DELETE
	},

	events_actions: {
		register: `${_baseUrl}/event-actions/:id/register`, // POST
		register_as_speaker: `${_baseUrl}/event-actions/:id/register-as-speaker`, // POST
		unregister: `${_baseUrl}/event-actions/:id/unregister`, // DELETE
		complete: `${_baseUrl}/event-actions/:id/complete`, // POST
		attend: `${_baseUrl}/events/:id/attend`, // POST
	},

	user: {
		list: `${_baseUrl}/users`, // GET
		get: `${_baseUrl}/users/retrieve/:id`, // GET
	},

	user_events: {
		list_attending: `${_baseUrl}/user-events/attending`, // GET
		list_created: `${_baseUrl}/user-events/created`, // GET
		list_attending_ids: `${_baseUrl}/user-events/attending/ids`, // GET
	},
};

export default endpoints;
