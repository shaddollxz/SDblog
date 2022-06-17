export default function (el: HTMLElement) {
    if (!document.fullscreenEnabled) return;

    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        el.requestFullscreen();
    }
}
