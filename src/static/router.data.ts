const ROUTES = {
	// landing
	root: '/',

	any: '*',

	events: {
		root: '/events',
		create: '/events/create',
		details: '/events/:id',
	},

	// dashboard
	dashboard: {
		root: '/dashboard',
	},
	// projects
	projects: {
		root: '/projects',
		details: '/projects/:id',
		edit: '/projects/:id/edit',
	},

	//
	faq: '/faq',

	//profile
	profile: {
		root: '/profile/:id',
		edit: '/profile/edit',
		// upvotes: '/profile/upvotes',
		// subsmissions: '/profile/submissions',
	},

	// apply for grant
	grantApply: '/grant/apply',

	// login modal

	external: {
		wallet: '',
		telegram: 'https://t.me/:user',

		pwr: {
			governance: 'https://governance.pwrlabs.io/',
			staking: 'https://staking.pwrlabs.io/',
		},
	},

	auth: {
		twitter: '/auth/twitter',
	},

	admin: {
		projects: {
			details: '/admin/projects/:id',
			edit: '/admin/projects/:id/edit',
		},
	},
};

export default ROUTES;
