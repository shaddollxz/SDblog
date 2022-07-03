import staticPics from "virtual:staticPics";
const noahEmoji = staticPics.noahEmoji;

//todo 将markdown中的特定符号转为特定的标签 配合css用来扩展markdown的功能
const EmojiRegexp = /:noah-(\d+?):/g; // 转换表情包
const BlackRegexp = /~~~(.+?)~~~/g; // 转换黑幕
export function pareMD(text: string) {
    return text
        .replace(
            EmojiRegexp,
            (_, $1) => `<img src="${noahEmoji.find((url) => url.includes($1))}" class="inline"></img>`
        )
        .replace(BlackRegexp, `<del class="black">$1</del>`);
}

const CopyRegexp = /(?<=<pre>)(.)/g;
const langRegexp = /<code class="language-(.+?)">/g;
export function pareHTML(text: string) {
    return text
        .replace(CopyRegexp, `<ce-copycode>复制代码</ce-copycode>$1`)
        .replace(langRegexp, '<code class="language-$1" data-lang="$1">');
}
