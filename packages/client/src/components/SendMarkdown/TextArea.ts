// 用来操作textarea的类 实例化时第一个是dom 第二个是dom v-module 绑定的数据
export default class TextArea {
    main: HTMLTextAreaElement;
    text: Ref<string>;
    constructor(textarea: HTMLTextAreaElement, text: Ref<string>) {
        this.main = textarea;
        this.text = text;
    }
    get textLen() {
        return this.main.value.length;
    }
    /** 获得当前光标位置 */
    cursorPoint() {
        return {
            start: this.main.selectionStart,
            end: this.main.selectionEnd,
        };
    }
    /** 在鼠标的位置插入 */
    insert(input: string) {
        this.main.focus();
        const start = this.main.selectionStart;
        this.main.value = this.text.value =
            this.main.value.slice(0, start) + input + this.main.value.slice(start, this.textLen);
        this.main.setSelectionRange(start + input.length, start + input.length);
    }
    /** 在鼠标勾选的两边插入 */
    add(input1: string, input2?: string) {
        input2 ??= input1;
        this.main.focus();
        const { start, end } = this.cursorPoint();

        this.main.value = this.text.value =
            this.main.value.slice(0, start) +
            input1 +
            this.main.value.slice(start, end) +
            input2 +
            this.main.value.slice(end, this.textLen);

        this.main.setSelectionRange(start + 1, start + 1);
    }
    /** 从当前位置删除直到指定字符 返回布尔值表示是否删除成功 */
    deleteTo(target: string) {
        this.main.focus();
        // 从外部判断start和end相同
        const start = this.main.selectionStart;

        const end = searchAll(this.main.value.slice(0, start), new RegExp(target, "g")).pop();

        if (end) {
            const deleted = this.main.value.slice(end, start);
            this.main.value = this.text.value =
                this.main.value.slice(0, end) + this.main.value.slice(start + 1, this.textLen);
            this.main.setSelectionRange(end, end);
            return deleted;
        } else {
            return false;
        }
    }
    isImgOrLink(start: number) {
        if (this.main.value[start] == ")") {
            const indexs = Array.from(this.main.value.slice(0, start).matchAll(/\(|\[|\]/g));
            if (indexs.at(-1)?.[0] == "(" && indexs.at(-2)?.[0] == "]" && indexs.at(-3)?.[0] == "[") {
                if (indexs.at(-4)?.[0] == "!") {
                    return "img";
                }
                return "link";
            }
        }
        return false;
    }

    /** 光标向后移动 */
    cursorBack(to: number) {
        this.main.focus();
        this.main.setSelectionRange(to, to, "backward");
    }
}

function searchAll(str: string, find: RegExp) {
    return Array.from(str.matchAll(find)).map((item) => item.index);
}
