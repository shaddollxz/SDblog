import { defineStore } from "pinia";
import { getAllTagApi, addNewTagApi } from "@apis";
import type { TagInfo } from "@blog/server";

export const useTagStore = defineStore("tags", {
    state: (): { tagList: TagInfo[] } => ({
        tagList: [],
    }),
    getters: {
        count(): number {
            return this.tagList.length;
        },
    },
    actions: {
        getAllTag() {
            getAllTagApi().then(({ data }) => {
                console.log(data);
                this.$state.tagList = data;
            });
        },
        async addNewTag(tagValue: string) {
            const { data } = await addNewTagApi(tagValue);
            this.tagList.push(data);
            return data;
        },
    },
});
