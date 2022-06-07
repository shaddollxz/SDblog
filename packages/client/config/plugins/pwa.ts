import { VitePWA } from "vite-plugin-pwa";

export default VitePWA({
    workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,jpg,png,ttf,woff2,moc,mtn,json}"], // 缓存的文件后缀
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 缓存的文件最大大小 这里是5M
    },
    manifest: {
        lang: "zh",
        start_url: "https://www.shaddollxz.space/", // 必须在这个url下才能安装 不写是当前网页的路径
        name: "影依贤者的博客",
        short_name: "博客",
        description: "个人博客",
        theme_color: "#22272e",
        background_color: "#22272e",
        icons: [
            {
                src: "logo-192x192.png", // 相对打包后的index.html
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "logo-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "logo-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
        ],
    },
});
