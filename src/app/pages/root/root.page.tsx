import { useContext } from 'react';

import DocumentTitleService from 'src/shared/services/doc-title/doc-title.service';
import DocTitleSvcContext from 'src/shared/services/doc-title/doc-title.context';

import DetailsSection from './sections/details-section/details.section';
import GrantSection from './sections/grant-section/grant.section';
import HeroSection from './sections/hero-section/hero.section';
import SupportSection from './sections/support-section/support.section';

export default function LandingPage() {
	const titleSvc = useContext<DocumentTitleService>(DocTitleSvcContext);
	titleSvc.setTitle('Home');

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
