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
                    <div class="font-weight-bold" v-if="currentRecordType == 'platform'">澳博六合彩第20{{ lastRecord?.batch_number }}期</div>
                    <div class="font-weight-bold" v-else>{{ lastRecord?.batch_number }}期</div>
                    <div class="text-red text-caption">开奖记录</div>
                </div>
                <div  class="d-flex align-center justify-space-between" @click="goHistory(currentRecordType)">
                    <div v-if="gettingLastRecord" style="min-height: 69.5px;" class="d-flex align-center justify-center">
                        <v-progress-circular indeterminate size="24" width="2" color="primary"></v-progress-circular>
                    </div>
                    <div v-else class="d-flex align-center justify-center my-1 overflow-x-auto w-100">
                        <div v-for="n in (lastRecordArr.length === 7 ? 6 : lastRecordArr.length)" :key="n" class="mr-1">
                            <div class="circle-wrapper">
                                <v-img :src="getCircleBallImg(lastRecordArr[n - 1]?.desc)" width="40" height="40" cover/>
                                <div class="circle-text" :class="{ 'text-grey': lastRecordArr[n - 1]?.desc == null && currentRecordType == 'platform' }">{{ lastRecordArr[n - 1]?.num }}</div>
                            </div>
                            <div class="text-center" style="font-size: 0.9rem;">{{ getZodiacName(lastRecordArr[n - 1]?.desc) }}</div>
                        </div>
                        <div v-if="lastRecordArr.length === 7"><v-icon size="small">mdi-plus</v-icon></div>
                        <div v-if="lastRecordArr.length === 7">
                            <div class="circle-wrapper mr-1">
                                <v-img :src="getCircleBallImg(lastRecordArr[6]?.desc)" width="40" height="40" cover/>
                                <div class="circle-text" :class="{ 'text-grey': lastRecordArr[6]?.desc == null && currentRecordType == 'platform' }">{{ lastRecordArr[6]?.num }}</div>
                            </div>
                            <div class="text-center" style="font-size: 0.9rem;">{{ getZodiacName(lastRecordArr[6]?.desc) }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="serverHour != openHour || (serverHour == openHour && serverMinute < 30)" class="text-red font-weight-semibold text-caption" style="font-size: 13px;">
                    {{ openTimeString }} 
                    <span class="text-purple"><span class="">倒计时: </span>{{ countdownString }}</span>
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
            <ReferenceLink />
            <ResultGuesses />
            <Touzipingte />
            <XiaoMa />
            <DoubleColor />
            <ZodiacFeed />
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

            <Zodiac />
            <WuXing />
            <ColorMap />
            <OddEven />
            <ZodiacAttr />
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
import { GET_BANNERS, GET_LAST_RECORD, GET_DOUBLE_COLOR, REFERENCE_IMAGES } from '../js/api';
import { useZodiacStore } from '../stores/zodiac';
import router from '../routers';
import Appbar from '../components/Appbar.vue';
import { useGlobalStore } from '../stores/global';
import MustWin3Batch from '../components/home/MustWin3Batch.vue';
import TenWinSpecial from '../components/home/TenWinSpecial.vue';
import ReferenceLink from '../components/home/ReferenceLink.vue';
import ResultGuesses from '../components/home/ResultGuesses.vue';
import Touzipingte from '../components/home/Touzipingte.vue';
import XiaoMa from '../components/home/XiaoMa.vue';
import DoubleColor from '../components/home/DoubleColor.vue';
import ZodiacFeed from '../components/home/ZodiacFeed.vue';
import Zodiac from '../components/home/Zodiac.vue';
import WuXing from '../components/home/WuXing.vue';
import ColorMap from '../components/home/ColorMap.vue';
import OddEven from '../components/home/OddEven.vue';
import ZodiacAttr from '../components/home/ZodiacAttr.vue';

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
const referenceImages = ref([]);  
const displayCountDown = ref(false);
const countDown = ref('');
const countdownFinished = ref(false);

const openHour = ref(20);
const openMinute = ref(32);
const serverHour = ref(0);
const serverMinute = ref(0);
const serverSecond = ref(0);

const openTimeString = ref('');
const countdownString = ref('');
const displayOpenTimeString = ref(false);
const previewImageDialog = ref(false);
const previewImageSrc = ref('');

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

const getBanners = async () => {
    const res = await GET_BANNERS();
    if (res.code === 1000) {
        banners.value = res.data;
    }
};

const goHistory = (type) => {
    if (serverHour.value == openHour.value && serverMinute.value >= openMinute.value && serverMinute.value <= openMinute.value + 2) return;
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

function pad(n) { return String(n).padStart(2, "0"); }

watch(() => serverTime.value, (newVal) => {
    if (newVal) {
        const serverDate = new Date(newVal);
        serverHour.value = serverDate.getHours();
        serverMinute.value = serverDate.getMinutes();
        serverSecond.value = serverDate.getSeconds();

        // reload page at 8:32 PM
        if (serverHour.value == openHour.value && serverMinute.value == openMinute.value && serverSecond.value == 20) {
            window.location.reload();
        }

        // Start: today 9:00 PM
        const start = new Date(serverDate.getFullYear(), serverDate.getMonth(), serverDate.getDate(), 21, 0, 0);

        // End: next day 8:32 PM
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        end.setHours(20, 32, 0, 0);
        
        const t = new Date();
        let remainingMs = serverHour.value > openHour.value ? end - t : start.getTime() - t.getTime() - 1680000;

        if (remainingMs <= 0) {
            countdownString.value = "00:00:00";
            return;
        }

        const totalSeconds = Math.floor(remainingMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        countdownString.value = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
}, { immediate: true });

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

        const num1 = { num: String(newVal.num1).padStart(2, '0'), desc: newVal.num1_desc };
        const num2 = { num: String(newVal.num2).padStart(2, '0'), desc: newVal.num2_desc };
        const num3 = { num: String(newVal.num3).padStart(2, '0'), desc: newVal.num3_desc };
        const num4 = { num: String(newVal.num4).padStart(2, '0'), desc: newVal.num4_desc };
        const num5 = { num: String(newVal.num5).padStart(2, '0'), desc: newVal.num5_desc };
        const num6 = { num: String(newVal.num6).padStart(2, '0'), desc: newVal.num6_desc };
        const num7 = { num: String(newVal.num7).padStart(2, '0'), desc: newVal.num7_desc };

        const timeToDisplay = (new Date(newVal.createdAt).getTime()) + 120000; // 开奖时间+120秒
        const timeNow = Date.now();
        // console.log(timeToDisplay, timeNow)
        
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

const getReferenceImages = async () => {
    const res = await REFERENCE_IMAGES();
    if (res.code === 1000) {
        referenceImages.value = res.data;
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
    getReferenceImages();
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
    font-size: 18px;
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