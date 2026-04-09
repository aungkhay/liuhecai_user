<template>
    <v-app style="max-width: 500px; margin: 0 auto;">
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { useZodiacStore } from './stores/zodiac';
import { GET_SERVER_TIME, PLATFORM_LAST_BATCH_NUMBER } from './js/api';

const zodiacStore = useZodiacStore();

onMounted(() => {
    console.log('App mounted. Initializing zodiac store...');
    zodiacStore.setCurrentYear();
    GET_SERVER_TIME();
    PLATFORM_LAST_BATCH_NUMBER();
});
</script>