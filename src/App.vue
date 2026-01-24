<template>
    <v-app style="max-width: 500px; margin: 0 auto;">
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { GET_CURRENT_YEAR } from './js/api';

onMounted(() => {
    GET_CURRENT_YEAR(); 
});
</script>