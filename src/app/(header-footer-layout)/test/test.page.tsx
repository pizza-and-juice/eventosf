import { useContext } from 'react';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import ModalService from 'src/shared/services/modal/modal.service';
import APP_MODALS from 'src/static/enums/app.modals';

export default function TEstPage() {
	const modalSvc = useContext<ModalService>(ModalSvcContext);

	function openModal() {
		modalSvc.open(APP_MODALS.SESSION_EXPIRED);
	}

	return (
		<div className="px-[80px]">
			<button onClick={openModal}>Open Modal</button>
		</div>
	);
}
