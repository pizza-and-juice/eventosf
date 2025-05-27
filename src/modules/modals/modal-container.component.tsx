import { useContext } from 'react';

// shared
import ModalSvcContext from '@shared/services/modal/modal.context';

type ModalContainerProps = {
	children: React.ReactNode;
};

export default function ModalContainer({ children }: ModalContainerProps) {
	const modalSvc = useContext(ModalSvcContext);

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
			<div
				id="modal_container"
				className="absolute top-0 left-0 w-full h-full p-4 py-16 md:inset-0 overflow-x-hidden overflow-y-auto pointer-events-none grid place-items-center "
			>
				{children}
			</div>
		</div>
	);
}
