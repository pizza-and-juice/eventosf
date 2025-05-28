const _baseUrl = import.meta.env.VITE_APP_API;

const endpoints = {
	baseUrl: _baseUrl,

	auth: {
		register: `${_baseUrl}/auth/register`, // POST
		login: `${_baseUrl}/auth/login`, // POST
		logout: `${_baseUrl}/google-user/logout`, // POST
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
		list: `${_baseUrl}/user-events/interacted`, // GET
		list_registered_ids: `${_baseUrl}/user-events/registered-ids`, // GET
	},

	admin: {
		users: {
			list: `${_baseUrl}/admin/users`, // GET
		},
	},
};

export default endpoints;
