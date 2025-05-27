import { useContext, useEffect, useRef } from 'react';

import Button from 'src/components/internal/button/button.component';
import ModalService from 'src/shared/services/modal/modal.service';
import ModalSvcContext from 'src/shared/services/modal/modal.context';
import APP_MODALS from 'src/static/enums/app.modals';
import { APP_EVENTS } from 'src/static/enums/app.events';
import { toast } from 'react-toastify';
import endpoints from '@modules/data-fetching/endpoints';
import ROUTES from 'src/static/router.data';

type LoginModalProps = {
	modalId: APP_MODALS;
	data: null;
};

export default function LoginModal({ modalId }: LoginModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	// 1. inject modalSvc
	const modalSvc = useContext<ModalService>(ModalSvcContext);

	function onLogin() {
		close();
	}

	function onInit() {
		document.addEventListener(APP_EVENTS.AUTH_LOGGED_IN, onLogin);
	}

	function onClose() {
		document.removeEventListener(APP_EVENTS.AUTH_LOGGED_IN, close);
	}

	useEffect(() => {
		onInit();

		return onClose;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const googleBtn = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!googleBtn.current) return;

		window.google.accounts.id.renderButton(
			googleBtn.current,
			{
				width: 250,
				height: 50,
			} // Customize the button as needed
		);
	}, [googleBtn]);

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

	async function twitterLogin() {
		try {
			// const res = await QueryApi.auth.twitterSignin();

			// // create new window to open twitter auth
			// const url = res;

			// open in the same tab
			window.location.href = endpoints.auth.twitterLink.replace(
				':callbackUrl',
				`${window.location.origin}${ROUTES.auth.twitter}`
			);

			// console.log(`${window.location.origin}${ROUTES.auth.twitter}`);
		} catch (error) {
			toast.error('Error logging in with Twitter');
		}

		// window.location.href = url;
	}

	return (
		// <!-- modal size manager -->
		<div
			className={` w-full max-w-[406px] max-h-full animate-fadeIn pointer-events-auto `}
			tabIndex={-1}
			ref={modalRef}
		>
			{/* modal box */}
			<div className="relative dark:bg-dk_blue-900 bg-white dark:bg-dark-800 rounded-lg shadow ">
				{/* modal header */}
				<div className="flex items-start justify-between px-8 py-6  rounded-t ">
					<h1 className="text-2xl font-bold text-black dark:text-white">
						Iniciar sesión
					</h1>
					<button
						type="button"
						className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
						data-modal-hide="defaultModal"
						onClick={close}
					>
						<span className="icon">
							<i className="far fa-times"></i>
						</span>

						<span className="sr-only">Close modal</span>
					</button>
				</div>

				{/* modal body */}
				<div className="px-8 pb-6 space-y-6">
					<p className="text-base leading-relaxed text-black dark:text-gray-400">
						Welcome to the PWR Community! Login/signup to discover projects and apply
						for grants.
					</p>

					{/* buttons con */}
					<div className="flex flex-col gap-[12px]">
						<div className="">
							{/* <Button className="blue w-full">
								{' '}
								<span>
									<img
										src="src/assets/pwr.svg"
										className="inline mr-[8px]"
										alt=""
									/>
								</span>
								Log in with PWR Wallet
							</Button> */}
						</div>

						{/* <div className="">
							<Button
								className=" w-full text-[14px] dark:text-white font-normal leading-[24px] border border-solid border-abrandc-dark-grey dark:border-abrandc-light-grey"
								ref={googleBtn}
								// className="g_id_signin"
								data-type="standard"
								data-shape="pill"
								data-theme="filled_blue"
								data-size="large"
							>
								<span>
									<img
										src="src/assets/google.svg"
										className="inline mr-[8px]"
										alt=""
									/>
								</span>
								Log in with Google
							</Button>
						</div> */}

						<div className="flex justify-center">
							<div
								className="g_id_signin"
								data-type="standard"
								data-shape="pill"
								data-theme="filled_blue"
								data-size="large"
								ref={googleBtn}
							></div>
						</div>

						<div className="div hidden">
							<Button
								className=" w-full text-[14px] dark:text-white font-normal leading-[24px] border border-solid border-abrandc-dark-grey dark:border-abrandc-light-grey"
								onClick={twitterLogin}
							>
								<span>
									<img
										src="src/assets/Frame.svg"
										className="inline mr-[8px] dark:hidden"
										alt=""
									/>
									<img
										src="src/assets/Framedark.svg"
										className=" mr-[8px] hidden dark:inline"
										alt=""
									/>
								</span>
								Log in with Twitter
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
