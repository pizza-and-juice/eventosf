// third party
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

// services
import AuthServiceComponent from '@shared/services/auth/auth.service';
import DocTitleSvcContext from '@shared/services/doc-title/doc-title.context';
import DocumentTitleService from '@shared/services/doc-title/doc-title.service';
import ModalService from '@shared/services/modal/modal.service';
import UserServiceComponent from '@shared/services/user/user.service';
import SettingsServiceComponent from '@shared/services/settings/settings.service';

// shared
import queryClient from '@shared/instances/query-client.instance';
import settings_eventChannel from '@shared/instances/settings.event-channel';
import appStorage from '@shared/instances/persitent-storage';

const titleSvc = new DocumentTitleService();

// const authSvc = new AuthService(appStorage);

function AppUISvcs({ children }: { children: ReactNode }) {
	return (
		<DocTitleSvcContext.Provider value={titleSvc}>
			<ModalService>{children}</ModalService>
		</DocTitleSvcContext.Provider>
	);
}

function AppFnSvcs({ children }: { children: ReactNode }) {
	return (
		<SettingsServiceComponent event_channel={settings_eventChannel} storage={appStorage}>
			<AuthServiceComponent storage={appStorage}>
				<UserServiceComponent>{children}</UserServiceComponent>
			</AuthServiceComponent>
		</SettingsServiceComponent>
	);
}

type ContextComponentProps = {
	children: ReactNode;
};

export default function AppContext({ children }: ContextComponentProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<AppUISvcs>
				<AppFnSvcs>{children}</AppFnSvcs>
			</AppUISvcs>
		</QueryClientProvider>
	);
}
