import { Link } from 'react-router-dom';
import { useContext, useRef } from 'react';

import ModalService from 'src/shared/services/modal/modal.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import APP_MODALS from 'src/static/enums/app.modals';
import Tag from 'src/components/internal/tags/tags.component';

import { shortenString } from 'src/shared/utils/formatters';

// import { toast } from 'react-toastify';

import '../../../components/internal/text-link/text-link.component.scss';

type ExampleModalProps = {
	modalId: APP_MODALS;
	data: {
		currency: string;
		framework: string;
		projectDeployment: string;
		telegramUsername: string;
		email: string;
		twitterLinkedinUrl: string;
		walletAddress: string;
		grantAmount: number;
	};
};

export default function ContactModal({ modalId, data }: ExampleModalProps) {
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

	const details1 = [
		{
			label: 'Grants Details',
			tag: `${data.currency ? `${data.currency}` : 'USDT'}`,
		},
		{
			label: 'Project Framework',
			tag: `${data.framework}`,
		},
		{
			label: 'Project Deployment',
			tag: `${data.projectDeployment}`,
		},
		{
			label: 'Grant Amount',
			tag: data.grantAmount,
		},
	];

	const details2 = [
		{
			label: 'Telegram Username',
			text_link: `https://t.me/${data.telegramUsername}`,
		},
		{
			label: 'Email Address',
			text_link: `${data.email}`,
		},
		{
			label: 'Twitter/LinkedIn',
			text_link: `${shortenString(data.twitterLinkedinUrl, 50, 30)}`,
		},
		{
			label: 'Wallet Address',
			text_link: `${data.walletAddress}`,
		},
	];

	return (
		// <!-- modal size manager -->
		<div
			className={`w-full max-w-2xl max-h-full animate-fadeIn pointer-events-auto`}
			tabIndex={-1}
			ref={modalRef}
		>
			{/* <!-- Modal box --> */}
			<div className="relative dark:bg-dark-800 bg-white rounded-lg shadow">
				{/* Modal header */}
				<div className="flex items-center justify-between sm:px-8 px-4 sm:py-6 pt-6 pb-2">
					<h1 className="text-black dark:text-white text-2xl font-bold leading-[36px]">
						Contact Details
					</h1>
					<button>
						<i onClick={close} className="fas fa-times text-xl dark:text-white"></i>
					</button>
				</div>

				{/* <!-- Modal body --> */}
				<div className="space-y-6 sm:px-8 px-4 pb-8 pt-2">
					{details1.map((item: any, index: number) => (
						<div key={index} className="flex justify-between items-center h-[32px]">
							<h2 className="leading-[26px] font-medium text-black dark:text-white">
								{item.label}
							</h2>
							<Tag>{item.tag}</Tag>
						</div>
					))}

					<hr className="border-light-700 dark:border-dark-700" />

					{details2.map((item, index) => (
						<div
							key={index}
							className="flex sm:flex-row flex-col gap-y-2 justify-between sm:items-center"
						>
							<h2 className="leading-[26px] font-medium text-black dark:text-white">
								{item.label}
							</h2>
							{index === 3 ? (
								<h3 className="text-black dark:text-white sm:pl-0 pl-2">
									{item.text_link}
								</h3>
							) : (
								<Link
									target="_blank"
									to={item.text_link}
									className="text-link sm:pl-0 pl-2"
								>
									{item.text_link}
								</Link>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
