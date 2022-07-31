<template>
    <div class="folderControl">
        <Popover directive="bs" v-model="isShowUploader">
            <div class="gusto-button">
                <SvgIcon name="pan-addFile"></SvgIcon>
                <span class="canClick">上传文件</span>
            </div>
            <template #popup>
                <FileUploader
                    @onChosedFile="isShowUploader = true"
                    @onBeginUpload="isShowUploader = false"
                ></FileUploader>
            </template>
        </Popover>
        <Popover v-model="isShowCreateFolder">
            <div class="gusto-button">新建文件夹</div>
            <template #popup>
                <div class="createFolder">
                    <span>文件夹名：</span>
                    <input type="text" v-model="folderName" @keypress.enter="createFolder" />
                    <div class="ensure">
                        <div class="gusto-button" @click="createFolder">确认</div>
                        <div
                            class="gusto-button"
                            @click="() => ((folderName = ''), (isShowCreateFolder = false))"
                        >
                            取消
                        </div>
                    </div>
                </div>
            </template>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import Popover from "@/components/Popover/index.vue";
import { usePanStore } from "@/store/pan";
import FileUploader from "./FileUploader/index.vue";

const panStore = usePanStore();

const isShowCreateFolder = ref(false);
const isShowUploader = ref(false);

const folderName = ref("");
function createFolder() {
    if (folderName.value) {
        panStore.createFolder(folderName.value);
        folderName.value = "";
        isShowCreateFolder.value = false;
    }
}
</script>

<style lang="scss" scoped>
.folderControl {
    display: flex;
    gap: $gap-big;
    .fileUploader {
        width: 30vw;
        height: 30rem;
    }
    .createFolder {
        .ensure {
            display: flex;
            gap: $gap;
            width: max-content;
            margin: 0.4rem 0 0 auto;
        }
    }
}
</style>
