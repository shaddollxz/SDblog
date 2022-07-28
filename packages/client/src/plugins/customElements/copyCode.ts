import * as clipboard from "clipboard-polyfill/text";
import { Message } from "sdt3";

const suffix = `
======================
copy from [shaddollxz的个人博客](${window.location})`;

class CopyCode extends HTMLElement {
    constructor() {
        super();
        this.onclick = (e) => {
            if (e.target != this) return;
            const copy = this.parentElement?.innerText.slice(this.innerText.length + 1); //? 前三个字符是复制按钮
            clipboard.writeText(copy ? copy + suffix : "").then(() => {
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
