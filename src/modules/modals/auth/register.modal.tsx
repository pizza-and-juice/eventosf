// 3rd party
import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// components
import Button from '@components/internal/button/button.component';

// shared
import ModalSvcContext from '@shared/services/modal/modal.context';
import AuthSvcContext from '@shared/services/auth/auth.context';

// static
import APP_MODALS from '@static/enums/app.modals';
import ROUTES from '@static/router.data';

type ModalProps = {
	modalId: APP_MODALS;
	data: null;
};

const schema = z.object({
	email: z.string().nonempty('Campo requerido').email('email incorrecto'),
	password: z.string().nonempty('Campo requerido'),
	firstName: z.string().nonempty('Campo requerido'),
	lastName: z.string().nonempty('Campo requerido'),
});

export default function RegisterModal({ modalId }: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	const authSvc = useContext(AuthSvcContext);
	const navigate = useNavigate();

	// 1. inject modalSvc
	const modalSvc = useContext(ModalSvcContext);

	// 3. call the modal hook, it will return this object {show: boolean, closeModal: fn}
	function close(): Promise<void> {
		return new Promise((resolve) => {
			const modalElmt = modalRef.current;
			if (!modalElmt) {
				resolve();
				return;
			}

			modalElmt.classList.add('animate-fadeOut');

			function handleAnimationEnd(e: AnimationEvent) {
				if (!modalElmt) return;
				if (e.animationName !== 'fadeOut') return;

				modalElmt.classList.remove('animate-fadeOut');
				modalElmt.removeEventListener('animationend', handleAnimationEnd);

				modalSvc.closeModal(modalId);

				resolve();
			}

			modalElmt.addEventListener('animationend', handleAnimationEnd);
		});
	}

	// #region form
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = form;
	// #endregion

	// #region fn
	const [passwordVisible, setPasswordVisible] = useState(false);
	function togglePasswordVisibility() {
		setPasswordVisible(!passwordVisible);
	}

	const [globalError, setGlobalError] = useState<string | null>(null);
	async function registerUser() {
		const values = form.getValues();
		setGlobalError(null);

		try {
			await authSvc.register({
				email: values.email,
				password: values.password,
				first_name: values.firstName,
				last_name: values.lastName,
			});
			close();
			navigate(ROUTES.root);
		} catch (error: any) {
			if (error?.response?.data?.detail?.code === '409__AUTH__USER_EXISTS') {
				setGlobalError('Ya existe una cuenta con este email');
				return;
			} else {
				setGlobalError(error.message);
			}
		}
	}

	async function openLoginModal() {
		await close();
		setTimeout(() => {
			modalSvc.open(APP_MODALS.LOGIN_MODAL, null);
		}, 10);
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
						Crear cuenta
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
					<div className="flex justify-center">
						<div className="w-[60%] ">
							<form
								className="w-full space-y-6"
								onSubmit={handleSubmit(registerUser)}
							>
								<div className="space-y-5">
									<div className="field">
										<label className="text-sm text-agrey-700">Nombre *</label>
										<div className="form-control">
											<input
												type="text"
												className={`text-field ${
													errors.firstName && 'invalid'
												}`}
												placeholder=" "
												{...register('firstName')}
											/>
										</div>
										{errors.firstName && (
											<div className="text-red-500 text-sm ">
												{errors.firstName.message}
											</div>
										)}
									</div>

									<div className="field">
										<label className="text-sm text-agrey-700">Apellido *</label>
										<div className="form-control">
											<input
												type="text"
												className={`text-field ${
													errors.lastName && 'invalid'
												}`}
												placeholder=" "
												{...register('lastName')}
											/>
										</div>
										{errors.lastName && (
											<div className="text-red-500 text-sm ">
												{errors.lastName.message}
											</div>
										)}
									</div>

									<div className="field">
										<label className="text-sm text-agrey-700">Email *</label>
										<div className="form-control">
											<input
												type="text"
												className={`text-field ${
													errors.email && 'invalid'
												}`}
												placeholder=" "
												{...register('email')}
											/>
										</div>
										{errors.email && (
											<div className="text-red-500 text-sm ">
												{errors.email.message}
											</div>
										)}
									</div>

									<div className="field">
										<label className="text-sm text-agrey-700">
											Contraseña
											<span className="text-pink-600">*</span>
										</label>
										<div className="form-control">
											<input
												type={passwordVisible ? 'text' : 'password'}
												className={`text-field ${
													errors.password && 'invalid'
												}`}
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
											<div className="text-red-500 text-sm ">
												{errors.password.message}
											</div>
										)}
									</div>
								</div>

								{globalError && (
									<div className="text-red-500 text-sm mb-4">{globalError}</div>
								)}

								<Button
									type="submit"
									className={`blue w-full rounded-md ${
										isSubmitting && 'loading'
									}`}
								>
									Crear cuenta
								</Button>
							</form>
						</div>
					</div>

					<br />

					<div className="text-center ">
						Ya tienes una cuenta?{' '}
						<button onClick={openLoginModal}>
							<span className="underline" data-testid="register-button">
								Iniciar sesión
							</span>
						</button>
						.
					</div>
				</section>
			</div>
		</div>
	);
}
