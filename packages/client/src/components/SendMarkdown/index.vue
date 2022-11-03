<template>
    <div class="sendMarkdown" ref="sendMarkdown">
        <div class="toolBar">
            <div class="left">
                <template v-for="item of leftList" :title="item.title">
                    <SvgIcon :name="item.icon" @click="item.func"></SvgIcon>
                </template>
            </div>
            <div class="right">
                <template v-for="item of rightList" :title="item.title">
                    <SvgIcon :name="item.icon" @click="item.func"></SvgIcon>
                </template>
            </div>
        </div>

        <div class="inputArea">
            <textarea
                ref="textarea"
                cols="30"
                rows="10"
                v-model.trim="text"
                @keydown="inputFormat($event)"
                v-bind="$attrs"
            ></textarea>
            <Markdown v-if="isPreview" :markdown="text"></Markdown>
        </div>

        <div class="buttons">
            <div class="left"><slot name="leftBtn"></slot></div>
            <div class="right">
                <CheckButton v-bind="$attrs" @onClick="$emit('onSend')" :isCanClick="isCanSend">
                    发送
                </CheckButton>
                <div class="gusto-button" @click="text = ''">清空</div>
            </div>
        </div>

        <EmojiBox @insertEmoji="insertEmoji" ref="emojiBox"></EmojiBox>
    </div>
</template>

<script setup lang="ts">
import Markdown from "../Markdown/index.vue";
import EmojiBox from "./EmojiBox.vue";
import CheckButton from "../CheckButton/index.vue";
import { Message, LocalFiles } from "sdt3";
import TextArea from "./TextArea";
import { uploadImageApi } from "@apis";
import { formateFilenameToHash } from "@/utils/getFileHash";
import { createFormData } from "@/utils/createFormData";
import type { UploadImageOption } from "@blog/server";
import fullScreen from "@/utils/fullScreen";
const props = defineProps({
    isCanSend: {
        type: Boolean,
        required: true,
    },
    isCanChoseFile: {
        type: Boolean,
        default: false,
    },
    useTitle: {
        type: Boolean,
        default: false,
    },
});
defineEmits(["onSend"]);

let text = ref("");
const sendMarkdown = shallowRef<HTMLDivElement>();
const emojiBox = shallowRef<InstanceType<typeof EmojiBox>>(); // 通过组件实例暴露的isShowEmojiBox控制表情box的出现
const textarea = shallowRef<HTMLTextAreaElement | null>(null); // 获得文本框 通过原生方法进行补全等操作
let isPreview = ref(true); // 是否显示预览
let isAutoEnter = ref(true);

//todo 输入补全
let textArea: TextArea; // 用来操作textarea和text
nextTick(() => (textArea = new TextArea(textarea.value!, text)));
function inputFormat(e: KeyboardEvent) {
    switch (e.key) {
        case " ":
            //todo 如果空格前面是# 则阻止
            if (!props.useTitle && text.value[text.value.length - 1] == "#") {
                e.preventDefault();
                Message.error("别在这发标题啦~");
            }
            break;
        case "Tab":
            e.preventDefault();
            textArea.insert("    ");
            break;
        case '"':
        case "'":
        case "`":
            e.preventDefault();
            textArea.add(e.key);
            break;
        case "{":
            e.preventDefault();
            textArea.add("{", "}");
            break;
        case "(":
            e.preventDefault();
            textArea.add("(", ")");
            break;
        case "[":
            e.preventDefault();
            textArea.add("[", "]");
            break;
        case "Enter":
            if (isAutoEnter.value) {
                e.preventDefault();
                textArea.insert("  \n");
            }
            break;
        case "Backspace":
            {
                // 一键删除图片或链接
                const curCursor = textArea.cursorPoint();

                if (curCursor.start == curCursor.end) {
                    const type = textArea.removeType(curCursor.start - 1);

                    if (type) {
                        e.preventDefault();

                        const deleted = text.value.slice(type.end, curCursor.start);
                        text.value =
                            text.value.slice(0, type.end) +
                            text.value.slice(curCursor.start, text.value.length);
                    }
                }
            }
            break;
    }
}

//todo 表情插入
function insertEmoji(emoji: string) {
    textArea.insert(emoji);
}

const leftList = [
    {
        title: "插入表情",
        icon: "replyBox-emoji",
        func: () => (emojiBox.value!.isShowEmojiBox = !emojiBox.value!.isShowEmojiBox),
    },
    {
        title: "插入图片",
        icon: "replyBox-picture",
        async func() {
            try {
                const _file = new LocalFiles({
                    type: ["jpg", "png", "jpeg", "gif", "webp"],
                    maxSize: 5 * 1024,
                });
                await _file.getFile();
                const file = _file.files[0];

                const formData = createFormData<UploadImageOption>({
                    image: await formateFilenameToHash(file),
                });
                const { data } = await uploadImageApi(formData);
                textArea.insert(`![${file.name}](${data.imgSrc})`);
            } catch (e) {
                Message.error("图片上传失败");
            }
        },
    },
    {
        title: "插入代码块",
        icon: "replyBox-code",
        func: () => textArea.insert("\n\r```\n\n```"),
    },
    {
        title: "插入表格",
        icon: "replyBox-table",
        func: () => {
            textArea.insert("\n\r| 表头 | 表头 |\n| --- | --- |\n|  |  |");
        },
    },
];
const rightList = reactive([
    {
        title: computed(() => (isAutoEnter.value ? "自动换行开启中" : "自动换行关闭中")),
        icon: computed(() => (isAutoEnter.value ? "replyBox-enter" : "public-error")),
        func() {
            isAutoEnter.value = !isAutoEnter.value;
        },
    },
    {
        title: computed(() => (isPreview.value ? "关闭预览" : "开启预览")),
        icon: computed(() => (isPreview.value ? "replyBox-preview_close" : "replyBox-preview")),
        func() {
            isPreview.value = !isPreview.value;
        },
    },
    {
        title: "帮助",
        icon: "replyBox-help",
        func() {
            window.open("https://www.runoob.com/markdown/md-tutorial.html");
        },
    },
    {
        title: "全屏",
        icon: "replyBox-fullScreen",
        func() {
            sendMarkdown.value && fullScreen(sendMarkdown.value);
        },
    },
]);

defineExpose({ text, isPreview }); // 导出输入的源文本给父组件，让父组件发送ajax
</script>

<style lang="scss" scoped>
.sendMarkdown {
    $barHeight: 4rem;
    $borderRadius: 0.5rem;
    position: relative;
    box-sizing: border-box;
    border-radius: $borderRadius;
    border: 1px solid var(--color-border);
    .toolBar,
    .buttons {
        flex: 0 0 auto;
        height: $barHeight;
        width: 100%;
        background-color: var(--color-bg-bland);
        display: flex;
        align-items: center;
    }
    .toolBar {
        justify-content: space-between;
        border-start-start-radius: $borderRadius;
        border-start-end-radius: $borderRadius;
        border-bottom: 1px solid var(--color-border);
        .left,
        .right {
            margin: 0 1rem;
            display: flex;
            gap: $gap-xxlarge;
            .svgIcon {
                cursor: pointer;
                &:hover {
                    fill: var(--color-text-theme);
                }
            }
        }
    }
    .buttons {
        justify-content: space-between;
        border-end-start-radius: $borderRadius;
        border-end-end-radius: $borderRadius;
        border-top: 1px solid var(--color-border);
        .left,
        .right {
            display: flex;
            margin: 0 1.3rem;
            gap: $gap-large;
        }
    }
    .emojiBox {
        position: absolute;
        top: $barHeight;
        max-height: calc(100% - $barHeight * 2);
        overflow-y: scroll;
        width: 40%;
        @include mobile {
            width: 100%;
        }
    }
    .inputArea {
        height: calc(100% - $barHeight * 2 - 2px); // 2px是border的大小
        width: 100%;
        display: flex;
        textarea,
        &:deep(.markdown) {
            overflow-y: scroll;
            flex: 1;
            padding: 1.5rem 2rem;
            font-size: var(--fontsize-default);
            background-color: var(--color-bg-bland);
            color: var(--color-text-default);
            .markdownContent {
                padding: 0;
            }
        }
        &:deep(.markdown) {
            padding: 0 2rem;
        }

        @include mobile {
            flex-direction: column;
            textarea {
                border-bottom: 1px solid var(--color-border);
            }
        }
    }
}
</style>
