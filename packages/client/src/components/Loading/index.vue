<template>
    <div class="loading gusto-flex-center-col">
        <div class="loadingBox"></div>
        <span class="text chuyuan">Loading...</span>
    </div>
</template>

<style lang="scss" scoped>
.loading {
    --boxWidth: 10rem;
    --gap: 2rem;
}
.text {
    margin-top: calc(var(--gap) + 2.5rem);
    font-size: var(--fontsize-large);
    font-weight: 600;
}
.loadingBox {
    width: var(--boxWidth);
    height: var(--boxWidth);
    position: relative;
}
.loadingBox:before {
    content: "";
    position: absolute;
    top: calc(var(--boxWidth) + var(--gap));
    border-radius: 50%;
    width: var(--boxWidth);
    height: 0.8rem;
    background: var(--color-text-default);
    opacity: 0.7;
    animation: shadow 0.5s linear infinite;
}
.loadingBox:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border-radius: $border-r;
    width: var(--boxWidth);
    height: var(--boxWidth);
    background: var(--color-text-theme);
    animation: animate 0.5s linear infinite;
}
@keyframes animate {
    17% {
        border-bottom-right-radius: 0.3rem;
    }
    25% {
        transform: translateY(1rem) rotate(22.5deg);
    }
    50% {
        transform: translateY(2rem) scale(1, 0.9) rotate(45deg);
        border-bottom-right-radius: 3.5rem;
    }
    75% {
        transform: translateY(1rem) rotate(67.5deg);
    }
    100% {
        transform: translateY(0) rotate(90deg);
    }
}
@keyframes shadow {
    0%,
    100% {
        transform: scale(1, 1);
    }
    50% {
        transform: scale(1.2, 1);
    }
}
</style>
