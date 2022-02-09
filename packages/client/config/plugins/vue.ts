import vue from "@vitejs/plugin-vue";

export default vue({
    template: {
        compilerOptions: {
            isCustomElement: (tag) => tag.startsWith("ce-"), // 自定义标签开头用`ce-`这样就不会抛错
        },
    },
});
