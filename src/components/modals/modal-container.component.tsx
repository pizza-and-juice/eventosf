import { useContext } from 'react';

import './modal-container.scss';

import ModalSvcContext from 'src/shared/services/modal/modal.context';
import ModalService from 'src/shared/services/modal/modal.service';

type ModalContainerProps = {
	children: React.ReactNode;
};

export default function ModalContainer({ children }: ModalContainerProps) {
	const modalSvc = useContext<ModalService>(ModalSvcContext);

	function closeCurrentModal() {
		modalSvc.closeCurrentModal();
	}

	return (
		<div className="modal_main_container">
			<div
				className={`modal_overlay ${modalSvc.getGlassPanel() ? '' : 'hidden'}`}
				onClick={closeCurrentModal}
			></div>

			{/* modal container */}
			<div className="absolute top-0 left-0 w-full h-full p-4 md:inset-0 overflow-x-hidden overflow-y-auto pointer-events-none flex justify-center items-center">
				{children}
			</div>
		</div>
	);
}
