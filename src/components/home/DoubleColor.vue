<template>
    <div class="border rounded-lg mb-3">
        <div class="text-center font-weight-bold text-h6 bg-primary rounded-t-lg">大神双波</div>
        <v-table>
            <tbody>
                <tr v-for="(item, index) in doubleColor" :key="index">
                    <td>
                        <div class="text-h6 font-weight-bold">
                            {{ `${String(item.batch_number).padStart(3, '0')}期:` }}
                            <span class="text-red">
                                【<span :class="{'bg-amber': item.color_one === item.match_color}">{{ colorsMap[item.color_one] }}波</span>+<span :class="{'bg-amber': item.color_two === item.match_color}">{{ colorsMap[item.color_two] }}波</span>】
                            </span>
                            <span>开:
                                <span v-if="item.result_number == 0">?</span>
                                <span v-else class="text-blue">{{ item.zodiac_name }}{{ String(item.result_number).padStart(2, '0') }}</span>
                                <span v-if="item.match_color == item.color_one || item.match_color == item.color_two">对</span>
                            </span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { GET_DOUBLE_COLOR } from '../../js/api';

const doubleColor = ref([]);
const colorsMap = {
    'red': '红',
    'blue': '蓝',
    'green': '绿'
};

const getDoubleColor = async () => {
    const res = await GET_DOUBLE_COLOR();
    if (res.code === 1000) {
        doubleColor.value = res.data;
    }
}

onMounted(() => {
    getDoubleColor();
});
</script>