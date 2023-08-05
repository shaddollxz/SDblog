<template>
    <footer class="global-footer gusto-flex-center">
        <div class="siteMsg">
            <div>
                {{ `Copyright © ${$formatTime(new Date(), "/YYYY/")}` }}
                <a :href="href">{{ adminName }}</a>
            </div>
            <div class="gusto-flex-center">
                <img src="~@img/beian.png" alt="" />
                <a href="https://beian.miit.gov.cn/" target="_blank">{{ beianhao }}</a>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const href = import.meta.env.PUBLIC_WEBSITE;
const adminName = import.meta.env.PUBLIC_ADMIN_NAME;
const beianhao = import.meta.env.PUBLIC_BEIAN;
</script>

<style lang="scss">
.global-footer {
    background-color: $bg-header;
    color: $color-header;
    box-sizing: border-box;
    padding-left: $width-wife;
    a {
        color: $color-header;
    }
    .siteMsg {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
        margin-right: $width-wife;
        text-align: center;
    }

    @include mobile {
        flex-direction: column;
        padding-left: 0;
        .siteMsg {
            margin-right: 0;
        }
        .about {
            display: flex;
            margin-right: 1rem;
        }
    }
}
</style>
