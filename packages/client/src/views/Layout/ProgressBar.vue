<template>
    <div class="progressBar"></div>
</template>

<style lang="scss" scoped>
.progressBar {
    position: fixed;
    top: 0;
    z-index: 9999;
    height: 0.2rem;
    width: 100%;
    background: linear-gradient(
        90deg,
        rgba(0, 255, 25, 1) 0%,
        rgba(223, 245, 0, 1) 27%,
        rgba(255, 0, 0, 1) 59%,
        rgba(198, 62, 251, 1) 82%
    );
}
</style>
