<template>
    <div class="home">
        <div class="center">
            <router-view></router-view>
        </div>
        <Left></Left>
        <Right></Right>
    </div>
</template>

<script setup lang="ts">
import Left from "./Left.vue";
import Right from "./Right.vue";
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    justify-content: center;
    height: 100%;
    margin-top: calc(var(--height-header) + 3rem);
    margin-bottom: 1rem;
    gap: 1rem;
    .center {
        width: 45%;
        order: 2;
    }
    .right,
    .left {
        display: flex;
        flex-direction: column;
        width: 24%;
        flex: 0 0 auto;
        border-radius: 0.5rem;
        gap: 1rem;
    }
    .right {
        order: 3;
    }
    .left {
        order: 1;
    }
    @include mobile {
        flex-direction: column;
        .left,
        .center {
            width: 100%;
        }
        .right {
            display: none;
        }
    }
}
</style>
