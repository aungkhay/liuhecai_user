<template>
    <div class="border rounded-lg mt-3 mb-3">
        <div class="text-center font-weight-bold text-h6 bg-grey-lighten-3 rounded-t-lg">合数单双</div>
        <div>
            <v-table density="compact">
                <tbody>
                    <tr v-for="(oe, index) in oddEvens" :key="index">
                        <td style="min-width: 80px;">{{ oddEvenMap[index] }}</td>
                        <td>
                            <div class="d-flex">
                                <div v-for="(num, i) in oe" :key="i" :class="`bg-${num.color}`" class="mr-1">
                                    <span class="pa-1">{{ num.num }}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useZodiacStore } from '../../stores/zodiac';

const zodiacStore = useZodiacStore();
const oddEvens = computed(() => zodiacStore.getOddEvenNumbers);
const oddEvenMap = {
    'odd': '合数单',
    'even': '合数双'
};
</script>