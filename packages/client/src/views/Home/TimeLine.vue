<template>
    <div class="timeLine">
        <p class="title xingyan">
            <SvgIcon name="home-calendar"></SvgIcon>
            <span>时间轴</span>
        </p>
        <NoData :show="!!timeLine">
            <ul class="lines gusto-hiddenScrollBar">
                <li v-for="(monthItem, year) of timeLine">
                    <h3 class="chuyuan">{{ year }}</h3>
                    <ul v-for="(contents, month) of monthItem">
                        <h4 class="chuyuan">{{ month }}</h4>
                        <li
                            v-for="item of contents"
                            class="chuyuan"
                            @click="router.push('/blog/' + item._id)"
                        >
                            <div class="time">
                                {{ item.createdAt }}
                            </div>
                            <RollText :type="2" :duration="6">{{ item.title }}</RollText>
                        </li>
                    </ul>
                </li>
            </ul>
        </NoData>
    </div>
</template>

<script setup lang="ts">
import NoData from "@/components/NoData/index.vue";
import { timeLineApi } from "@apis";
import getLine from "@/utils/timeLinePare";

const router = useRouter();

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
    top: calc($height-header + 1rem);
    height: calc(100vh - $height-header - 4rem);
    overflow: hidden;
    .title {
        display: flex;
        align-items: center;
        position: relative;
        height: $titleHeight;
        font-size: var(--fontsize-large);
        padding: 1.75rem $paddingLeft 0.5rem calc($paddingLeft / 2);
        margin-top: 0;
        margin-bottom: 1.3rem;
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
        h3 {
            font-size: var(--fontsize-large);
            margin: 0 0 auto $paddingLeft;
        }
        h4 {
            font-size: var(--fontsize-big);
        }
    }
}
.svgIcon {
    width: var(--fontsize-large);
    margin-right: 1.5rem;
}
</style>
