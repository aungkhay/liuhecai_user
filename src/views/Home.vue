<template>
    <div>
        <Appbar />
        <div class="pb-1" style="background: linear-gradient(to right, #2fe62c, #4dfd46); position: sticky; top: var(--v-layout-top); z-index: 999;">
            <v-card elevation="0" class="bg-transparent">
                <v-row dense class="px-2">
                    <v-col cols="4" v-for="(type, index) in recordType" :key="index">
                        <v-btn block flat @click="getLastRecord(type.value)">
                            <span :class="currentRecordType == type.value ? 'font-weight-bold text-primary' : ''">{{ type.label }}</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
            <div v-if="Object.keys(lastRecord).length > 0" class="d-flex align-center justify-space-between bg-white my-2 mx-2 px-2 rounded-lg" @click="goHistory(currentRecordType)">
                <div class="mr-2">
                    <div class="font-weight-bold">{{ lastRecord.batch_number.padStart(3, '0') }}期</div>
                    <div class="text-red">开奖记录</div>
                </div>
                <div class="d-flex align-center my-3">
                    <div v-for="n in 6" :key="n" class="circle-wrapper mr-1">
                        <v-img :src="getCircleBallImg(lastRecord[`num${n}_desc`])" width="30" height="30" cover/>
                        <div class="circle-text">{{ lastRecord[`num${n}`].toString().padStart(2, '0') }}</div>
                    </div>
                    <div class="px-1"><v-icon>mdi-plus</v-icon></div>
                    <div class="circle-wrapper mr-1">
                        <v-img :src="getCircleBallImg(lastRecord.num7_desc)" width="30" height="30" cover/>
                        <div class="circle-text">{{ lastRecord.num7.toString().padStart(2, '0') }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pa-2 mt-2">
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
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { GET_LAST_RECORD } from '../js/api';
import { useZodiacStore } from '../stores/zodiac';
import router from '../routers';
import Appbar from '../components/Appbar.vue';

const zodiacStore = useZodiacStore();

const xZodiacs = computed(() => zodiacStore.getxZodiacs);
const currentYear = computed(() => zodiacStore.getCurrentYear);
const wuxing = computed(() => zodiacStore.getWuXingNumbers);
const colors = computed(() => zodiacStore.getColorNumbers);
const oddEvens = computed(() => zodiacStore.getOddEvenNumbers);
const recordType = ref([
    { label: '平台六合彩', value: 'platform' }, 
    { label: '澳门六合彩', value: 'aomen' }, 
    { label: '香港六合彩', value: 'hongkong' }
]);
const currentRecordType = ref(recordType.value[0].value);
const lastRecord = ref({});

const getImg = (name) =>new URL(`../assets/sx/sx_${name}.gif`, import.meta.url).href
const getCircleBallImg = (num_desc) => {
    const color = num_desc.split('/')[2]
    return new URL(`../assets/circle-ball/${color}-circle.png`, import.meta.url).href;
}

const wuxingMap = {
    'jin': '金',
    'mu': '木',
    'shui': '水',
    'huo': '火',
    'tu': '土'
};
const colorsMap = {
    'red': '红',
    'blue': '蓝',
    'green': '绿'
};
const oddEvenMap = {
    'odd': '合数单',
    'even': '合数双'
};

const goHistory = (type) => {
    router.push({ name: 'RecordHistory', query: { type } });
};

const getLastRecord = async (type) => {
    currentRecordType.value = type;
    const res = await GET_LAST_RECORD(type);
    if (res.code === 1000) {
        lastRecord.value = res.data;
    }
};

onMounted(async () => {
    zodiacStore.orderZodiac(currentYear.value);
    await getLastRecord(currentRecordType.value);
});

</script>

<style scoped>
.circle-wrapper {
    position: relative;
    width: 30px;
    height: 30px;
}

.circle-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    z-index: 2;
}
</style>