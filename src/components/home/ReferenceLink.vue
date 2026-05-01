<template>
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
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { GET_REFERENCE_LINK } from '../../js/api';

const referenceLinks = ref([]);

const getReferenceLinks = async () => {
    const res = await GET_REFERENCE_LINK();
    if (res.code === 1000) {
        referenceLinks.value = res.data;
    }
}

onMounted(() => {
    getReferenceLinks();
})
</script>