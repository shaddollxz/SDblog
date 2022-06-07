<template>
    <div class="tagBox gusto-border">
        <p class="xingyan">
            <i class="iconfont icon-biaoqian"></i>
            <span>标签</span>
        </p>
        <div v-if="tagStore.count" class="gusto-clearFloat">
            <div class="gusto-tagBox" v-for="tag of tagStore.tagList">
                <RouterLink :to="{ path: '/search', query: { tag: tag._id } }">
                    {{ tag.value }}
                </RouterLink>
            </div>
        </div>
        <NoData v-else></NoData>
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
    padding: 1rem 1.25rem 0 1.25rem;
    p {
        font-size: var(--fontsize-large);
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--color-border);
        margin-top: 0.5rem;
        i {
            font-size: var(--fontsize-large);
        }
    }

    .gusto-tagBox {
        float: left;
        margin-right: 1rem;
        margin-bottom: 1rem;
    }
}
</style>
