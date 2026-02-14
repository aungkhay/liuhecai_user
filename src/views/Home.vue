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

        <v-carousel v-if="banners.length > 0" hide-delimiter-background :show-arrows="false" height="180" cycle hide-delimiters>
            <v-carousel-item v-for="(banner, index) in banners" :key="index"
                :src="filePath + banner.image"
                cover
            ></v-carousel-item>
        </v-carousel>

        <div class="pa-2">
            <div v-if="referenceLinks.length" class="border rounded-lg mb-3">
                <div class="text-center font-weight-bold text-h6 bg-primary rounded-t-lg">参考链接</div>
                <div class="my-1">
                    <div v-for="(refLink, index) in referenceLinks" :key="index" class="px-2 py-1">
                        <a :href="refLink.url" target="_blank">
                            <v-img :src="filePath + refLink.image" width="100%" height="60" cover class="rounded-lg"></v-img>
                        </a>
                    </div>
                </div>
            </div>

            <div class="border rounded-lg mb-3">
                <div class="text-center font-weight-bold text-h6 bg-primary rounded-t-lg">发什么开什么</div>
                <v-table>
                    <tbody>
                        <tr v-for="(result, index) in resultGuesses" :key="index">
                            <td class="text-h6 font-weight-bold">
                                <span>{{ `${result.batch_number.padStart(3, '0')}期:` }}</span>
                                <span class="text-red">【{{ result.zodiac_attr }}】</span>
                                <span v-if="result.result_match == 0">开:?</span>
                                <span v-if="result.result_match == 1">开:<span class="text-red">{{ `${String(result.result_number).padStart(2, '0')}${result.zodiac_name}` }}</span>准</span>
                                <span v-if="result.result_match == 2">开:<span class="text-red">{{ `${String(result.result_number).padStart(2, '0')}${result.zodiac_name}` }}</span>不准</span>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
            <div class="border rounded-lg mb-3">
                <div class="text-center font-weight-bold text-h6 bg-primary rounded-t-lg">给你一期内幕,也要懂得下注</div>
                <v-table>
                    <tbody>
                        <tr>
                            <td class="font-weight-bold">七消:<span class="text-red">{{ qixiao?.xiaos?.join('') }}</span></td>
                            <td class="font-weight-bold">7码:<span class="text-red">{{ qixiao?.numbers?.join('.') }}</span></td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">五消:<span class="text-red">{{ wuxiao?.xiaos?.join('') }}</span></td>
                            <td class="font-weight-bold">5码:<span class="text-red">{{ wuxiao?.numbers?.join('.') }}</span></td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">三肖:<span class="text-red">{{ sanxiao?.xiaos?.join('') }}</span></td>
                            <td class="font-weight-bold">3码:<span class="text-red">{{ sanxiao?.numbers?.join('.') }}</span></td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
            <div class="border rounded-lg mb-3">
                <div class="text-center font-weight-bold text-h6 bg-primary rounded-t-lg">他不准我哭【投资平特】</div>
                <v-table>
                    <tbody>
                        <tr v-for="(item, index) in touziPingTe" :key="index">
                            <td>
                                <div class="text-h6 font-weight-bold">
                                    {{ `${String(item.batch_start).padStart(3, '0')}-${String(item.batch_end).padStart(3, '0')}期:` }}
                                    <span class="text-red">【{{ item.zodiac_name }}{{ item.zodiac_name }}】</span>
                                    <span>开({{ item.open_count > 0 ? item.open_count : '?' }}期)</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
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
                                        <span v-if="item.match_color == item.color_one || item.match_color == item.color_two">准</span>
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
            
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
            <div class="border rounded-lg mt-3 mb-3">
                <div class="text-center font-weight-bold text-h6 bg-grey-lighten-3 rounded-t-lg">生肖属性</div>
                <div>
                    <v-table density="compact">
                        <tbody>
                            <tr v-for="(attribute, index) in attributes" :key="index">
                                <td style="min-width: 80px;" class="text-primary">{{ attribute.attribute_name }}</td>
                                <td>
                                    <div class="d-flex">
                                        <div v-for="(zoc, i) in attribute.zodiacs" :key="i">
                                            <span class="pa-1">{{ zoc }}</span>
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
import { GET_BANNERS, GET_LAST_RECORD, GET_RESULT_GUESS, GET_XIAO_MA, GET_TOUZI_PING_TE, GET_DOUBLE_COLOR, GET_REFERENCE_LINK } from '../js/api';
import { useZodiacStore } from '../stores/zodiac';
import router from '../routers';
import Appbar from '../components/Appbar.vue';
import { useGlobalStore } from '../stores/global';

const zodiacStore = useZodiacStore();
const globalStore = useGlobalStore();

const filePath = computed(() => globalStore.getFilePath);
const xZodiacs = computed(() => zodiacStore.getxZodiacs);
const currentYear = computed(() => zodiacStore.getCurrentYear);
const wuxing = computed(() => zodiacStore.getWuXingNumbers);
const colors = computed(() => zodiacStore.getColorNumbers);
const oddEvens = computed(() => zodiacStore.getOddEvenNumbers);
const attributes = computed(() => zodiacStore.getAttributes);
const recordType = ref([
    { label: '平台六合彩', value: 'platform' }, 
    { label: '澳门六合彩', value: 'aomen' }, 
    { label: '香港六合彩', value: 'hongkong' }
]);
const currentRecordType = ref(recordType.value[0].value);
const lastRecord = ref({});
const banners = ref([]);
const resultGuesses = ref([]);
const qixiao = ref({});
const wuxiao = ref({});
const sanxiao = ref({});
const touziPingTe = ref([]);
const doubleColor = ref([]);
const referenceLinks = ref([]);

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

const getBanners = async () => {
    const res = await GET_BANNERS();
    if (res.code === 1000) {
        banners.value = res.data;
    }
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

const getResultGuesses = async () => {
    const res = await GET_RESULT_GUESS();
    if (res.code === 1000) {
        resultGuesses.value = res.data.reverse();
    }
};

const getXiaoMa = async () => {
    const res = await GET_XIAO_MA();
    if (res.code === 1000) {
        const data = res.data;
        const qixiaoData = data.find(item => item.type === 'qi_xiao') || {};
        const wuxiaoData = data.find(item => item.type === 'wu_xiao') || {};    
        const sanxiaoData = data.find(item => item.type === 'san_xiao') || {};

        const splited7 = qixiaoData.val.split('|');
        if(splited7.length === 2) {
            qixiao.value = {
                xiaos: splited7[0].split(','),
                numbers: splited7[1].split(','),
            }
        }
        const splited5 = wuxiaoData.val.split('|');
        if(splited5.length === 2) {
            wuxiao.value = {
                xiaos: splited5[0].split(','),
                numbers: splited5[1].split(','),
            }
        }
        const splited3 = sanxiaoData.val.split('|');
        if(splited3.length === 2) {
            sanxiao.value = {
                xiaos: splited3[0].split(','),
                numbers: splited3[1].split(','),
            }
        }
    }
};

const getTouziPingTe = async () => {
    const res = await GET_TOUZI_PING_TE();
    if (res.code === 1000) {
        touziPingTe.value = res.data.reverse();
    }
};

const getDoubleColor = async () => {
    const res = await GET_DOUBLE_COLOR();
    if (res.code === 1000) {
        doubleColor.value = res.data;
    }
}

const getReferenceLinks = async () => {
    const res = await GET_REFERENCE_LINK();
    if (res.code === 1000) {
        referenceLinks.value = res.data;
    }
}

onMounted(async () => {
    zodiacStore.orderZodiac();
    getBanners();
    getLastRecord(currentRecordType.value);
    getResultGuesses();
    getXiaoMa();
    getTouziPingTe();
    getDoubleColor();
    getReferenceLinks();
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