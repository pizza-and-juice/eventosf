// third party
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

// services
import AuthServiceComponent from '@shared/services/auth/auth.service';

import queryClient from '@shared/instances/query-client.instance';
import DocTitleSvcContext from 'src/shared/services/doc-title/doc-title.context';
import DocumentTitleService from 'src/shared/services/doc-title/doc-title.service';
import LayoutSvcContext from 'src/shared/services/layout/layout.context';
import LayoutService from 'src/shared/services/layout/layout.service';
import ModalService from 'src/shared/services/modal/modal.service';
import TestSvcContext from 'src/shared/services/test/test.context';
import TestService from 'src/shared/services/test/test.service';
import UserSvcContext from 'src/shared/services/user/user.context';
import UserServiceComponent from '@shared/services/user/user.service';

// import PwrSvcContext from 'src/shared/services/pwr/pwr.context';

const testSvc = new TestService();

const titleSvc = new DocumentTitleService();
const layoutSvc = new LayoutService();

// const authSvc = new AuthService(appStorage);

function AppUISvcs({ children }: { children: ReactNode }) {
	return (
		<DocTitleSvcContext.Provider value={titleSvc}>
			<LayoutSvcContext.Provider value={layoutSvc}>
				<ModalService>{children}</ModalService>
			</LayoutSvcContext.Provider>
		</DocTitleSvcContext.Provider>
	);
}

function AppFnSvcs({ children }: { children: ReactNode }) {
	return (
		<AuthServiceComponent>
			<UserServiceComponent>{children}</UserServiceComponent>
		</AuthServiceComponent>
	);
}

type ContextComponentProps = {
	children: ReactNode;
};

export default function ContextComponent({ children }: ContextComponentProps) {
	return (
		<AppUISvcs>
			<TestSvcContext.Provider value={testSvc}>
				<QueryClientProvider client={queryClient}>
					<AppFnSvcs>{children}</AppFnSvcs>
				</QueryClientProvider>
			</TestSvcContext.Provider>
		</AppUISvcs>
	);
}
