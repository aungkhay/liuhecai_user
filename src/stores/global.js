import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
    state: () => ({
        filePath: 'http://127.0.0.1:2590'
    }),
    actions: {
       
    },
    getters: {
        getFilePath: (state) => state.filePath,
    }
});