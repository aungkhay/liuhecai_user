<template>
    <v-app-bar :elevation="0" density="compact" style="background: linear-gradient(to right, #2fe62c, #4dfd46);">
        <v-app-bar-title class="font-weight-bold text-h5 text-red">{{ hostName }}</v-app-bar-title>
    </v-app-bar>
</template>

<script setup>
const hostName = window.location.hostname;
</script>