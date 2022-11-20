<template>
    <div class="arKnights">
        <RouterView></RouterView>
    </div>
</template>

<style lang="scss" scoped>
.arKnights {
    margin-left: $width-wife;
    @include mobile {
        margin-left: 0;
    }
}
</style>
