<template>
    <div class="popup" v-show="$props.isShowPopup">
        <h3>发布博客</h3>
        <div class="blogMsgForm">
            <section class="title">
                <p>
                    <span style="color: red">*</span>
                    标题：
                </p>
                <input type="text" v-model="title" placeholder="输入标题" />
            </section>
            <section class="tags">
                <p>标签：</p>
                <SelectInput
                    ref="selectInput"
                    :optionList="tagStore.tagList"
                    @addNewTag="addNewTag"
                ></SelectInput>
            </section>
            <section class="bg">
                <p>封面：</p>
                <div>
                    <ChoseImg ref="choseImg">选择图片</ChoseImg>
                    <CheckButton :isCanClick="!!choseImg?.data" @onClick="uploadImg">上传</CheckButton>
                </div>
            </section>
            <section class="description">
                <p>简介：</p>
                <textarea v-model="description"></textarea>
            </section>
        </div>
        <div class="buttons">
            <div class="gusto-button" @click="$emit('update:isShowPopup', false)">再改改</div>
            <CheckButton @onClick="sendBlog" :isCanClick="!!title">确定并发布</CheckButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import SelectInput from "./SelectInput.vue";
import CheckButton from "@/components/CheckButton/index.vue";
import ChoseImg from "@/components/ChoseImg/index.vue";
import { Message } from "sdt3";
import { writeBlogApi, uploadImageApi, updateBlogApi, blogDetailApi } from "@apis";
import type { TagInfo } from "@blog/server";
import { useTagStore } from "@/store/tags";
const tagStore = useTagStore();

const router = useRouter();
const route = useRoute();

interface Props {
    isShowPopup: boolean;
    content: string;
    changeContent: (value: string) => void;
}
const props = withDefaults(defineProps<Props>(), { content: "" });
const emit = defineEmits(["update:isShowPopup"]);

const blogId = route.query.edit as string;

let title = ref("");
const selectInput = shallowRef<typeof SelectInput | null>(null); // 标签
const choseImg = shallowRef<typeof ChoseImg | null>(null);
let description = ref("");
let imgSrc = ref("");

//todo 修改博客
onMounted(async () => {
    if (blogId) {
        const { data } = await blogDetailApi(blogId);
        title.value = data.title;
        props.changeContent(data.content!);
        for (const tag of data.tags) {
            selectInput.value!.selectedItems.push(tag);
        }
        choseImg.value!.imgData = data.headPic;
        description.value = data.description ?? "";
    }
});

const blogMsg = computed(() => {
    return {
        title: title.value,
        content: props.content,
        description: description.value,
        tags: selectInput.value?.selectedItems,
        headPic: imgSrc.value,
    };
});

function addNewTag(tagValue: string, cb: (newTag: TagInfo) => void) {
    tagStore.addNewTag(tagValue).then((newTag) => {
        cb(newTag);
    });
}

async function uploadImg() {
    try {
        const formData = new FormData();
        formData.append("image", choseImg.value!.data as unknown as File);
        const { data } = await uploadImageApi(formData);
        imgSrc.value = data.imgSrc;
        Message.success("图片上传成功");
    } catch (e) {
        Message.error("图片上传失败");
    }
}

async function sendBlog() {
    try {
        if (blogId) {
            await updateBlogApi(blogId, blogMsg.value);
        } else {
            await writeBlogApi(blogMsg.value);
        }
        emit("update:isShowPopup", false);
        Message.success("博客发送成功");
        router.push({ path: "/" });
    } catch {
        Message.error("发送失败");
    }
}
</script>

<style lang="scss" scoped>
.popup {
    height: calc(100vh -$height-header);
    box-sizing: border-box;
    padding: 0 1rem 1rem 2rem;
    position: absolute;
    top: $height-header;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--color-bg-deep);
    overflow-y: scroll;
    z-index: 20;
    h3 {
        font-size: var(--fontsize-xxlarge);
        margin: 2rem 0;
    }
    .blogMsgForm {
        section {
            margin-bottom: 2rem;
        }
        p {
            font-size: var(--fontsize-large);
            margin: 0 0 1.5rem 0;
        }
        .title {
            input {
                box-sizing: border-box;
                padding: 0.5rem 1rem;
                font-size: var(--fontsize-big);
            }
        }
        .tags {
            .selectInput {
                width: 100%;
            }
        }
        .bg {
            div {
                display: flex;
                align-items: flex-end;
                .checkButton {
                    height: max-content;
                    margin-left: 2rem;
                }
            }
        }
        .description {
            textarea {
                box-sizing: border-box;
                width: 100%;
                padding: 1rem 1.2rem;
                background-color: var(--color-bg-bland);
                color: var(--color-text-default);
            }
        }
    }

    .buttons {
        flex: 0 0 auto;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .checkButton {
            margin-left: 2rem;
            font-size: var(--fontsize-big);
        }
    }
}
</style>
