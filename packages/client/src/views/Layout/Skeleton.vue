<template>
    <div class="skeleton gusto-flex-center" v-if="close">
        <div v-html="content"></div>
    </div>
</template>

<script setup lang="ts">
const content = ref("");
const close = ref(true);
const description = [
    "正在准备以副本模式启动系统 ……",
    "<br>C:\\sophia\\sefiroth.exe 执行中发生错误。",
    "<br>正在试图执行来自未知发布者的以下程序。",
    "<br>C:\\tierra\\qliphoth.exe 您想允许执行吗? ……",
    "&nbsp; Y &nbsp;",
    "<br>以自律模式启动系统。",
];
onMounted(() => {
    if (!sessionStorage.getItem("notFirstIn")) {
        let i = 0;
        let interval = setInterval(() => {
            if (description[i]) {
                content.value += description[i++];
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    close.value = false;
                    sessionStorage.setItem("notFirstIn", "1");
                }, 1200);
            }
        }, 800);
    } else {
        close.value = false;
    }
});
</script>

<style lang="scss" scoped>
.skeleton {
    line-height: 3rem;
    font-size: var(--fontsize-big);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999999999;
    background-color: var(--color-bg-deep);
    div {
        width: 60%;
        &::after {
            font-weight: 1000;
            content: "__";
            animation: kirakira 0.85s infinite;
        }
        @include mobile {
            width: 90%;
        }
    }
}
@keyframes kirakira {
    0% {
        opacity: 0;
    }
    40% {
        opacity: 0;
    }
    45% {
        opacity: 1;
    }
    95% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>
