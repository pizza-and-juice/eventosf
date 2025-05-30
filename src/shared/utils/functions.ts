export async function copyToClipboard(text: string) {
	await navigator.clipboard.writeText(text);
}

export function isAddress(text: string) {
	return text.length === 42 && text.startsWith('0x');
}

export function isHash(text: string) {
	return text.length === 66 && text.startsWith('0x');
}

export function isLinkedInURL(url: string) {
	return url.includes('linkedin.com');
}

export function useDefaultUserImg(e: React.SyntheticEvent<HTMLImageElement, Event>) {
	const element = e.target as HTMLImageElement;
	element.src = '/media/default/user.png';
}
