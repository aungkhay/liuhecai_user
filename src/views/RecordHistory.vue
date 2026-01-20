<template>
    <div>
        <v-app-bar density="compact" :elevation="0" style="background: linear-gradient(to right, #2fe62c, #4dfd46);">
            <template v-slot:prepend>
                <v-app-bar-nav-icon icon="mdi-chevron-left" @click="router.back()"></v-app-bar-nav-icon>
            </template>
            <v-app-bar-title>Record History</v-app-bar-title>
            <v-menu transition="scale-transition">
                <template v-slot:activator="{ props }">
                    <v-btn variant="outlined" v-bind="props" class="mr-2">{{ selectedYear.title }}</v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, i) in items" :key="i" :value="i" @click="selectedYear = item; getRecords(item.title.replace('年', ''))">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <template v-slot:extension>
                <v-tabs color="black" v-model="currentRecordType" grow @update:modelValue="onTabChange">
                    <v-tab v-for="(type, index) in recordType" :key="index" :value="type.value">{{ type.label }}</v-tab>
                </v-tabs>
            </template>
        </v-app-bar>

        <div id="item-list">
            <div v-for="(record, index) in records" :key="index" class="d-flex align-center justify-space-between bg-white my-2 px-2 rounded-lg">
                <div class="mr-2" style="min-width: 70px;">
                    <div class="text-grey-darken-2 text-caption">{{ $filters.formatDate(record.draw_date) }}</div>
                    <div class="font-weight-bold">{{ record.batch_number.padStart(3, '0') }}期</div>
                </div>
                <div class="d-flex align-center my-3">
                    <div v-for="n in 6" :key="n" class="mr-1 d-flex flex-column align-center">
                        <div class="circle-wrapper">
                            <v-img :src="getCircleBallImg(record[`num${n}`])" width="33" height="33" cover/>
                            <div class="circle-text">{{ record[`num${n}`].toString().padStart(2, '0') }}</div>
                        </div>
                        <div class="text-caption mt-1">{{ getZodiacName(record[`num${n}_desc`]) }}</div>
                    </div>
                    <div class="mx-1"><v-icon size="small">mdi-plus</v-icon></div>
                    <div class="mr-1 d-flex flex-column align-center">
                        <div class="circle-wrapper">
                            <v-img :src="getCircleBallImg(record.num7)" width="33" height="33" cover/>
                            <div class="circle-text">{{ record.num7.toString().padStart(2, '0') }}</div>
                        </div>
                        <div class="text-caption mt-1">{{ getZodiacName(record.num7_desc) }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import router from '../routers';
import { GET_LOTTERY_RECORD_HISTORY } from '../js/api';
import { useRoute } from 'vue-router';
import { useZodiacStore } from '../stores/zodiac';
import { computed } from 'vue';
const route = useRoute();

const items = ref([2026, 2025, 2024, 2023, 2022].map(year => ({ title: `${year}年` })));
const selectedYear = ref(items.value[0]);
const records = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const totalPage = ref(0);
const recordType = ref([
    { label: '平台六合彩', value: 'platform' }, 
    { label: '澳门六合彩', value: 'aomen' }, 
    { label: '香港六合彩', value: 'hongkong' }
]);
const currentRecordType = ref(route.query.type || recordType.value[1].value);
const isLoadMore = ref(false);

const zodiacStore = useZodiacStore();
const numbers = computed(() => zodiacStore.getNumbers);
const getCircleBallImg = (num) => {
    const record = numbers.value.find(n => n.id === num);
    if (!record) return '';
    return new URL(`../assets/circle-ball/${record.color}-circle.png`, import.meta.url).href;
}

const getRecords = async (year) => {
    if (!isLoadMore.value) {
        page.value = 1;
        records.value = [];
    }
    const res = await GET_LOTTERY_RECORD_HISTORY(currentRecordType.value, page.value, perPage.value, year);
    if (res.code === 1000) {
        if (isLoadMore.value) {
            records.value = [...records.value, ...res.data.records];
        } else {
            records.value = res.data.records;
        }
        total.value = res.data.meta.total;
        totalPage.value = res.data.meta.totalPage;
    }
    isLoadMore.value = false;
}

const onTabChange = (value) => {
    getRecords(selectedYear.value.title.replace('年', ''));
}

const getZodiacName = (num_desc) => {
    const desc = num_desc.split('/');
    return desc[0] + '/' + desc[1];
}

const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (page.value < totalPage.value && !isLoadMore.value) {
            isLoadMore.value = true;
            page.value++;
            getRecords(selectedYear.value.title.replace('年', ''));
        }
    }
}

onMounted(() => {
    getRecords(selectedYear.value.title.replace('年', ''));
    const itemList = document.getElementById('item-list');
    if (itemList) {
        itemList.addEventListener('scroll', handleScroll);
    }
})

onBeforeUnmount(() => {
    const itemList = document.getElementById('item-list');
    if (itemList) {
        itemList.removeEventListener('scroll', handleScroll);
    }
})
</script>

<style scoped>
#item-list {
    height: calc(100vh - 96px);
    overflow-y: auto;
}

.circle-wrapper {
    position: relative;
    width: 33px;
    height: 33px;
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