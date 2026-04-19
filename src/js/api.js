import API from './axios';
import { useZodiacStore } from '../stores/zodiac';
import { useGlobalStore } from '../stores/global';

const prefix = '/api';

// export const GET_CURRENT_YEAR = async () => {
//     const res = await API.get(`${prefix}/current-year`);
//     if (res.code === 1000) {
//         const zodiacStore = useZodiacStore();
//         zodiacStore.setCurrentYear(res.data.year);
//     }
// }

export const GET_SERVER_TIME = async () => {
    const res = await API.get(`${prefix}/server-time`);
    if (res.code === 1000) {
        const globalStore = useGlobalStore();
        globalStore.setServerTime(res.data.server_time);
    }
}

export const GET_BANNERS = async () => {
    return await API.get(`${prefix}/banners`);
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

export const GET_RESULT_GUESS = async () => {
    return await API.get(`${prefix}/result-guess`);
}

export const GET_XIAO_MA = async () => {
    return await API.get(`${prefix}/get-xiao-ma`);
}

export const GET_TOUZI_PING_TE = async () => {
    return await API.get(`${prefix}/tou-zi-ping-te`);
}

export const GET_DOUBLE_COLOR = async () => {
    return await API.get(`${prefix}/double-color`);
}

export const GET_REFERENCE_LINK = async () => {
    return await API.get(`${prefix}/reference-links`);
}

export const PLATFORM_LAST_BATCH_NUMBER = async () => {
    const res = await API.get(`${prefix}/platform-next-batch-number`);
    if (res.code === 1000) {
        const globalStore = useGlobalStore();
        globalStore.setPlatformNextBatchNumber(res.data.next_batch_number);
    }
}

export const REFERENCE_IMAGES = async () => {
    return await API.get(`${prefix}/reference-images`);
}