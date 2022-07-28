<template>
    <div class="pan">
        <div class="head">
            <Popover directive="bs" v-model="isShowUploader">
                <div class="gusto-button">
                    <SvgIcon name="pan-addFile"></SvgIcon>
                    <span>上传文件</span>
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
        <Breadcrumb></Breadcrumb>
        <Folder></Folder>
    </div>
</template>

<script setup lang="ts">
import Popover from "@/components/Popover/index.vue";
import { usePanStore } from "@/store/pan";
import Breadcrumb from "./Breadcrumb.vue";
import FileUploader from "./FileUploader/index.vue";
import Folder from "./Folder.vue";

const panStore = usePanStore();
onMounted(() => panStore.getFolder());

const isShowCreateFolder = ref(false);
const isShowUploader = ref(false);

const folderName = ref("");
function createFolder() {
    panStore.createFolder(folderName.value);
    folderName.value = "";
    isShowCreateFolder.value = false;
}
</script>

<style lang="scss" scoped>
.pan {
    margin-left: $width-wife;
}
.head {
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
