<template>
    <div class="border rounded-lg mt-3">
        <div class="text-center font-weight-bold text-h6 bg-grey-lighten-3 rounded-t-lg">波色对照</div>
        <div>
            <v-table density="compact">
                <tbody>
                    <tr v-for="(color, index) in colors" :key="index">
                        <td style="width: 25px;" :class="`text-${index}`">{{ colorsMap[index] }}</td>
                        <td>
                            <div class="d-flex">
                                <div v-for="(num, i) in color" :key="i" :class="`bg-${index}`" class="mr-1">
                                    <span class="pa-1">{{ num }}</span>
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
const colors = computed(() => zodiacStore.getColorNumbers);
const colorsMap = {
    'red': '红',
    'blue': '蓝',
    'green': '绿'
};
</script>