<template>
    <section class="changeAvatar gusto-flex-center">
        <div class="imgBox gusto-flex-center">
            <div class="originBox gusto-flex-center">
                <span>原图</span>
                <ChoseImg ref="choseImg" :maxSize="5 * 1024">选择头像</ChoseImg>
                <span class="description">只支持5MB以下的图片的上传</span>
            </div>
            <div class="previewBox gusto-flex-center">
                <span>预览</span>
                <div class="avatars gusto-flex-center">
                    <div class="gusto-avatarBox">
                        <img :src="choseImg?.imgData || userStore.avatars.avatar || $img.akarin" alt="" />
                    </div>
                    <div
                        class="gusto-frameBox"
                        style="cursor: pointer"
                        title="修改头像框"
                        @click="isShowChangeAvatarFrame = !isShowChangeAvatarFrame"
                    >
                        <img :src="choseImg?.imgData || userStore.avatars.avatar || $img.akarin" alt="" />
                        <img :src="$img.avatarFrame[avatars.avatarFrame]" alt="" />
                    </div>
                </div>
            </div>
        </div>
        <CheckButton :isCanClick="!!choseImg?.data" @onClick="uploadAvatar">上传头像</CheckButton>

        <ChangeAvatarFrame
            v-if="isShowChangeAvatarFrame"
            v-model:isShow="isShowChangeAvatarFrame"
        ></ChangeAvatarFrame>
    </section>
</template>

<script setup lang="ts">
import ChoseImg from "@/components/ChoseImg/index.vue";
import CheckButton from "@/components/CheckButton/index.vue";
import { uploadAvatarApi, updateUserInfoApi } from "@apis";
import { useUserStore } from "@/store/user";
const ChangeAvatarFrame = defineAsyncComponent(() => import("./ChangeAvatarFrame.vue"));
const userStore = useUserStore();
const avatars = toRef(userStore, "avatars");

const choseImg = shallowRef<typeof ChoseImg | null>(null);
async function uploadAvatar() {
    const formData = new FormData();
    formData.append("avatar", choseImg.value!.data as unknown as File);
    const { data } = await uploadAvatarApi(formData);
    const res = await updateUserInfoApi({ avatar: data.imgSrc });
    userStore.refreshUserInfo(res.data.userData);
}

let isShowChangeAvatarFrame = ref(false);
</script>

<style lang="scss" scoped>
.changeAvatar {
    height: 100%;
    flex-direction: column;
    .imgBox {
        > div {
            padding: 2rem;
            flex-direction: column;
            span {
                margin-bottom: 2rem;
                font-family: "chuyuan";
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
    @media screen and (max-width: 750px) {
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
