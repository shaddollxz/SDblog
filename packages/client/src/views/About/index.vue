<template>
    <div class="aboutme">
        <div class="markdownContent">
            <h2>✨关于该网站</h2>
            <p>我的博客网站，大概拿来放点学习笔记啥的，预计会再搭建几个页面干别的</p>
            <p style="display: flex; align-items: center">
                <span>前端使用</span>
                <SvgIcon name="vite"></SvgIcon>
                <SvgIcon name="vue"></SvgIcon>
                <SvgIcon name="typescript"></SvgIcon>
                <SvgIcon name="pinia"></SvgIcon>
                <SvgIcon name="sass"></SvgIcon>
                <br />
                <span>后端使用</span>
                <SvgIcon name="nodejs"></SvgIcon>
                <SvgIcon name="typescript"></SvgIcon>
                <SvgIcon name="mongodb"></SvgIcon>
            </p>
            <p>
                本站完全适配手机屏幕，如果嫌丑请告诉我改进方案，我只是前端不会设计（网站配色都是从
                <a href="https://github.com/">github</a>
                上偷的）
            </p>
            <p>
                本站唯一使用的组件库是我自己的一个工具库，有兴趣可以来看看
                <a href="https://github.com/shaddollxz/SDT">sdt3</a>
            </p>
            <br />
            <p>
                同时网站配置了
                <code>pwa</code>
                ，静态资源部分会缓存进浏览器，支持离线使用
            </p>
            <p>
                而且如果你用的是
                <code>chrome</code>
                , 可以在导航栏上看到将该页面添加到桌面的按钮
            </p>
            <Caches></Caches>

            <template v-if="!isMobile">
                <h2>←关于她💕</h2>
                <p>手游《诺亚幻想》的角色，是叫做安吉尔的小可爱</p>
                <p>如果你看不到她，那说明你是用手机看的网页，换pc来看看吧</p>
                <p>因为原模型有问题，我只能找demo来手动引进模型，所以暂时还没有其它功能</p>
                <p>
                    <a href="https://store.steampowered.com/app/616720/Live2DViewerEX/">Live2DViewerEX</a>
                    上有我放的其它一些模型，做的比网页的好点，可以去看看
                </p>
            </template>

            <h2>💡关于我</h2>
            <p>男，来自大非洲，2000年生，所以现在17岁（</p>
            <p>前端程序猿</p>
            <p>喜欢玩魂类，银河城类游戏还喜欢玩橙汁，可以在首页找到联系我的方式</p>

            <h2>🎉赞助</h2>
            <p>如果喜欢本博客，可以为我分担一点服务器和域名的租金</p>
            <div class="qitao">
                <p>
                    <span @click="index = 0">微信</span>
                    |
                    <span @click="index = 1">支付宝</span>
                </p>
                <img :src="qitao[index]" alt="" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import isMobile from "@/utils/isMobile";
import wechat from "@img/qitao/wechat.png";
import alipay from "@img/qitao/alipay.png";
import Caches from "./Caches.vue";
let index = ref(0);
const qitao = [wechat, alipay];
</script>

<style lang="scss" scoped>
@import "@/style/markdown/markdown.scss";
.aboutme {
    margin: 0 $width-wife 1rem;
    @include mobile {
        margin: 0;
    }
}
.svgIcon {
    width: 2.4rem;
    height: 2.4rem;
    margin-right: 0.5rem;
}
.qitao {
    p {
        margin: 1rem auto;
        width: max-content;
        color: var(--color-text-theme);
        span {
            cursor: pointer;
        }
    }
    img {
        width: 20%;
        @include mobile {
            width: 50%;
        }
    }
}
</style>
