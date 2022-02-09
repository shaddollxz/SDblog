<template>
    <div class="theme gusto-flex-center">
        <i class="iconfont icon-theme" title="改变主题"></i>
        <div class="tools gusto-border">
            <div class="themeBg">
                <span>主题</span>
                <SwitchButton v-model="isDark" @onStatuChange="themeChange">
                    <template #left>
                        <i class="iconfont icon-baitianmoshi"></i>
                    </template>
                    <template #right>
                        <i class="iconfont icon-tubiaozhizuomoban1"></i>
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
export default defineComponent({
    name: "theme",
});

//! 作为导入该组件的副作用 这句话在setup之前执行
//todo 设置主题或默认主题
document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") ?? "dark");
document.documentElement.style.setProperty(
    "--color-text-theme",
    localStorage.getItem("themeColor") ?? "#fb9b5f"
);
</script>
<script setup lang="ts">
let isDark = ref(document.documentElement.dataset.theme == "dark");
function themeChange(statu: boolean) {
    if (statu) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }
}

const colors = ["#f26d6d", "#fb9b5f", "#ffd700", "#39C5BB", "#2196f3", "#8e44ad"] as const;
function changeColor(color: typeof colors[number]) {
    document.documentElement.style.setProperty("--color-text-theme", color);
    localStorage.setItem("themeColor", color);
}
</script>

<style lang="scss" scoped>
.theme {
    position: relative;
    height: 100%;
    width: var(--height-header);

    .icon-theme {
        font-size: var(--fontsize-large);
        color: var(--color-text-theme);
        cursor: pointer;
    }
    &:hover {
        .tools {
            display: block;
        }
    }
    .tools {
        display: none;
        position: absolute;
        top: var(--height-header);
        left: 50%;
        transform: translateX(-50%);
        width: 20rem;
        background-color: var(--color-bg-deep);
        > div {
            padding: 0.5rem;
        }
        .switchButton {
            --width: 4rem;
            i {
                font-size: var(--fontsize-big);
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
