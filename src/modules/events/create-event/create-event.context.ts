import { createContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateEventForm } from './create_event.schema';

export type CreateEventPageCtxType = {
	form: UseFormReturn<CreateEventForm, any, CreateEventForm>;

	state: {
		activeSection: number;
		link_group: {
			title: string;
			links: {
				name: string;
				onClick: () => void;
			}[];
		}[];

		globalError: string | null;
	};

	fn: {
		manualHandleSubmit(): Promise<void>;
	};

	refs: {
		sectionRefs: React.MutableRefObject<(HTMLFieldSetElement | null)[]>;
	};
};

// @ts-expect-error init later
export const CreateEventPageCtx = createContext<CreateEventPageCtxType>();
