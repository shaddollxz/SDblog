<template>
    <section class="changeAvatar gusto-flex-center-col">
        <div class="imgBox gusto-flex-center">
            <div class="originBox gusto-flex-center-col">
                <span class="chuyuan">原图</span>
                <ChoseImg ref="choseImg" :maxSize="5 * 1024">选择头像</ChoseImg>
                <span class="description chuyuan">只支持5MB以下的图片的上传</span>
            </div>
            <div class="previewBox gusto-flex-center-col">
                <span>预览</span>
                <div class="avatars gusto-flex-center">
                    <div class="gusto-avatarBox">
                        <img :src="choseImg?.dataUrl || userStore.avatars.avatar || $img.akarin" alt="" />
                    </div>
                    <div
                        class="gusto-frameBox canClick"
                        title="修改头像框"
                        @click="isShowChangeAvatarFrame = !isShowChangeAvatarFrame"
                    >
                        <img :src="choseImg?.dataUrl || userStore.avatars.avatar || $img.akarin" alt="" />
                        <img :src="$img.avatarFrame[avatars.avatarFrame]" alt="" />
                    </div>
                </div>
            </div>
        </div>
        <CheckButton :isCanClick="!!choseImg?.file" @onClick="uploadAvatar">上传头像</CheckButton>

        <ChangeAvatarFrame
            v-if="isShowChangeAvatarFrame"
            v-model:isShow="isShowChangeAvatarFrame"
        ></ChangeAvatarFrame>
    </section>
</template>

<script setup lang="ts">
import CheckButton from "@/components/CheckButton/index.vue";
import ChoseImg from "@/components/ChoseImg/index.vue";
import { useUserStore } from "@/store/user";
import { createFormData } from "@/utils/createFormData";
import { formateFilenameToHash } from "@/utils/getFileHash";
import { removeImageApi, uploadAvatarApi } from "@apis";
import type { UploadAvatarOption } from "@blog/server";
import { Message } from "sdt3";
const ChangeAvatarFrame = defineAsyncComponent(() => import("./ChangeAvatarFrame.vue"));
const userStore = useUserStore();
const avatars = toRef(userStore, "avatars");

const choseImg = shallowRef<InstanceType<typeof ChoseImg>>();
async function uploadAvatar() {
    if (choseImg.value?.file) {
        const avatar = await formateFilenameToHash(choseImg.value.file);
        const formData = createFormData<UploadAvatarOption>({
            avatar,
        });
        const { data } = await uploadAvatarApi(formData);
        userStore.updateUserInfo({ avatar: data.imgSrc });
    } else {
        Message.error("请选择图片");
    }
}

let isShowChangeAvatarFrame = ref(false);
</script>

<style lang="scss" scoped>
.changeAvatar {
    height: 100%;
    .imgBox {
        > div {
            padding: 2rem;
            span {
                margin-bottom: 2rem;
                &.description {
                    margin: 2rem 0;
                    font-size: var(--fontsize-small);
                    color: red;
                }
            }
        }
    }

    .choseImg {
        width: 20rem;
        height: 20rem;
    }
    .avatars {
        > div {
            width: 7rem;
            height: 7rem;
            margin: 0 0.5rem;
        }
    }
    .checkButton {
        margin-top: 1rem;
    }
    @include mobile {
        width: 90%;
        .imgBox {
            flex-direction: column;
            > div {
                padding: 0.5rem;
            }
        }
    }
}
</style>
