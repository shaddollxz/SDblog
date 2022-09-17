<template>
    <footer class="global-footer gusto-flex-center">
        <div class="siteMsg">
            <div>
                Copyright © 2022
                <a href="https://www.shaddollxz.space">影依贤者</a>
            </div>
            <div class="gusto-flex-center">
                <img src="~@img/beian.png" alt="" />
                <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2021027724号</a>
            </div>
        </div>
    </footer>
</template>

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
