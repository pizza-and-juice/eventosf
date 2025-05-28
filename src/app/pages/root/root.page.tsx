// third party
import { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// services
import DocumentTitleService from '@shared/services/doc-title/doc-title.service';
import DocTitleSvcContext from '@shared/services/doc-title/doc-title.context';
import ModalSvcContext from '@shared/services/modal/modal.context';

// sections
import DetailsSection from './sections/details-section/details.section';
import GrantSection from './sections/grant-section/grant.section';
import HeroSection from './sections/hero-section/hero.section';
import SupportSection from './sections/support-section/support.section';

// static
import APP_MODALS from '@static/enums/app.modals';

export default function LandingPage() {
	const titleSvc = useContext<DocumentTitleService>(DocTitleSvcContext);
	titleSvc.setTitle('Home');

	const modalSvc = useContext(ModalSvcContext);

	const [searchParams] = useSearchParams();

	useEffect(() => {
		const a = searchParams.get('a');

		if (a) {
			modalSvc.open(APP_MODALS.LOGIN_MODAL, null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<main>
			<HeroSection />
			<SupportSection />
			<GrantSection />
			<DetailsSection />

			<div className="h-[80px]"></div>
		</main>
	);
}
