<template>
    <div class="writeBlog">
        <SendMarkdown
            ref="sendMarkdown"
            :isCanSend="!!sendMarkdown?.text"
            :isCanChoseFile="true"
            :useTitle="true"
            @onSend="onSend"
        >
            <template #leftBtn>
                <CheckButton @onClick="choseFile" :isCanClick="true">选择本地文件</CheckButton>
                <CheckButton @onClick="downloadAsFile" :isCanClick="true">下载</CheckButton>
            </template>
        </SendMarkdown>

        <transition name="popup">
            <Popup
                ref="popup"
                v-model:isShowPopup="isShowPopup"
                :content="sendMarkdown?.text"
                :changeContent="changeText"
            ></Popup>
        </transition>
    </div>
</template>

<script setup lang="ts">
import SendMarkdown from "@/components/SendMarkdown/index.vue";
import CheckButton from "@/components/CheckButton/index.vue";
import Popup from "./Popup.vue";
import { LocalFiles } from "sdt3";
import { download } from "@/utils/download";

const sendMarkdown = shallowRef<InstanceType<typeof SendMarkdown> | null>(null);
const popup = shallowRef<InstanceType<typeof Popup> | null>(null);
function changeText(text: string) {
    sendMarkdown.value!.text = text;
}

let isShowPopup = ref(false);
function onSend() {
    isShowPopup.value = true;
}

async function choseFile() {
    const file = new LocalFiles({ type: ["txt", "md"] });
    await file.getFile();
    sendMarkdown.value!.text = (await file.read(0)) as string;
}
function downloadAsFile() {
    download(`${popup.value?.title || Date.now()}.md`, sendMarkdown.value?.text || "");
}
</script>

<style lang="scss" scoped>
.writeBlog {
    overflow: hidden;
}
.sendMarkdown {
    height: calc(100vh - ($height-header + $gap-xlarge));
    :deep(.buttons) {
        .left {
            margin-left: $width-wife;
        }
    }
}
.popup {
    width: 50%;
    @include mobile {
        width: 100%;
    }
}

.popup-enter-active,
.popup-leave-active {
    transition: all 0.5s ease;
}
.popup-enter-from,
.popup-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>
