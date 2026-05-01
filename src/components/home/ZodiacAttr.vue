<template>
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
</template>

<script setup>
import { computed } from 'vue';
import { useZodiacStore } from '../../stores/zodiac';

const zodiacStore = useZodiacStore();
const attributes = computed(() => zodiacStore.getAttributes);
</script>