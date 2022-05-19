<template>
    <div class="emojiBox" v-hidden="isShowEmojiBox">
        <div class="themes">
            <span
                v-for="(name, key) of EmojiList"
                :class="{ chosed: currentEmojiList == key }"
                @click="currentEmojiList = key"
            >
                {{ name }}
            </span>
        </div>
        <div class="imgBox" v-fill>
            <div
                class="img"
                v-for="emoji of emojis[currentEmojiList]"
                @click="$emit('insertEmoji', emoji.content), (isShowEmojiBox = !isShowEmojiBox)"
            >
                <img :src="emoji.src" alt="" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { noahBaseUrl } from "@/utils/markdownExtend";

defineEmits(["insertEmoji"]);

let isShowEmojiBox = ref(false);

//todo 从这里选择表情列表
const EmojiList = { noah: "诺亚幻想" } as const;

interface EmojiItem<T extends string> {
    src: string;
    content: `:${T}-${string}:`;
}
type Emojis = {
    [K in keyof typeof EmojiList]?: EmojiItem<K>[];
};
const emojis = reactive<Mutable<Emojis>>({});
let currentEmojiList = ref<keyof typeof EmojiList>("noah");

//todo 诺亚表情列表
emojis.noah = [];
for (let i = 1; i <= 59; i++) {
    let order = i < 10 ? "0" + i : "" + i;
    emojis.noah.push({ src: noahBaseUrl + order + ".png", content: `:noah-${order}:` });
}

//todo emoji列表

defineExpose({ isShowEmojiBox });
</script>

<style lang="scss" scoped>
.emojiBox {
    box-sizing: border-box;
    padding: 0.5rem 0.9rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    background-color: var(--color-bg-deep);
    .themes {
        height: max-content;
        font-size: var(--fontsize-small);
        border-bottom: 1px solid var(--color-border);
        padding-bottom: 0.2rem;
        span {
            &.chosed {
                background-color: var(--color-bg-bland);
                color: var(--color-text-theme);
            }
        }
    }
    .imgBox {
        .img {
            width: 2.8rem;
            height: 2.8rem;
            margin-top: 0.4rem;
            img {
                width: 100%;
                cursor: pointer;
            }
        }
    }
}
</style>
