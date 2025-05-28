import APP_MODALS from '@static/enums/app.modals';

export type ModalData = {
	id: string;
	show: boolean;
	data?: any; // any data to be passed to the modal component
};

export type ContactModalData = {
	event: {
		title: string;
		country: string;
		city: string;
		address: string;
	};

	host: {
		id: string;
		pfp: string;
		name: string;
		email: string;
	};
};

export type ModalDataMap = {
	[APP_MODALS.LOGIN_MODAL]: null;
	[APP_MODALS.REGISTER_MODAL]: null;
	[APP_MODALS.EXAMPLE_MODAL]: null;
	[APP_MODALS.CONTACT_MODAL]: ContactModalData;
};
