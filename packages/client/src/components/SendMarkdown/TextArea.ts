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
    /** 是否符合一键删除的判断 如果不符合返回undefined */
    removeType(start: number) {
        if (this.main.value[start] == ")") {
            const results = Array.from(this.main.value.slice(0, start).matchAll(/\(|\[|\]|\!/g));
            if (results.at(-1)?.[0] == "(" && results.at(-2)?.[0] == "]" && results.at(-3)?.[0] == "[") {
                const end = results.at(-4);
                if (end?.[0] == "!") {
                    return { type: "img", end: end.index };
                }
                return { type: "link", end: results.at(-3)!.index };
            }
        } else if (this.main.value[start] == ":") {
            const results = Array.from(this.text.value.matchAll(/:\w+?-\d+?:$/g));
            if (results[0]) {
                return { type: "emoji", end: results[0]!.index };
            }
        }
        return;
    }
    /** 光标向后移动 */
    cursorBack(to: number) {
        console.log(to);
        this.main.focus();
        this.main.setSelectionRange(2, 3, "forward");
    }
}

function searchAll(str: string, find: RegExp) {
    return Array.from(str.matchAll(find)).map((item) => item.index);
}
