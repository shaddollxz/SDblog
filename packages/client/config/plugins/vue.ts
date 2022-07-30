import vue from "@vitejs/plugin-vue";

// https://github.com/vitejs/vite/tree/main/packages/plugin-vue
export default vue({
    template: {
        compilerOptions: {
            isCustomElement: (tag) => tag.startsWith("ce-"), // 自定义标签开头用`ce-`这样就不会抛错
        },
        // 组件 html元素 等需要直接引用静态资源时在这配置 图片等都默认配置了
        transformAssetUrls: {
            // img: ["src"],
        },
    },
});
