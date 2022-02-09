import svgIcon from "./SvgIcon.vue";

export default {
    install(app: App) {
        app.component("SvgIcon", svgIcon);
    },
};
