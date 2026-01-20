import API from './axios';
import { useZodiacStore } from '../stores/zodiac';

const prefix = '/api';

export const getZodiacNumbers = async () => {
    const zodiacStore = useZodiacStore();
    const res = await API.get(`${prefix}/zodiac/numbers`);
    if (res.code == 1000) {
        zodiacStore.numbers = res.data;
    }
}

export const getZodiacList = async () => {
    const zodiacStore = useZodiacStore();
    const res = await API.get(`${prefix}/zodiac/list`);
    if (res.code == 1000) {
        zodiacStore.currentYear = res.data.current_year;
        zodiacStore.zodiacs = res.data.zodiacs;
    }
}

export const GET_LAST_RECORD = async (lottery_type = 'aomen') => {
    return await API.get(`${prefix}/lottery-record/last`, {
        params: { lottery_type }
    });
}

export const GET_LOTTERY_RECORD_HISTORY = async (lottery_type = 'aomen', page = 1, perPage = 10, year) => {
    return await API.get(`${prefix}/lottery-record/history`, {
        params: { lottery_type, page, perPage, year }
    });
}