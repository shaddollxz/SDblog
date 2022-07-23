import jsx from "@vitejs/plugin-vue-jsx";

export default jsx({
    isCustomElement: (tag) => tag.startsWith("ce-"), // 自定义标签开头用`ce-`这样就不会抛错
});
