import { Message } from "sdt3";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
    onNeedRefresh() {
        Message.error("发现网站更新，请关闭该弹框运用更新", {
            duration: 0,
            style: {
                position: "fixed",
                right: "0",
                bottom: "0",
            },
            leaveTo: "right",
            onClose() {
                updateSW();
            },
        });
    },
    onOfflineReady() {
        Message.success("应用下载成功，现在可以离线进入了");
    },
    onRegisterError() {
        Message.error("应用下载失败");
    },
});
