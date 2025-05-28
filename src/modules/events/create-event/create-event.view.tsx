// third party
import { useContext } from 'react';
import { Controller } from 'react-hook-form';

// components
import Button from '@components/internal/button/button.component';
import ProjectCover from '@components/internal/project-cover/project-cover.component';

// context
import { CreateEventPageCtx, CreateEventPageCtxType } from './create-event.context';
import Sidebar from './components/create-event-sidebar.component';

export default function CreateNetworkView() {
	const { form, fn, refs, state } = useContext<CreateEventPageCtxType>(CreateEventPageCtx);

	const {
		register,
		control,
		watch,
		formState: { errors, isSubmitting },
	} = form;

	return (
		<div className="container-2 mx-auto mb-24">
			<div className="subcontainer">
				{/* Sidebar */}
				<div>
					<Sidebar />
				</div>

				{/* Main */}
				<main className="w-full lg:max-w-[700px] 2xl:max-w-[940px] 3xl:max-w-[1324px] space-y-10">
					{/* titles */}
					<section className="space-y-2">
						<h1 className="text-xl sm:text-4xl font-bold text-black dark:text-white">
							Crear nuevo evento
						</h1>
					</section>

					<form
						onSubmit={form.handleSubmit(fn.manualHandleSubmit)}
						className="space-y-10"
					>
						<fieldset
							className="space-y-4"
							id="event.essentials"
							ref={(el) => refs.sectionRefs.current.push(el)}
						>
							<div className="space-y-1">
								<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
									Detalles
								</h2>
								<p className="text-sm sm:text-base  text-agrey-700 dark:text-agrey-400">
									Complete los detalles de su evento. Asegúrese de que la
									información sea precisa y esté actualizada.
								</p>
							</div>

							<div className="h-2" />

							{/* network name */}
							<div className="field space-y-1">
								<label className="text-xs  text-black dark:text-white">
									Titulo del evento *
								</label>
								<div className="form-control">
									<input
										type="text"
										placeholder="Nombre del evento"
										className={`text-field ${errors.title && 'invalid'}`}
										{...register('title')}
									/>
									{errors.title && (
										<div className="text-ared-500 text-xs">
											{errors.title.message}
										</div>
									)}
								</div>
							</div>

							{/* currency name */}
							<div className="field space-y-1">
								<div className="flex justify-between">
									<label className="text-xs  text-black dark:text-white">
										Subtitlo del evento *
									</label>
									<h3>{watch('subtitle')?.length} / 200</h3>
								</div>
								<div className="form-control">
									<textarea
										className={`text-field w-full min-h-[100px] max-h-[200px] ${
											errors.subtitle && 'invalid'
										}`}
										{...register('subtitle')}
									/>
								</div>
								{errors.subtitle && (
									<div className="text-ared-500 text-xs">
										{errors.subtitle.message}
									</div>
								)}
							</div>

							{/* currency name */}
							<div className="field space-y-1">
								<div className="flex justify-between">
									<label className="text-xs  text-black dark:text-white">
										Descripción del evento *
									</label>
									<h3>{watch('description')?.length} / 500</h3>
								</div>
								<div className="form-control">
									<textarea
										className={`text-field w-full min-h-[100px] max-h-[200px] ${
											errors.description && 'invalid'
										}`}
										{...register('description')}
									/>
								</div>
								{errors.description && (
									<div className="text-ared-500 text-xs">
										{errors.description.message}
									</div>
								)}
							</div>

							{/* image  */}
							<div className="field space-y-1 ">
								<label
									htmlFor=""
									className="text-abrandc-dark-black text-[12px] font-normal dark:text-white"
								>
									Portada *
								</label>

								<Controller
									name="image"
									control={control}
									render={({ field: { onChange } }) => (
										<ProjectCover
											className={` ${errors.image && 'invalid'}`}
											onFileChange={(file) => onChange(file)}
											onFileDelete={() => onChange(null)} // Permite borrar el archivo
										/>
									)}
								/>

								{errors.image && (
									<div className="text-ared-500 text-xs">
										{errors.image.message}
									</div>
								)}
							</div>
						</fieldset>

						<fieldset
							className="space-y-4"
							id="event.location"
							ref={(el) => refs.sectionRefs.current.push(el)}
						>
							<div className="space-y-1">
								<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
									Lugar y fecha
								</h2>
								<p className="text-sm sm:text-base  text-agrey-700 dark:text-agrey-400">
									Seleccione el lugar y la fecha de su evento.
								</p>
							</div>

							<div className="h-2" />

							{/* country */}
							<div className="field space-y-1">
								<label className="text-xs text-black dark:text-white">Pais *</label>
								<div className="form-control">
									<input
										type="text"
										placeholder="Pais"
										className={`text-field ${errors.country && 'invalid'}`}
										{...register('country')}
									/>
								</div>

								{errors.country && (
									<div className="text-ared-500 text-xs">
										{errors.country.message}
									</div>
								)}
							</div>

							{/* city */}
							<div className="field space-y-1">
								<label className="text-xs text-black dark:text-white">
									Ciudad *
								</label>
								<div className="form-control">
									<input
										type="text"
										placeholder="Ciudad"
										className={`text-field ${errors.city && 'invalid'}`}
										{...register('city')}
									/>
								</div>

								{errors.city && (
									<div className="text-ared-500 text-xs">
										{errors.city.message}
									</div>
								)}
							</div>

							{/* address */}
							<div className="field space-y-1">
								<label className="text-xs text-black dark:text-white">
									dirección *
								</label>
								<div className="form-control">
									<input
										type="text"
										placeholder="Nombre del evento"
										className={`text-field ${errors.address && 'invalid'}`}
										{...register('address')}
									/>
								</div>

								{errors.address && (
									<div className="text-ared-500 text-xs">
										{errors.address.message}
									</div>
								)}
							</div>

							{/* date range */}
							<div className="grid grid-cols-2 gap-x-4">
								<div className="field space-y-1">
									<label className="text-xs text-black dark:text-white">
										Fecha de inicio *
									</label>
									<div className="form-control">
										<input
											type="date"
											className={`text-field ${
												errors.start_date && 'invalid'
											}`}
											{...register('start_date')}
										/>
									</div>

									{errors.start_date && (
										<div className="text-ared-500 text-xs">
											{errors.start_date.message}
										</div>
									)}
								</div>

								<div className="field space-y-1">
									<label className="text-xs text-black dark:text-white">
										Fecha de finalización *
									</label>
									<div className="form-control">
										<input
											type="date"
											className={`text-field ${errors.end_date && 'invalid'}`}
											{...register('end_date')}
										/>
									</div>
									{errors.end_date && (
										<div className="text-ared-500 text-xs">
											{errors.end_date.message}
										</div>
									)}
								</div>
							</div>
						</fieldset>

						<fieldset
							className="space-y-4"
							id="event.contact"
							ref={(el) => refs.sectionRefs.current.push(el)}
						>
							<div className="space-y-1">
								<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
									Contacto
								</h2>
								<p className="text-sm sm:text-base  text-agrey-700 dark:text-agrey-400">
									Proporcione información de contacto para que los asistentes
									puedan comunicarse con usted.
								</p>
							</div>

							<div className="h-2" />

							{/* website */}
							<div className="field space-y-1">
								<label className="text-xs text-black dark:text-white">
									Sitio web *
								</label>
								<div className="form-control">
									<input
										type="text"
										placeholder="Pais"
										className={`text-field ${errors.website && 'invalid'}`}
										{...register('website')}
									/>
								</div>

								{errors.website && (
									<div className="text-ared-500 text-xs">
										{errors.website.message}
									</div>
								)}
							</div>
						</fieldset>

						<fieldset
							className="space-y-4"
							id="event.attendees"
							ref={(el) => refs.sectionRefs.current.push(el)}
						>
							<div className="space-y-1">
								<h2 className="font-bold text-base sm:text-2xl text-black dark:text-white">
									Participantes
								</h2>
								<p className="text-sm sm:text-base  text-agrey-700 dark:text-agrey-400">
									Aforo máximo de asistentes al evento.
								</p>
							</div>

							{/* number of attendes */}
							<div className="field space-y-1">
								<label className="text-xs text-black dark:text-white">
									(10 - 1000)
								</label>
								<div className="form-control">
									<input
										type="number"
										className={`text-field ${
											errors.attendees_capacity && 'invalid'
										}`}
										{...register('attendees_capacity', {
											valueAsNumber: true,
										})}
									/>

									{errors.attendees_capacity && (
										<div className="text-ared-500 text-xs">
											{errors.attendees_capacity.message}
										</div>
									)}
								</div>
							</div>
						</fieldset>

						{state.globalError && (
							<div className="py-4">
								<div className="text-ared-500 text-xs">{state.globalError}</div>
							</div>
						)}

						{/* send */}
						<section className="space-y-6" id="grant.apply.submit">
							<div>
								<label className="flex items-center gap-x-2">
									<input
										type="checkbox"
										className="checkbox"
										// onChange={() => checked.value.dispatch(!checked.value)}
										{...register('accept_terms')}
									/>
									<span className="text-sm text-agrey-700">
										Al lanzar este evento, acepto los terminos y politicas de
										privacidad de Mis Eventos.
									</span>
								</label>
							</div>

							<div>
								<Button
									disabled={watch('accept_terms') === false}
									className={`blue ${isSubmitting && 'loading'}`}
									type="submit"
								>
									Crear
								</Button>
							</div>
						</section>
					</form>
				</main>
			</div>
		</div>
	);
}
