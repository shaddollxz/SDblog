<template>
    <div class="markdown">
        <article v-show="!loading" class="markdownContent" v-html="html"></article>
        <Loading v-if="loading"></Loading>
    </div>
</template>

<script setup lang="ts">
import Loading from "../Loading/index.vue";
import ParseWorker from "./parse.worker?worker"; //用webworker解析markdown

interface Props {
    markdown?: string;
    isLoading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
});

let html = ref("");
let loading = ref(props.isLoading);
const parseWorker = new ParseWorker();

watchEffect(() => {
    parseWorker.postMessage(props.markdown);
});
parseWorker.onmessage = ({ data }: { data: { content: string; loadingTime: number } }) => {
    html.value = data.content;
    setTimeout(() => {
        props.isLoading ? (loading.value = false) : null;
    }, data.loadingTime);
};

defineExpose({ html });
</script>

<style lang="scss">
@import "@/style/markdown/markdown.scss";
@import "@/style/markdown/hightLight.css";
@import "highlight.js/styles/atom-one-dark.css";
.loading {
    margin: 4rem 0;
}
</style>
