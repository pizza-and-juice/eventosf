// 3rd party
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

// components
import Button from '@components/internal/button/button.component';

// shared
import ModalSvcContext from '@shared/services/modal/modal.context';

// static
import APP_MODALS from '@static/enums/app.modals';

type ModalProps = {
	modalId: APP_MODALS;
	data: null;
};

export default function ExampleModal({ modalId }: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	// 1. inject modalSvc
	const modalSvc = useContext(ModalSvcContext);

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

	// 4. handle modal logic
	function onAcept() {
		window.alert('Welcome to hell 😈');
	}

	// #region fn
	function togglePasswordVisibility() {
		setPasswordVisible(!passwordVisible);
	}

	// #endregion

	return (
		<div
			id="modal-size-manager"
			className={` w-full max-w-2xl max-h-full animate-fadeIn pointer-events-auto `}
			tabIndex={-1}
			ref={modalRef}
		>
			<div
				id="modal-box"
				className="relative dark:bg-dark-800 bg-light-800 rounded-lg shadow "
			>
				<section
					id="modal-header"
					className="flex items-start justify-between p-4 border-b rounded-t"
				>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
						Iniciar sesión
					</h3>
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
				</section>

				<section id="modal-body" className="p-6 space-y-6">
					<form className="w-full space-y-6" onSubmit={handleSubmit(login)}>
						<div className="space-y-5">
							<div className="field">
								<label className="text-sm text-agrey-700">
									Email
									<span className="text-pink-600">*</span>
								</label>
								<div className="form-control">
									<input
										type="text"
										className={`text-field ${errors.email && 'invalid'}`}
										placeholder=" "
										{...register('email')}
									/>
								</div>

								{/* s{errors.email && <ErrorMessage error={errors.email.message} />} */}
							</div>

							<div className="field">
								<label className="text-sm text-agrey-700">
									Contraseña
									<span className="text-pink-600">*</span>
								</label>
								<div className="form-control">
									<input
										type={passwordVisible ? 'text' : 'password'}
										className={`text-field ${errors.password && 'invalid'}`}
										placeholder=" "
										{...register('password')}
									/>

									<button
										className="absolute h-11 bottom-0 right-0 flex items-center pr-4 text-agrey-700"
										tabIndex={-1}
										onClick={togglePasswordVisibility}
										type="button"
									>
										<i
											className={`
												fa-regular fa-eye${passwordVisible ? '-slash' : ''}
											`}
										/>
									</button>
								</div>

								{errors.password && (
									<ErrorMessage error={errors.password.message} />
								)}
							</div>
						</div>

						{globalError && (
							<ErrorMessage error={globalError} data-testid="login-error-message" />
						)}

						<Button
							type="submit"
							className={`coquette w-full rounded-md ${isSubmitting && 'loading'}`}
						>
							Iniciar sesión
						</Button>
					</form>

					<br />

					<div className="text-center ">
						Aun no tienes una cuenta?{' '}
						<LocalizedClientLink href="/register">
							<span className="underline" data-testid="register-button">
								Registrate
							</span>
						</LocalizedClientLink>
						.
					</div>
				</section>

				<section
					id="modal-footer"
					className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
				>
					<Button className="blue dark:text-white" type="button" onClick={onAcept}>
						I accept
					</Button>
					<Button className="secondary " type="button" onClick={close}>
						Decline
					</Button>
				</section>
			</div>
		</div>
	);
}
