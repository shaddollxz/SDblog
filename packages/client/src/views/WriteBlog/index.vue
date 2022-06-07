<template>
    <div class="writeBlog">
        <SendMarkdown
            ref="sendMarkdown"
            :isCanSend="!!sendMarkdown?.text"
            :isCanChoseFile="true"
            :isTitle="true"
            @onSend="onSend"
        >
            <template #leftBtn>
                <CheckButton @onClick="choseFile" :isCanClick="true">选择本地文件</CheckButton>
            </template>
        </SendMarkdown>

        <transition name="popup">
            <Popup
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

const sendMarkdown = shallowRef<InstanceType<typeof SendMarkdown> | null>(null);
function changeText(text: string) {
    sendMarkdown.value!.text = text;
}

let isShowPopup = ref(false);
function onSend() {
    isShowPopup.value = true;
}

async function choseFile() {
    const file = await new LocalFiles({ type: ["txt", "md"] });
    sendMarkdown.value!.text = (await file.read()) as string;
}
</script>

<style lang="scss" scoped>
.writeBlog {
    overflow: hidden;
}
.sendMarkdown {
    height: calc(100vh - $height-header);
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
