import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    test: {
        testTimeout: 10000,
        environment: "jsdom",
        include: ["**/tests/*.test.[jt]s?(x)"],
    },
});
