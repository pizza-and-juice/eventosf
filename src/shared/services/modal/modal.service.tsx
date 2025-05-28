import { useState, ReactNode, useEffect } from 'react';

import { ModalData, ModalDataMap } from '@modules/modals/modals.types';

import APP_MODALS from '@static/enums/app.modals';

import ModalSvcContext from './modal.context';

import { APP_EVENTS } from '@static/enums/app.events';

export interface IModalService {
	getGlassPanel: () => boolean;
	getOpenModals: () => ModalData[];
	getModalData: <K extends keyof ModalDataMap>(modalId: K) => ModalDataMap[K] | undefined;
	open: <K extends keyof ModalDataMap>(modalId: K, data: ModalDataMap[K]) => void;
	closeModal: (modalId: APP_MODALS) => void;
	closeCurrentModal: () => void;
	closeAllModals: () => void;
}

export default function ModalServiceComponent({ children }: { children: ReactNode }) {
	// the first modal in the array is the opened modal
	const [modals, setModals] = useState<ModalData[]>([]);
	const [showGlassPanel, setShowGlassPanel] = useState(false);

	useEffect(() => {
		const handleModalsChange = (e: CustomEvent<ModalData[]>) => {
			const hasModals = e.detail.length > 0;
			setShowGlassPanel(hasModals);
			document.querySelector('html')!.style.overflow = hasModals ? 'hidden' : 'auto';
		};

		document.addEventListener(APP_EVENTS.MODALS_CHANGED, handleModalsChange as EventListener);

		return () => {
			document.removeEventListener(
				APP_EVENTS.MODALS_CHANGED,
				handleModalsChange as EventListener
			);
		};
	}, []);

	function getGlassPanel() {
		return showGlassPanel;
	}

	function getOpenModals() {
		return modals;
	}

	function getModalData<K extends keyof ModalDataMap>(modalId: K): ModalDataMap[K] | undefined {
		return modals.find((m) => m.id === modalId)?.data;
	}

	function emitModalsChanged(updatedModals: ModalData[]) {
		const modalsEvent = new CustomEvent<ModalData[]>(APP_EVENTS.MODALS_CHANGED, {
			detail: updatedModals,
		});
		document.dispatchEvent(modalsEvent);
	}

	function open<K extends keyof ModalDataMap>(modalId: K, data: ModalDataMap[K]) {
		setModals((prev) => {
			if (prev.some((m) => m.id === modalId)) return prev;

			const newModals = [...prev, { id: modalId, show: true, data }];
			emitModalsChanged(newModals);
			return newModals;
		});
	}

	function closeModal(modalId: APP_MODALS) {
		setModals((prev) => {
			const updated = prev.filter((m) => m.id !== modalId);
			emitModalsChanged(updated);
			return updated;
		});
	}

	function closeCurrentModal() {
		if (modals.length === 0) return;

		const updated = modals.slice(0, -1);
		setModals(updated);
		emitModalsChanged(updated);
	}

	function closeAllModals() {
		setModals([]);
		emitModalsChanged([]);
	}

	const ctx: IModalService = {
		getGlassPanel,
		getOpenModals,
		getModalData,
		open,
		closeModal,
		closeCurrentModal,
		closeAllModals,
	};

	return <ModalSvcContext.Provider value={ctx}>{children}</ModalSvcContext.Provider>;
}
