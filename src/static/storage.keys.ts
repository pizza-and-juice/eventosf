const STORAGE_KEYS = {
	// settings
	generalSettings: 'app.generalSettings',

	// auth
	auth_session: 'app.auth.session',

	/**
	 * the data stored in memory storage is not persistent,
	 * it is lost when the page is refreshed or closed
	 */
	// *~~~ SESSION STORAGE ~~~* //
	user_data: 'app.user.data',
};

export default STORAGE_KEYS;
