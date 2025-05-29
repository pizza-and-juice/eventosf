const _baseUrl = import.meta.env.VITE_APP_API;

const endpoints = {
	baseUrl: _baseUrl,

	auth: {
		register: `${_baseUrl}/auth/register`, // POST
		login: `${_baseUrl}/auth/login`, // POST
		logout: `${_baseUrl}/auth/logout`, // POST
		session: `${_baseUrl}/session`, // GET
	},

	events: {
		list: `${_baseUrl}/events`, // GET
		retrieve: `${_baseUrl}/events/:id`, // GET
		create: `${_baseUrl}/events`, // POST
		update: `${_baseUrl}/events/:id`, // PUT
		delete: `${_baseUrl}/events/:id`, // DELETE
	},

	events_actions: {
		register: `${_baseUrl}/events/:id/register`, // POST
		unregister: `${_baseUrl}/events/:id/unregister`, // DELETE
		attend: `${_baseUrl}/events/:id/attend`, // POST
	},

	user: {
		list: `${_baseUrl}/users`, // GET
		get: `${_baseUrl}/users/:id`, // GET
	},

	user_events: {
		list_attending: `${_baseUrl}/user-events/attending`, // GET
		list_created: `${_baseUrl}/user-events/created`, // GET
		list_attending_ids: `${_baseUrl}/user-events/attending-ids`, // GET
	},
};

export default endpoints;
