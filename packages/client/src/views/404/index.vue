<template>
    <div class="notFound gusto-flex-center">
        <h2>404 Not Found</h2>
        <p>似乎连接到异次元了</p>
    </div>
</template>

<style lang="scss" scoped>
.notFound {
    height: calc(100vh - $height-header);
    width: 100%;
    flex-direction: column;
    h2 {
        font-size: var(--fontsize-xxlarge);
    }
}
</style>
