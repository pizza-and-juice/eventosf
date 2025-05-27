import AppConfig from 'src/static/app.config';

// export function useTitle(title: string) {
// 	document.title = title;
// }

export default class DocumentTitleService {
	constructor() {}

	setTitle(title: string) {
		const prefix = import.meta.env.DEV || import.meta.env.VERCEL_ENV ? 'DEV |' : '';
		const newTitle = `${prefix} ${title} | ${AppConfig.name} `;
		document.title = newTitle;
	}
}
