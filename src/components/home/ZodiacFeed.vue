<template>
    <div v-if="zodiacFeeds.length > 0" class="border rounded-lg mb-3">
        <div class="text-center font-weight-bold text-h6 bg-primary rounded-t-lg">
            <div>草菜肉肖</div>
            <div style="font-size: 1rem;"><span class="text-amber">吃草:牛羊马兔</span> <span class="text-purple">吃肉:虎蛇龙狗</span> <span class="text-error">吃菜:猪鼠鸡猴</span></div>
        </div>
        <v-table>
            <tbody>
                <tr v-for="(item, index) in zodiacFeeds" :key="index">
                    <td>
                        <div class="text-h6 font-weight-bold">
                            {{ `${String(item.batch_number).padStart(3, '0')}期:` }}
                            <span class="text-red">
                                【<span :class="{'bg-amber': zodiacFeedMap[feedMap[item.feed_one]].includes(item.result_zodiac_name)}">{{ feedMap[item.feed_one] }}</span>+<span :class="{'bg-amber': zodiacFeedMap[feedMap[item.feed_two]].includes(item.result_zodiac_name)}">{{ feedMap[item.feed_two] }}</span>】
                            </span>
                            <span>开:
                                <span v-if="item.result_number == 0">?</span>
                                <span v-else class="text-blue">{{ item.result_zodiac_name }}{{ String(item.result_number).padStart(2, '0') }}</span>
                                <span v-if="zodiacFeedMap[feedMap[item.feed_one]].includes(item.result_zodiac_name) || zodiacFeedMap[feedMap[item.feed_two]].includes(item.result_zodiac_name)">对</span>
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
import { ZODIAC_FEED } from '../../js/api';

const zodiacFeeds = ref([]); 
const feedMap = {
    1: '草',
    2: '肉',
    3: '菜'
}
const zodiacFeedMap = {
    '草': ['牛', '羊', '马', '兔'],
    '肉': ['虎', '蛇', '龙', '狗'],
    '菜': ['猪', '鼠', '鸡', '猴']
}

const getZodiacFeeds = async () => {
    const res = await ZODIAC_FEED();
    if (res.code === 1000) {
        zodiacFeeds.value = res.data;
    }
}

onMounted(() => {
    getZodiacFeeds();
});
</script>