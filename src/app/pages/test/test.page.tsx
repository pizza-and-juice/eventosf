import { useContext } from 'react';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import APP_MODALS from 'src/static/enums/app.modals';

export default function TEstPage() {
	const modalSvc = useContext(ModalSvcContext);

	function openModal() {
		modalSvc.open(APP_MODALS.REGISTER_MODAL, null);
	}

	return (
		<div className="px-[80px]">
			<button onClick={openModal}>Open Modal</button>
		</div>
	);
}
