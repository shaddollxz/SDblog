<template>
    <div class="tagBox gusto-border">
        <p class="title xingyan">
            <SvgIcon name="blog-tag"></SvgIcon>
            <span>标签</span>
        </p>
        <NoData :show="!!tagStore.count">
            <div class="gusto-clearFloat">
                <div class="gusto-tagBox" v-for="tag of tagStore.tagList">
                    <RouterLink :to="{ path: '/search', query: { tag: tag._id } }">
                        {{ tag.value }}
                    </RouterLink>
                </div>
            </div>
        </NoData>
    </div>
</template>

<script lang="ts">
import NoData from "@/components/NoData/index.vue";
import { useTagStore } from "@/store/tags";
export default defineComponent({
    name: "tagBox",
    components: {
        NoData,
    },
    data() {
        return {
            tagStore: useTagStore(),
        };
    },
});
</script>

<style lang="scss" scoped>
.tagBox {
    box-sizing: border-box;
    padding: 1rem 1.25rem 0;
    .title {
        font-size: var(--fontsize-large);
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--color-border);
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        .svgIcon {
            width: var(--fontsize-large);
        }
    }

    .gusto-tagBox {
        float: left;
        margin-right: 1rem;
        margin-bottom: 1rem;
    }
}
</style>
