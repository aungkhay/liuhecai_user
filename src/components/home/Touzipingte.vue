<template>
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
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { GET_TOUZI_PING_TE } from '../../js/api';

const touziPingTe = ref([]);

const getTouziPingTe = async () => {
    const res = await GET_TOUZI_PING_TE();
    if (res.code === 1000) {
        touziPingTe.value = res.data;
    }
}

onMounted(() => {
    getTouziPingTe();
})
</script>