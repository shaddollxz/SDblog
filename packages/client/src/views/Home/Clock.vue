<template>
    <div class="clock">
        <div class="bigTime">
            <div class="week">{{ date.week }}</div>
            <div class="day">{{ date.day }}</div>
        </div>
        <div class="minute">{{ date.minute }}</div>
    </div>
</template>

<script setup lang="ts">
import { SDDate } from "sdt3";
let now = shallowRef(new SDDate());
const date = computed(() => {
    return {
        week: now.value.format("/W/", false),
        day: now.value.format("/DD///MMM///YYYY/", false),
        minute: now.value.format("/HH/:/mm/:/ss/", false),
    };
});

let interval: number;
onMounted(() => {
    interval = window.setInterval(() => (now.value = new SDDate()), 1000);
});
onUnmounted(() => clearInterval(interval));
</script>

<style lang="scss" scoped>
.clock {
    font-family: "chuyuan";
    border-bottom: 1px solid var(--color-border);
    cursor: default;
    .bigTime {
        font-size: var(--fontsize-big);
    }
    .minute {
        margin: 0.3rem;
        font-size: var(--fontsize-xxlarge);
    }
}
</style>
