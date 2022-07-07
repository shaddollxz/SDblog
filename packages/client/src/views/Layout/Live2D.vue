<template>
    <canvas id="wife_L2D" class="gusto-noClick" height="600" width="200"></canvas>
</template>

<script setup lang="ts">
import loadL2D from "@/utils/loadL2D.js";

onMounted(() => {
    loadL2D("#wife_L2D", {
        paths: [{ url: window.location.origin + "/Live2D/angel/model.model.json" }],
    });
});
</script>

<style lang="scss">
#wife_L2D {
    position: fixed;
    bottom: -4px;
    left: 0.5rem;
    z-index: 99999;
    @include mobile {
        display: none;
    }
}
</style>
