<template>
    <div class="border rounded-lg mt-3 mb-3">
        <div class="text-center font-weight-bold text-h6 bg-primary rounded-t-lg">三期必中</div>
        <v-table>
            <tbody>
                <tr v-for="(item, index) in mustWin3Batch" :key="index">
                    <td>
                        <div class="text-h6 font-weight-bold pr-1">
                            <div>{{ item.batch_one }}期</div>
                            <div>{{ item.batch_two }}期</div>
                            <div>{{ item.batch_three }}期</div>
                        </div>
                    </td>
                    <td>
                         <div class="d-flex align-center justify-center text-h6 font-weight-bold h-100 zodiac-color">
                            <div>
                                <span :class="{ 'bg-amber': checkZodiacMatch(item, 1) }">{{ item.zodiac_one }}</span>
                                <span :class="{ 'bg-amber': checkZodiacMatch(item, 2) }">{{ item.zodiac_two }}</span>
                                <span :class="{ 'bg-amber': checkZodiacMatch(item, 3) }">{{ item.zodiac_three }}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="text-h6 font-weight-bold">
                            <div>开:<span class="text-red" :class="{ 'bg-amber': checkMatch(item, 1) }" v-if="item.result_number_one">{{ item.result_zodiac_one }}{{ item.result_number_one }}</span><span v-else>?</span></div>
                            <div>开:<span class="text-red" :class="{ 'bg-amber': checkMatch(item, 2) }" v-if="item.result_number_two">{{ item.result_zodiac_two }}{{ item.result_number_two }}</span><span v-else>?</span></div>
                            <div>开:<span class="text-red" :class="{ 'bg-amber': checkMatch(item, 3) }" v-if="item.result_number_three">{{ item.result_zodiac_three }}{{ item.result_number_three }}</span><span v-else>?</span></div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { MUST_WIN_3_BATCH } from '@/js/api';

const mustWin3Batch = ref([]);

const checkZodiacMatch = (item, index) => {
    const resultZodiacArr = [item.result_zodiac_one, item.result_zodiac_two, item.result_zodiac_three];
    const zodiacArr = [item.zodiac_one, item.zodiac_two, item.zodiac_three];

    if (index === 1) {
        return resultZodiacArr.includes(item.zodiac_one);
    } else if (index === 2) {
        return resultZodiacArr.includes(item.zodiac_two);
    } else if (index === 3) {
        return resultZodiacArr.includes(item.zodiac_three);
    }
    return false;
}

const checkMatch = (item, index) => {
    const resultZodiacArr = [item.result_zodiac_one, item.result_zodiac_two, item.result_zodiac_three];
    const zodiacArr = [item.zodiac_one, item.zodiac_two, item.zodiac_three];

    for (let i = 0; i < resultZodiacArr.length; i++) {
        if (zodiacArr[i].includes(resultZodiacArr[index - 1])) {
            return true;
        }
    }
    return false;
}

onMounted(async () => {
    const res = await MUST_WIN_3_BATCH();
    if (res.code === 1000) {
        mustWin3Batch.value = res.data;
    }
});
</script>

<style scoped>
.zodiac-color {
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    min-width: 100px;
}
</style>