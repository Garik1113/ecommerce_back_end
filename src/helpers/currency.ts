import { AxiosResponse } from 'axios';

const axios = require('axios');
const config = require('config');

export const currencyConverter = async () => {
    const url = config.get("currency").converterUrl;
    const response: AxiosResponse = await axios.post(url, {
        headers: {
            'User-Agent': 'CURRENCY CONVERTER API Client/0.0.1',
            'Content-Type': 'application/json'
        }
    })
}