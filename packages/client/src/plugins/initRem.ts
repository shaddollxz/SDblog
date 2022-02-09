// 将750-1920之间的页面布局固定 只需要将750以下当作手机配置就行
function setHtmlFontSize() {
    // 1366是设计稿的宽度，当大于1920时采用1920宽度   1920/16=120    这里将1rem等于16px
    let deviceWidth = document.documentElement.clientWidth > 1920 ? 1920 : document.documentElement.clientWidth;

    if (document.documentElement.clientWidth < 750) {
        // 输出设备小于750时，固定font-size为12px；
        document.documentElement.style.fontSize = "12px";
    } else {
        document.documentElement.style.fontSize = deviceWidth / 120 + "px";
    }
}

setHtmlFontSize();
window.addEventListener("resize", setHtmlFontSize);
export {};
