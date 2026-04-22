import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
    state: () => ({
        // filePath: import.meta.env.VITE_FILE_PATH || '',
        // domain name
        filePath: location.origin,
        serverTime: null,
        platformNextBatchNumber: null,
    }),
    actions: {
        setServerTime(time) {
            this.serverTime = time;
            setInterval(() => {
                time += 1000;
                this.serverTime = time;
            }, 1000);
        },
        setPlatformNextBatchNumber(batchNumber) {
            this.platformNextBatchNumber = batchNumber;
        }
    },
    getters: {
        getFilePath: (state) => state.filePath,
    }
});