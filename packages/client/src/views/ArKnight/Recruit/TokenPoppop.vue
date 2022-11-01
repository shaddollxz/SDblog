<template>
    <div class="tokenPoppop">
        输入token
        <textarea @keyup="checkAndSaveToken"></textarea>
    </div>
</template>

<script setup lang="ts">
import { AKStorage } from "@/storages/arKnight";

function checkAndSaveToken(e: KeyboardEvent) {
    const input = (e.target as HTMLTextAreaElement).value;
}
</script>

<style lang="scss" scoped></style>
