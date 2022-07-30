<template>
    <div class="goTop gusto-noClick gusto-flex-center-col" :class="{ show }">
        <img class="gusto-fillImg" src="~@img/goTop/rope.png" alt="" />
        <img class="cat canClick" @click="rollToTop" src="~@img/goTop/cat.png" alt="" />
    </div>
    <div ref="observer" class="observer"></div>
</template>

<script setup lang="ts">
let show = shallowRef(true);
const observer = shallowRef<HTMLDivElement | null>(null);
const io = new IntersectionObserver(([e]) => {
    //! observer初始在屏幕里 只要离开屏幕或者进入屏幕就改变状态
    if ((!e.intersectionRatio && !e.isIntersecting) || (e.intersectionRatio && e.isIntersecting)) {
        show.value = !show.value;
    }
});
onMounted(() => io.observe(observer.value!));

const rollToTop = () => scrollTo({ top: 0, left: 0, behavior: "smooth" });
</script>

<style lang="scss" scoped>
.goTop {
    position: fixed;
    right: 0;
    top: -75vh;
    width: 6rem;
    height: 75vh;
    transition: all 0.7s ease-in;
    z-index: 5;
    .cat {
        pointer-events: auto;
        @include scaleImage($scaled: 107%) {
            transform-origin: top;
        }
    }
}
.show {
    transform: translateY(75vh);
}
.observer {
    position: absolute;
    top: calc(100vh - $height-header);
}
@include mobile {
    .cat {
        transform: scale(70%);
        transform-origin: top;
    }
}
</style>
