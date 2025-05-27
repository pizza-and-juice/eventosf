import { Signal } from '@preact/signals-react';
import APP_MODALS from 'src/static/enums/app.modals';

export type ModalData = {
	id: string;
	show: boolean;
	data?: any; // any data to be passed to the modal component
};

export type ModalComponentData = {
	data: any;
	id: APP_MODALS;
	onOpen?: (data: any) => void;
	onClose?: (data: any) => void;
};

export interface IModal {
	id: APP_MODALS;
	show: Signal<boolean>;
}
