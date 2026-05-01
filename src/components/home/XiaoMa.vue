<template>
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
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { GET_XIAO_MA } from '../../js/api';

const qixiao = ref({});
const wuxiao = ref({});
const sanxiao = ref({});

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
}

onMounted(() => {
    getXiaoMa();
})
</script>