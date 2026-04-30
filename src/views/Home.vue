<template>
    <div>
        <Appbar />
        <div class="pb-1" style="background: linear-gradient(to right, #2fe62c, #4dfd46); position: sticky; top: var(--v-layout-top); z-index: 999;">
            <v-card elevation="0" class="bg-transparent">
                <v-row dense class="px-2">
                    <v-col cols="4" v-for="(type, index) in recordType" :key="index">
                        <v-btn block size="large" flat @click="getLastRecord(type.value)">
                            <span :class="currentRecordType == type.value ? 'font-weight-bold text-primary' : ''">{{ type.label }}</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
            <div v-if="lastRecordArr.length > 0" class="bg-white my-2 mx-2 px-2 rounded-lg">
                <div class="d-flex align-center justify-space-between pt-1">
                    <div class="font-weight-bold">{{ lastRecord?.batch_number }}期</div>
                    <div class="text-red text-caption">{{ displayCountDown && currentRecordType == 'platform' ? countDown : '开奖记录' }}</div>
                </div>
                <div  class="d-flex align-center justify-space-between" @click="displayCountDown ? {} : goHistory(currentRecordType)">
                    <!-- <div class="mr-2" style="min-width: 60px;">
                        <div class="font-weight-bold">{{ lastRecord?.batch_number }}期</div>
                        <div class="text-red text-caption">{{ displayCountDown && currentRecordType == 'platform' ? countDown : '开奖记录' }}</div>
                    </div> -->
                    <div v-if="gettingLastRecord" style="min-height: 69.5px;" class="d-flex align-center justify-center">
                        <v-progress-circular indeterminate size="24" width="2" color="primary"></v-progress-circular>
                    </div>
                    <div v-else class="d-flex align-center justify-center my-1 overflow-x-auto w-100">
                        <div v-for="n in (lastRecordArr.length === 7 ? 6 : lastRecordArr.length)" :key="n" class="mr-1">
                            <div class="circle-wrapper">
                                <v-img :src="getCircleBallImg(lastRecordArr[n - 1]?.desc)" width="40" height="40" cover/>
                                <div class="circle-text text-caption" :class="{ 'text-grey': displayCountDown && currentRecordType == 'platform' }">{{ lastRecordArr[n - 1]?.num }}</div>
                            </div>
                            <div class="text-center">{{ getZodiacName(lastRecordArr[n - 1]?.desc) }}</div>
                        </div>
                        <div v-if="lastRecordArr.length === 7"><v-icon size="small">mdi-plus</v-icon></div>
                        <div v-if="lastRecordArr.length === 7">
                            <div class="circle-wrapper mr-1">
                                <v-img :src="getCircleBallImg(lastRecordArr[6]?.desc)" width="40" height="40" cover/>
                                <div class="circle-text text-caption" :class="{ 'text-grey': displayCountDown && currentRecordType == 'platform' }">{{ lastRecordArr[6]?.num }}</div>
                            </div>
                            <div class="text-center" >{{ getZodiacName(lastRecordArr[6]?.desc) }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="currentRecordType == 'platform' && displayOpenTimeString" class="text-red font-weight-semibold" style="font-size: 15px;">{{ openTimeString }}</div>
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
                                <span v-if="result.result_match == 1">开:<span class="text-red">{{ `${String(result.result_number).padStart(2, '0')}${result.zodiac_name}` }}</span>对</span>
                                <span v-if="result.result_match == 2">开:<span class="text-red">{{ `${String(result.result_number).padStart(2, '0')}${result.zodiac_name}` }}</span>错</span>
                            </td>
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
                                    <span v-if="item.is_finished">开({{ item.open_count }}期)</span>
                                    <span v-else>开({{ item.open_count > 0 ? item.open_count : '?' }}期)</span>
                                </div>
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
                            <td class="font-weight-bold">七肖:<span class="text-red">{{ qixiao?.xiaos?.join('') }}</span></td>
                            <td class="font-weight-bold">7码:<span class="text-red">{{ qixiao?.numbers?.join('.') }}</span></td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">五肖:<span class="text-red">{{ wuxiao?.xiaos?.join('') }}</span></td>
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

            <MustWin3Batch />
            <TenWinSpecial />

            <div v-if="referenceImages.length > 0" class="mb-3">
                <v-row dense>
                    <v-col cols="6" v-for="(refImg, index) in referenceImages" :key="index">
                        <div class="border rounded-lg pa-2" @click="previewImageSrc = filePath + refImg.image_url; previewImageDialog = true" style="cursor: pointer;">
                            <v-img :src="filePath + refImg.image_url" height="100%" width="100%" cover></v-img>
                            <div v-if="refImg.name" class="text-center font-weight-bold mt-2">{{ refImg.name }}</div>
                        </div>
                    </v-col>
                </v-row>
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

        <v-dialog v-model="previewImageDialog" transition="dialog-bottom-transition" fullscreen>
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon @click="previewImageDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>图片预览</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="d-flex align-center justify-center pa-0" style="height: 100%;">
                    <v-img :src="previewImageSrc" max-width="100%" max-height="100%" contain></v-img>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { GET_BANNERS, GET_LAST_RECORD, GET_RESULT_GUESS, GET_XIAO_MA, GET_TOUZI_PING_TE, GET_DOUBLE_COLOR, GET_REFERENCE_LINK, REFERENCE_IMAGES, ZODIAC_FEED } from '../js/api';
import { useZodiacStore } from '../stores/zodiac';
import router from '../routers';
import Appbar from '../components/Appbar.vue';
import { useGlobalStore } from '../stores/global';
import MustWin3Batch from '../components/home/MustWin3Batch.vue';
import TenWinSpecial from '../components/home/TenWinSpecial.vue';

const zodiacStore = useZodiacStore();
const globalStore = useGlobalStore();

const filePath = computed(() => globalStore.getFilePath);
const serverTime = computed(() => globalStore.serverTime);
const platformNextBatchNumber = computed(() => globalStore.platformNextBatchNumber);
const xZodiacs = computed(() => zodiacStore.getxZodiacs);
const currentYear = computed(() => zodiacStore.getCurrentYear);
const wuxing = computed(() => zodiacStore.getWuXingNumbers);
const colors = computed(() => zodiacStore.getColorNumbers);
const oddEvens = computed(() => zodiacStore.getOddEvenNumbers);
const attributes = computed(() => zodiacStore.getAttributes);
const recordType = ref([
    { label: '澳博彩', value: 'platform' }, 
    { label: '澳门六合彩', value: 'aomen' }, 
    { label: '香港六合彩', value: 'hongkong' }
]);
const currentRecordType = ref(recordType.value[0].value);
const gettingLastRecord = ref(false);
const lastRecord = ref({});
const lastRecordArr = ref([]);
const banners = ref([]);
const resultGuesses = ref([]);
const qixiao = ref({});
const wuxiao = ref({});
const sanxiao = ref({});
const touziPingTe = ref([]);
const doubleColor = ref([]);
const referenceLinks = ref([]);
const referenceImages = ref([]);  
const zodiacFeeds = ref([]); 
const displayCountDown = ref(false);
const countDown = ref('');
const countdownFinished = ref(false);
const openHour = ref(20);
const openMinute = ref(32);
const openTimeString = ref('');
const displayOpenTimeString = ref(false);
const previewImageDialog = ref(false);
const previewImageSrc = ref('');

const getImg = (name) => new URL(`../assets/sx/sx_${name}.gif`, import.meta.url).href
const getCircleBallImg = (num_desc) => {
    if (!num_desc) {
        return new URL(`../assets/circle-ball/grey-circle.png`, import.meta.url).href;
    }
    const color = num_desc.split('/')[2]
    return new URL(`../assets/circle-ball/${color}-circle.png`, import.meta.url).href;
}
const getZodiacName = (num_desc) => {
    if (!num_desc) return '-';
    const desc = num_desc?.split('/');
    return desc[0] + '/' + desc[1];
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
    gettingLastRecord.value = true;
    currentRecordType.value = type;
    const res = await GET_LAST_RECORD(type);
    if (res.code === 1000) {
        lastRecord.value = res.data;
        formatOpenTimeString();
    }
    setTimeout(() => {
        gettingLastRecord.value = false;
    }, 500);
};

const prepareNextRecordDisplay = () => {
    const serverDate = new Date(serverTime.value);
    const serverHour = serverDate.getHours();
    const serverMinute = serverDate.getMinutes();

    if (
        serverHour === openHour.value &&
        serverMinute >= 0 &&
        serverMinute <= openMinute.value
    ) {
        displayCountDown.value = true;

        const countDownTarget = new Date(
            new Date(serverTime.value).setHours(
                openHour.value,
                openMinute.value,
                0,
                0
            )
        ).getTime();

        const now = serverDate.getTime();
        const distance = countDownTarget - now;

        if (distance <= 0) {
            // ✅ prevent multiple calls
            if (!countdownFinished.value) {
                console.log('Countdown finished. Fetching last record...');
                countdownFinished.value = true;

                setTimeout(() => {
                    displayCountDown.value = false;
                    getLastRecord(currentRecordType.value);
                    location.reload(); // reload to reset any potential state issues
                }, 15000);
            }
            return;
        } else {
            // ✅ reset flag if still counting
            countdownFinished.value = false;

            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countDown.value = `${String(minutes).padStart(2, '0')}:${String(
                seconds
            ).padStart(2, '0')}`;
        }
    } else {
        displayCountDown.value = false;
        countdownFinished.value = false; // reset when outside window
    }
};

watch(
    () => serverTime.value,
    (newVal) => {
        if (newVal) {
            const serverDate = new Date(newVal);
            const serverHour = serverDate.getHours();
            const serverMinute = serverDate.getMinutes();
            const serverSecond = serverDate.getSeconds();
            // reload when server time is 21:15:15
            if (serverHour == openHour.value && serverMinute == openMinute.value && serverSecond == 15) {
                location.reload();
            }
        
            if (displayCountDown.value) {
                prepareNextRecordDisplay();
            } else {
                // Check if we should start the countdown when server time updates
                const serverDate = new Date(newVal);
                const serverHour = serverDate.getHours();
                const serverMinute = serverDate.getMinutes();

                if (
                    currentRecordType.value === 'platform' &&
                    serverHour === openHour.value &&
                    serverMinute >= 0 &&
                    serverMinute <= openMinute.value
                ) {
                    prepareNextRecordDisplay();
                }
            }
        }
    },
    { immediate: true }
)

watch(
    () => lastRecord.value,
    async (newVal) => {
        if (!newVal.createdAt) return;

        lastRecordArr.value = [];
        lastRecordArr.value = [
            { num: '01', desc: null },
            { num: '02', desc: null },
            { num: '03', desc: null },
            { num: '04', desc: null },
            { num: '05', desc: null },
            { num: '06', desc: null },
            { num: '07', desc: null },
        ];
        console.log(displayCountDown.value)
        if (currentRecordType.value == 'platform' && displayCountDown.value) {
            lastRecord.value.batch_number = platformNextBatchNumber.value;
            return;
        }

        const num1 = { num: String(newVal.num1).padStart(2, '0'), desc: newVal.num1_desc };
        const num2 = { num: String(newVal.num2).padStart(2, '0'), desc: newVal.num2_desc };
        const num3 = { num: String(newVal.num3).padStart(2, '0'), desc: newVal.num3_desc };
        const num4 = { num: String(newVal.num4).padStart(2, '0'), desc: newVal.num4_desc };
        const num5 = { num: String(newVal.num5).padStart(2, '0'), desc: newVal.num5_desc };
        const num6 = { num: String(newVal.num6).padStart(2, '0'), desc: newVal.num6_desc };
        const num7 = { num: String(newVal.num7).padStart(2, '0'), desc: newVal.num7_desc };

        const timeToDisplay = (new Date(newVal.createdAt).getTime()) + 120000; // 开奖时间+120秒
        const timeNow = Date.now();
        console.log(timeToDisplay, timeNow)
        
        if (currentRecordType.value === 'platform' && timeToDisplay >= timeNow) {
            let setIndex = 0;
            const interval = setInterval(() => {
                const secondsPassed = Math.floor((Date.now() - new Date(newVal.createdAt).getTime()) / 1000);
                console.log('Seconds passed since record creation:', secondsPassed);

                // calculate setIndex based on secondsPassed by 17 seconds, so that every 17 seconds, a new number is revealed
                setIndex = Math.floor(secondsPassed / 17);

                if (secondsPassed > 0) {
                    if (setIndex * 10 <= secondsPassed) {
                        for (let i = 0; i < setIndex && i < 7; i++) {
                            lastRecordArr.value[i] = eval(`num${i + 1}`);
                        }
                        setIndex++;
                    }
                    if (secondsPassed >= 120) {
                        clearInterval(interval);
                    }
                }
                
            }, 500);
        } else {
            lastRecordArr.value = [num1, num2, num3, num4, num5, num6, num7];
        }
    },
    { immediate: true }
);

const getResultGuesses = async () => {
    const res = await GET_RESULT_GUESS();
    if (res.code === 1000) {
        resultGuesses.value = res.data;
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
        touziPingTe.value = res.data;
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

const getReferenceImages = async () => {
    const res = await REFERENCE_IMAGES();
    if (res.code === 1000) {
        referenceImages.value = res.data;
    }
}

const getZodiacFeeds = async () => {
    const res = await ZODIAC_FEED();
    if (res.code === 1000) {
        zodiacFeeds.value = res.data;
    }
}

const formatOpenTimeString = () => {
    // format: 第xxx期 2026/04/22 星期三 21:15
    if (!lastRecord.value.createdAt) return;
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdayMap = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdayMap[date.getDay()];
    openTimeString.value = `第${Number(platformNextBatchNumber.value)}期 ${year}/${month}/${day} 星期${weekday} ${openHour.value}:${openMinute.value}`;

    // display between 8:00 AM and 9:15 PM
    const currentHour = date.getHours();
    const currentMinute = date.getMinutes();

    // check lastRecord's createdAt time, if it's today, then use that time to determine whether to display openTimeString
    const lastRecordDate = new Date(lastRecord.value.createdAt);
    const isToday = date.toDateString() === lastRecordDate.toDateString();

    if (currentHour >= 0 && (currentHour < 21 || (currentHour === 21 && currentMinute <= 15)) && !isToday) {
        displayOpenTimeString.value = true;
    } else {
        displayOpenTimeString.value = false;
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
    getReferenceImages();
    getZodiacFeeds();
});

</script>

<style scoped>
.circle-wrapper {
    position: relative;
    width: 40px;
    height: 40px;
}

.circle-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    /* font-weight: bold; */
    font-size: 22px;
    z-index: 2;
}

@media screen and (max-width: 360px) {
    .circle-wrapper {
        width: 33px;
        height: 33px;
    }
    .circle-text {
        font-size: 16px;
    }
}
</style>