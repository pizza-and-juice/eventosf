import { Signal, signal } from '@preact/signals-react';
import { PROJECT_QV_TABS } from 'src/static/enums/qv.enum';

type ProjectQVState = {
	projectId: number;
	isOpen: boolean;
	tab?: PROJECT_QV_TABS;
};

export default class LayoutService {
	private projectQVOpen: Signal<ProjectQVState> = signal({
		projectId: -1,
		isOpen: false,
		tab: undefined,
	});

	constructor() {
		this.projectQVOpen.subscribe((value) => {
			if (value.isOpen) {
				const html = document.querySelector('html');
				html!.classList.add('overflow-hidden');
			} else {
				const html = document.querySelector('html');
				html!.classList.remove('overflow-hidden');
			}
		});
	}

	public getProjectQVState(): ProjectQVState {
		return this.projectQVOpen.value;
	}

	public closeProjectQV(): void {
		this.projectQVOpen.value = {
			projectId: -1,
			isOpen: false,
		};
	}

	public openProjectQV(projectId: number, tab?: PROJECT_QV_TABS): void {
		this.projectQVOpen.value = {
			projectId,
			isOpen: true,
			tab,
		};
	}
}
