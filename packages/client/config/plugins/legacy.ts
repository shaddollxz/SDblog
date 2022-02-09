import legacy from "@vitejs/plugin-legacy";

export default legacy({
    targets: ["defaults", "not IE 11"],
});
