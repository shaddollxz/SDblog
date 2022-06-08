import { marked, Renderer } from "marked";
import type { marked as MarkedType } from "marked";
import { pareMD, pareHTML } from "./markdownExtend";
import hljs from "highlight.js/lib/core";

import typescript from "highlight.js/lib/languages/typescript";
import scss from "highlight.js/lib/languages/scss";
import xml from "highlight.js/lib/languages/xml";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import shell from "highlight.js/lib/languages/shell";
import powershell from "highlight.js/lib/languages/powershell";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("css", css);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("powershell", powershell);
hljs.registerLanguage("java", java);
hljs.registerLanguage("python", python);

const renderer = new Renderer();
const options: MarkedType.MarkedOptions = {
    renderer,
    highlight(code: any) {
        return hljs.highlightAuto(code).value;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
};
onmessage = ({ data }) => {
    //todo 解析markdown并获取解析耗时，通过耗时大致猜测挂载dom的时间（加载动画的持续时间）
    performance.mark("begin");

    const content = pareHTML(marked(pareMD(data ?? ""), options));

    performance.mark("end");
    performance.measure("during", "begin", "end");
    const [during] = performance.getEntriesByName("during");
    postMessage({ content, loadingTime: during.duration > 200 ? 2200 : 0 });
    performance.clearMarks();
    performance.clearMeasures();
};
