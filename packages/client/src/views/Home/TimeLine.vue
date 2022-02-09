<template>
    <div class="timeLine">
        <p class="title">
            <i class="iconfont icon-calendar-v2-full"></i>
            <span>时间轴</span>
        </p>
        <ul v-if="timeLine" class="lines gusto-hiddenScrollBar">
            <li v-for="(monthItem, year) of timeLine">
                <h3>{{ year }}</h3>
                <ul v-for="(contents, month) of monthItem">
                    <h4>{{ month }}</h4>
                    <li v-for="item of contents" @click="$router.push('/blog/' + item._id)">
                        <div class="time">
                            {{ item.createdAt }}
                        </div>
                        <RollText :type="2" :duration="6">{{ item.title }}</RollText>
                    </li>
                </ul>
            </li>
        </ul>
        <NoData v-else></NoData>
    </div>
</template>

<script setup lang="ts">
import NoData from "@/components/NoData/index.vue";
import { timeLineApi } from "@apis";
import getLine from "@/utils/timeLinePare";

let timeLine = shallowRef<ReturnType<typeof getLine>>(null);
let blogCount = ref(0);
onMounted(async () => {
    const { data } = await timeLineApi();
    blogCount.value = data.length;
    timeLine.value = getLine(data);
});
</script>

<style lang="scss" scoped>
.timeLine {
    $paddingLeft: 2.5rem;
    $titleHeight: 3rem;
    $pointRadius: 0.5rem;
    $linewidth: 0.5rem;
    position: sticky;
    top: calc(var(--height-header) + 1rem);
    height: calc(100vh - var(--height-header) - 4rem);
    overflow: hidden;
    .title {
        position: relative;
        height: $titleHeight;
        font-family: "xingyan";
        font-size: var(--fontsize-large);
        padding: 1.75rem $paddingLeft 0.5rem calc($paddingLeft / 2);
        margin-top: 0;
        margin-bottom: 1.3rem;
        z-index: 10;
        &::after {
            content: "";
            display: block;
            position: absolute;
            left: calc($paddingLeft / 2);
            right: calc($paddingLeft / 2);
            bottom: 0;
            height: 1px;
            background-color: var(--color-border);
        }
        .iconfont {
            font-size: var(--fontsize-large);
            font-weight: 600;
            margin-right: 1.5rem;
        }
    }
    .lines {
        height: calc(100% - $titleHeight - 0.5rem - 1.3rem);
        overflow-y: scroll;
        // 线
        &::after {
            content: "";
            position: absolute;
            top: calc($titleHeight + 1.75rem + 0.5rem + 1.3rem); // p的高加上padding margin
            left: calc($paddingLeft / 2 - $linewidth / 2);
            width: $linewidth;
            height: calc(100% - $titleHeight);
            background-color: var(--color-text-default);
            z-index: 10;
        }
        > li {
            list-style: none;
        }
        ul {
            position: relative;
            left: $paddingLeft;
            width: calc(100% - $paddingLeft);
            li {
                display: flex;
                justify-content: flex-start;
                list-style: none;
                margin-bottom: 2rem;
                cursor: pointer;
                font-family: "chuyuan";
                text-align: center;
                &:hover {
                    .time::before {
                        background-color: var(--color-text-theme) !important;
                    }
                    color: var(--color-text-theme);
                }
                .time {
                    position: relative;
                    flex: 0 0 auto;
                    height: 1.5rem;
                    font-weight: 600;
                    margin-right: 1.5rem;

                    // 点
                    &::before {
                        content: "";
                        position: absolute;
                        top: calc(50% - $pointRadius);
                        left: calc($paddingLeft / -2 - $linewidth / 2 - $pointRadius / 2);
                        padding: $pointRadius;
                        border-radius: 50%;
                        background-color: var(--color-text-default);
                        z-index: 30;
                    }
                    // 点背景
                    &::after {
                        content: "";
                        position: absolute;
                        top: calc(50% - $pointRadius - $pointRadius / 2);
                        left: calc($paddingLeft / -2 - $linewidth / 2 - $pointRadius / 2);
                        height: $pointRadius;
                        padding: $pointRadius;
                        background-color: var(--color-bg-bland);
                        z-index: 25;
                    }
                }
                .rollText {
                    flex: 1;
                }
            }
        }
        h3,
        h4 {
            font-family: "chuyuan";
        }
        h3 {
            font-size: var(--fontsize-large);
            margin: 0 0 auto $paddingLeft;
        }
        h4 {
            font-size: var(--fontsize-big);
        }
    }
}
</style>
