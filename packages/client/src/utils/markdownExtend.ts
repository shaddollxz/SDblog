// 表情包的baseUrl
export const noahBaseUrl = "https://gitee.com/shadow_yi/picBed/raw/main/NoahEmoji/ui_sticker_";

//todo 将markdown中的特定符号转为特定的标签 配合css用来扩展markdown的功能
const EmojiRegexp = /:noah-(\d+?):/g; //? 转换表情包
const BlackRegexp = /~~~(.+?)~~~/g; //? 转换黑幕
export function pareMD(text: string) {
    return text
        .replace(EmojiRegexp, `<img src="${noahBaseUrl}$1.png" class="inline"></img>`)
        .replace(BlackRegexp, `<del class="black">$1</del>`);
}

const CopyRegexp = /(?<=<pre>)(.)/g;
const langRegexp = /<code class="language-(.+?)">/g;
export function pareHTML(text: string) {
    return text
        .replace(CopyRegexp, `<ce-copycode>复制代码</ce-copycode>$1`)
        .replace(langRegexp, '<code class="language-$1" data-lang="$1">');
}
