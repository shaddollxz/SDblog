<template>
    <div class="table markdownContent">
        <table>
            <tr>
                <th v-for="title of names">{{ title }}</th>
                <th>概率</th>
            </tr>
            <tr v-for="item of possibles">
                <td v-for="count of item[0]">{{ count }}</td>
                <td>{{ $formatNumber(item[1] * 100, precision, false) + "%" }}</td>
            </tr>
        </table>
    </div>
</template>

<script setup lang="ts">
import type { default as CardAnalyze } from "./utils/CardAnalyze";

interface Props {
    names: CardAnalyze["names"];
    possibles: CardAnalyze["possibles"];
    precision: number;
}
defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/style/markdown/markdown.scss";
.table {
    background-color: var(--color-bg-deep);
    padding: 0;
    table {
        background-color: inherit;
        margin: 0;
    }
}
</style>
