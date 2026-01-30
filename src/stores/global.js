import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
    state: () => ({
        filePath: import.meta.env.VITE_FILE_PATH || '',
    }),
    actions: {
       
    },
    getters: {
        getFilePath: (state) => state.filePath,
    }
});