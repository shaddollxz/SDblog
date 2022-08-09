import { Message } from "sdt3";

const suffix = `
======================
copy from [shaddollxz的个人博客](${window.location})`;

/** 用于复制父元素中的全部内容 */
class CopyCode extends HTMLElement {
    constructor() {
        super();
        this.onclick = (e) => {
            if (e.target != this) return;
            // 删除该组件内的字符
            console.log("uses");
            const text = this.parentElement?.innerText.slice(this.innerText.length + 1);
            navigator.clipboard.writeText(text ? text + suffix : "").then(() => {
                Message.success("复制成功", {
                    style: {
                        position: "absolute",
                        right: 0,
                    },
                    leaveTo: "right",
                });
            });
        };
    }
}

window.customElements.define("ce-copycode", CopyCode);
