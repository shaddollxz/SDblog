import formatTime from "./formatTime";
import formatNumber from "./formatNumber";
import img from "./img";

export default {
    install(app: App) {
        app.config.globalProperties.$formatTime = formatTime;
        app.config.globalProperties.$formatNumber = formatNumber;
        app.config.globalProperties.$img = img;
    },
};
