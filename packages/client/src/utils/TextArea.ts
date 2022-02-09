// 用来操作textarea的类 实例化时第一个是dom 第二个是dom v-module 绑定的数据
export default class TextArea {
    main: HTMLTextAreaElement;
    text: Ref<string>;
    beforeInsertStart!: number;
    beforeInsertEnd!: number;
    constructor(textarea: HTMLTextAreaElement, text: Ref<string>) {
        this.main = textarea;
        this.text = text;
    }
    // 在鼠标的位置插入
    insert(input: string) {
        this.main.focus();
        this.beforeInsertStart = this.main.selectionStart;
        this.main.value = this.text.value =
            this.main.value.slice(0, this.beforeInsertStart) +
            input +
            this.main.value.slice(this.beforeInsertStart, this.main.value.length);
        this.main.setSelectionRange(
            this.beforeInsertStart + input.length,
            this.beforeInsertStart + input.length
        );
    }
    // 在鼠标勾选的两遍插入
    add(input1: string, input2: string) {
        input2 ??= input1;
        this.main.focus();
        this.beforeInsertStart = this.main.selectionStart;
        this.beforeInsertEnd = this.main.selectionEnd;
        this.main.value = this.text.value =
            this.main.value.slice(0, this.beforeInsertStart) +
            input1 +
            this.main.value.slice(this.beforeInsertStart, this.beforeInsertEnd) +
            input2 +
            this.main.value.slice(this.beforeInsertEnd, this.main.value.length);
        this.main.setSelectionRange(this.beforeInsertStart + 1, this.beforeInsertStart + 1);
    }
}
