<template>
    <div class="goTop gusto-flex-center" :class="{ show }">
        <img class="gusto-fillImg" src="~@img/goTop/rope.png" alt="" />
        <img class="cat" @click="rollToTop" src="~@img/goTop/cat.png" alt="" />
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
    flex-direction: column;
    width: 6rem;
    height: 75vh;
    transition: all 0.7s ease-in;
    z-index: 5;
    img {
        display: block;
    }
    .cat {
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
            transform: scale(107%);
            transform-origin: top;
        }
    }
}
.show {
    transform: translateY(75vh);
}
.observer {
    position: absolute;
    top: calc(100vh - var(--height-header));
}
@media screen and (max-width: 750px) {
    .cat {
        transform: scale(70%);
        transform-origin: top;
    }
}
</style>
