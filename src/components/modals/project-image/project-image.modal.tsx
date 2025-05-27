import { useContext, useRef } from 'react';

import ModalService from 'src/shared/services/modal/modal.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import APP_MODALS from 'src/static/enums/app.modals';

type ImageModalProps = {
	modalId: APP_MODALS;
	data: {
		imageURl: string;
	};
};

export default function ProjectImageModal({ modalId, data }: ImageModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	// 1. inject modalSvc
	const modalSvc = useContext<ModalService>(ModalSvcContext);

	// 3. call the modal hook, it will return this object {show: boolean, closeModal: fn}
	function close() {
		const modalElmt = modalRef.current;
		if (!modalElmt) return;

		modalElmt.classList.add('animate-fadeOut');

		function handleAnimationEnd(e: any) {
			if (!modalElmt) return;
			if (e.animationName !== 'fadeOut') return;

			modalSvc.closeModal(modalId);
			modalElmt.classList.remove('animate-fadeOut');
			modalElmt.removeEventListener('animationend', handleAnimationEnd);
			// modalElmt.add('animate-fadeIn');
		}

		modalElmt.addEventListener('animationend', handleAnimationEnd);
	}

	return (
		// <!-- modal size manager -->
		<div
			className={` w-full max-w-[800px] max-h-full animate-fadeIn pointer-events-auto`}
			tabIndex={-1}
			ref={modalRef}
		>
			<button
				type="button"
				className="absolute right-12 top-14 text-gray-400 bg-gray-200  rounded-lg text-sm w-8 h-8 dark:bg-gray-600 dark:text-white"
				data-modal-hide="defaultModal"
				onClick={close}
			>
				<span className="icon">
					<i className="far fa-times"></i>
				</span>

				<span className="sr-only">Close modal</span>
			</button>

			<div className="relative  rounded-lg grid place-items-center ">
				{/* modal box */}
				<img className="" src={data.imageURl} />
			</div>
		</div>
	);
}
