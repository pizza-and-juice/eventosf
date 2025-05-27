import axios from 'axios';
import Mock from 'axios-mock-adapter';

const api = import.meta.env.VITE_APP_API_URL;

export const axios_m = axios.create({
	baseURL: api,
});

export const axios_ = axios.create({
	baseURL: api,
});

export const mock = new Mock(axios_m, { delayResponse: 1000 });
