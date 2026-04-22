<template>
    <div class="border rounded-lg mt-3 mb-3">
        <div class="text-center font-weight-bold text-h6 bg-primary rounded-t-lg">十码必中特</div>
        <v-table>
            <tbody>
                <tr v-for="(item, index) in tenWinSpecial" :key="index">
                    <td>
                        <div class="text-h6 font-weight-bold d-flex justify-space-between">
                            <div>{{ item.batch_number }}期</div>
                            <div>开:
                                <span class="text-red" v-if="item.result_number">{{ item.result_zodiac }}{{ String(item.result_number).padStart(2, '0') }}</span>
                                <span v-else>?</span>
                                <span v-if="item.result_number && item.is_matched">准</span>
                            </div>
                        </div>
                        <div class="text-h6 text-success">【{{ item.numbers.replace(/-/g, ' ') }}】</div>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { TEN_WIN_SPECIAL } from '@/js/api';

const tenWinSpecial = ref([]);

onMounted(async () => {
    const res = await TEN_WIN_SPECIAL();
    if (res.code === 1000) {
        tenWinSpecial.value = res.data;
    }
});
</script>