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
		// Basic info
		title: z.string().nonempty('Campo requerido'),
		subtitle: z.string().nonempty('Campo requerido').max(100, 'Máximo 100 caracteres'),
		description: z.string().nonempty('Campo requerido').max(1000, 'Máximo 1000 caracteres'),
		image: z.instanceof(File, { message: 'Campo requerido' }),
		// .refine((file) => file instanceof File, { message: 'Campo requerido' }),

		// Location
		country: z.string().nonempty('Campo requerido'),
		city: z.string().nonempty('Campo requerido'),
		address: z.string().nonempty('Campo requerido'),
		start_date: z.string().nonempty('Campo requerido'),
		end_date: z.string().nonempty('Campo requerido'),

		// contact
		website: z.string().url('Debe ser una URL válida').optional(),

		// capacity
		attendees_capacity: z.union([z.string(), z.number()]).refine(
			(val) => {
				if (val === '') return true; // permitir campo vacío al inicio
				const num = typeof val === 'string' ? parseInt(val, 10) : val;
				return !isNaN(num) && num >= 10 && num <= 1000;
			},
			{
				message: 'El aforo debe ser entre 10 y 1000 asistentes',
			}
		),

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
