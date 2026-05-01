<template>
    <div class="border rounded-lg mb-3">
        <div class="text-center font-weight-bold text-h6 bg-primary rounded-t-lg">发什么开什么</div>
        <v-table>
            <tbody>
                <tr v-for="(result, index) in resultGuesses" :key="index">
                    <td class="text-h6 font-weight-bold">
                        <span>{{ `${result.batch_number.padStart(3, '0')}期:` }}</span>
                        <span class="text-red">【{{ result.zodiac_attr }}】</span>
                        <span v-if="result.result_match == 0">开:?</span>
                        <span v-if="result.result_match == 1">开:<span class="text-red">{{ `${String(result.result_number).padStart(2, '0')}${result.zodiac_name}` }}</span>对</span>
                        <span v-if="result.result_match == 2">开:<span class="text-red">{{ `${String(result.result_number).padStart(2, '0')}${result.zodiac_name}` }}</span>错</span>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<script setup>
import { GET_RESULT_GUESS } from '../../js/api';
import { onMounted, ref } from 'vue';

const resultGuesses = ref([]);

const getResultGuesses = async () => {
    const res = await GET_RESULT_GUESS();
    if (res.code === 1000) {
        resultGuesses.value = res.data;
    }
};

onMounted(() => {
    getResultGuesses();
});
</script>