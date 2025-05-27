import APP_MODALS from '@static/enums/app.modals';

export type ModalData = {
	id: string;
	show: boolean;
	data?: any; // any data to be passed to the modal component
};

export type ModalDataMap = {
	[APP_MODALS.LOGIN_MODAL]: null;
	[APP_MODALS.EXAMPLE_MODAL]: null;
};
