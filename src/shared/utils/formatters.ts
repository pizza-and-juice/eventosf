import BigNumber from 'bignumber.js';
import { format } from 'date-fns';

export function numberWithCommas(num: number): string {
	const numInDecimal = (num / 1e9).toFixed(7); // Divide by 10^9 and format with 2 decimal places
	return numInDecimal.toLocaleString();
}

export function timeAgo(timestamp: number): string {
	const seconds = Math.floor((new Date().getTime() - timestamp * 1000) / 1000);

	const intervals = {
		year: { singular: 'year', plural: 'years', seconds: 31536000 },
		month: { singular: 'month', plural: 'months', seconds: 2592000 },
		week: { singular: 'week', plural: 'weeks', seconds: 604800 },
		day: { singular: 'day', plural: 'days', seconds: 86400 },
		hour: { singular: 'hour', plural: 'hours', seconds: 3600 },
		minute: { singular: 'min', plural: 'mins', seconds: 60 },
		second: { singular: 'sec', plural: 'secs', seconds: 1 },
	};

	for (const [, interval] of Object.entries(intervals)) {
		const intervalCount = Math.floor(seconds / interval.seconds);

		if (intervalCount >= 1) {
			const intervalText = intervalCount > 1 ? interval.plural : interval.singular;
			return `${intervalCount} ${intervalText} ago`;
		}
	}

	return 'just now';
}

export default function dateToText(date: string | number): string {
	const timestamp = typeof date === 'string' ? Date.parse(date) / 1000 : date;
	// -> MMM dd yyyy
	return format(new Date(timestamp * 1000), 'MMM dd yyyy');
}

export function shortenAddress(address: string, chars = 4): string {
	return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function BnToDec(value: string, decimals = 9, precision = 2) {
	const bn = new BigNumber(value).shiftedBy(-decimals);
	const float = bn.toFixed(precision);
	const r = BigNumber(float).toFixed();
	return r;
}

export function DecToBn(value: number | string, decimals = 9) {
	const bn = new BigNumber(value).shiftedBy(decimals);
	const bnStr = bn.toFixed();
	return bnStr;
}

export function scNotToDec(number: number, decimalPlaces: number) {
	const formattedNumber = number.toFixed(decimalPlaces);
	// Use a regular expression to remove trailing zeros
	const trimmedNumber = formattedNumber.replace(/\.?0+$/, '');
	return trimmedNumber;
}

export function shortenString(input: string, maxLength = 100, prefixL = 12) {
	if (input.length > maxLength) {
		const prefixLength = prefixL;
		const prefix = input.substring(0, prefixLength);
		const suffix = input.substring(input.length - 4);
		return `${prefix}...${suffix}`;
	} else return input;
}

export function shortenParagraph(input: any, maxLength = 100) {
	if (input.length > maxLength) {
		const prefix = input.substring(0, maxLength);
		return `${prefix}...`;
	} else return input;
}
export function reduceFileName(input: string) {
	const prefixLength = 12;
	const prefix = input.substring(0, prefixLength);
	const suffix = input.substring(input.length - 4);
	return `${prefix}...${suffix}`;
}
