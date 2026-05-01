<template>
    <div class="border rounded-lg mt-3">
        <div class="text-center font-weight-bold text-h6 bg-grey-lighten-3 rounded-t-lg">五行对照</div>
        <div>
            <v-table density="compact">
                <tbody>
                    <tr v-for="(number, index) in wuxing" :key="index">
                        <td style="width: 25px;">{{ wuxingMap[index] }}</td>
                        <td>
                            <div class="d-flex">
                                <div v-for="(num, i) in number" :key="i" :class="`bg-${num.color}`" class="mr-1">
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

const wuxing = computed(() => zodiacStore.getWuXingNumbers);
const wuxingMap = {
    'jin': '金',
    'mu': '木',
    'shui': '水',
    'huo': '火',
    'tu': '土'
};
</script>