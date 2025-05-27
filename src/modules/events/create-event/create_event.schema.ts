import { EventStatus } from '@shared/enums/networks-enum';
import { z } from 'zod';

function isAtLeastXDaysInFuture(date: Date, days: number = 3): boolean {
	const threeDaysInMs = days * 24 * 60 * 60 * 1000;
	const now = new Date();
	const targetTime = now.getTime() + threeDaysInMs;

	return date.getTime() >= targetTime;
}

function isFutureDate(date: Date): boolean {
	const now = new Date();
	return date > now;
}

export const create_event_schema = z
	.object({
		name: z.string().nonempty('Campo requerido'),
		description: z.string().nonempty('Campo requerido').max(200, 'Máximo 200 caracteres'),
		image: z
			.instanceof(File)
			.nullable()
			.refine((file) => file instanceof File, { message: 'Campo requerido' }),

		address: z.string().nonempty('Campo requerido'),
		start_date: z.string().nonempty('Campo requerido'),
		end_date: z.string().nonempty('Campo requerido'),

		number_of_attendees: z.number().min(50, 'Minimo 50').max(1000, 'Maximo 1000'),

		status: z.string().refine((val) => {
			return Object.values(EventStatus).includes(val as EventStatus);
		}, 'Campo requerido'),

		accept_terms: z.boolean().refine((val) => val === true, {
			message: 'Debe aceptar los términos y condiciones',
		}),
	})
	.superRefine((data, ctx) => {
		const { start_date, end_date } = data;

		const date1 = new Date(start_date);
		const date2 = new Date(end_date);

		if (!isFutureDate(date1)) {
			ctx.addIssue({
				code: 'custom',
				path: ['start_date'],
				message: 'La fecha de inicio debe ser una fecha futura',
			});
		}

		if (!isAtLeastXDaysInFuture(date1)) {
			ctx.addIssue({
				code: 'custom',
				path: ['start_date'],
				message: 'El evento debe ser al menos con tres dias de antelación',
			});
		}

		if (date1.getTime() > date2.getTime()) {
			ctx.addIssue({
				code: 'custom',
				path: ['start_date'],
				message: 'La fecha de inicio no puede ser posterior a la fecha de finalización',
			});
		}
	});

export type CreateEventForm = z.infer<typeof create_event_schema>;
