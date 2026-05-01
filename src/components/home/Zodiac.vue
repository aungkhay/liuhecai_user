<template>
    <div class="border rounded-lg">
        <div class="text-center font-weight-bold text-h6 bg-grey-lighten-3 rounded-t-lg">{{ currentYear }}年（十二生肖号码对照）</div>
        <div class="pa-2">
            <v-row dense>
                <v-col cols="6" v-for="(zodiac, index) in xZodiacs[currentYear]" :key="index">
                    <div class="border rounded-lg pa-2 d-flex flex-column align-center">
                        <div class="font-weight-bold text-subtitle-1">{{ zodiac.name }}</div>
                        <v-img v-if="zodiac.key" :src="getImg(zodiac.key)" width="50"></v-img>
                        <div class="d-flex flex-wrap justify-center">
                            <div v-for="(num, i) in zodiac.numbers" :key="i" :class="`bg-${num.color}`" class="mr-1">
                                <span class="pa-1">{{ num.num }}</span>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useZodiacStore } from '../../stores/zodiac';

const zodiacStore = useZodiacStore();
const xZodiacs = computed(() => zodiacStore.getxZodiacs);
const currentYear = computed(() => zodiacStore.getCurrentYear);
const getImg = (name) => new URL(`../../assets/sx/sx_${name}.gif`, import.meta.url).href
</script>