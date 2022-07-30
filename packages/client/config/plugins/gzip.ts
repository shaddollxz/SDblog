import viteCompression from "vite-plugin-compression";

export default viteCompression({
    filter: /\.(js|mjs|json|css|html|mtn)$/i,
    verbose: false,
});
