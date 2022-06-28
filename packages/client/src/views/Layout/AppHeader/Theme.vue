<template>
    <div class="theme gusto-flex-center">
        <SvgIcon name="layout-theme" class="canClick"></SvgIcon>
        <div class="tools gusto-border">
            <div class="themeBg">
                <span>主题</span>
                <SwitchButton v-model="isDark" @onStatuChange="themeChange">
                    <template #left>
                        <SvgIcon name="layout-day"></SvgIcon>
                    </template>
                    <template #right>
                        <SvgIcon name="layout-night"></SvgIcon>
                    </template>
                </SwitchButton>
            </div>
            <div class="themeColor">
                <span>主题色</span>
                <div class="colors">
                    <div
                        v-for="color of colors"
                        :style="{ backgroundColor: color }"
                        @click="changeColor(color)"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Theme from "@/storages/theme";
export default defineComponent({
    name: "theme",
});

//! 作为导入该组件的副作用 这句话在setup之前执行
//todo 设置主题或默认主题
document.documentElement.setAttribute("data-theme", Theme.getItem("theme") ?? "dark");
document.documentElement.style.setProperty("--color-text-theme", Theme.getItem("themeColor") ?? "#fb9b5f");
</script>
<script setup lang="ts">
let isDark = ref(document.documentElement.dataset.theme == "dark");
function themeChange(statu: boolean) {
    if (statu) {
        document.documentElement.setAttribute("data-theme", "dark");
        Theme.setItem("theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        Theme.setItem("theme", "light");
    }
}

const colors = ["#f26d6d", "#fb9b5f", "#ffd700", "#39C5BB", "#2196f3", "#8e44ad"] as const;
function changeColor(color: typeof colors[number]) {
    document.documentElement.style.setProperty("--color-text-theme", color);
    Theme.setItem("themeColor", color);
}
</script>

<style lang="scss" scoped>
.theme {
    position: relative;
    height: 100%;
    width: $height-header;

    .svgIcon {
        fill: var(--color-text-theme);
        width: var(--fontsize-xlarge);
        height: var(--fontsize-xlarge);
    }
    &:hover {
        .tools {
            display: block;
        }
    }
    .tools {
        display: none;
        position: absolute;
        top: $height-header;
        left: 50%;
        transform: translateX(-50%);
        width: 20rem;
        background-color: var(--color-bg-deep);
        > div {
            padding: 0.5rem;
        }
        .svgIcon {
            fill: inherit;
            width: var(--fontsize-big);
            height: var(--fontsize-big);
        }
        :deep(.switchButton) {
            --width: 4rem;
            .chosed {
                fill: var(--color-primary-bland);
            }
            .notChosed {
                fill: var(--color-error-bland);
            }
        }

        .colors {
            display: flex;
            > div {
                border-radius: 0.3rem;
                margin: 0.5rem;
                height: 1.5rem;
                width: 1.5rem;
                cursor: pointer;
            }
        }
    }
}
</style>
