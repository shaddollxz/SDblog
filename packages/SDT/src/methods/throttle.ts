/**
 * 节流：每次时间间隔内只触发一次回调
 * @param callback 执行的回调函数
 * @param delay 时间间隔 默认500ms
 * @param style 默认为true true为第一次触发时触发回调 false为最后次触发后等待时间后触发回调
 */
export default function throttle<T extends unknown[]>(
    callback: (...arg: T) => unknown,
    delay = 500,
    style = true
) {
    let timeoutId: number | undefined = void 0;
    if (style) {
        return function (this: any, ...args: T) {
            if (!timeoutId) {
                callback.apply(this, args);
                timeoutId = window.setTimeout(() => {
                    timeoutId = void 0;
                }, delay);
            }
        };
    } else {
        return function (this: any, ...args: T) {
            if (!timeoutId) {
                timeoutId = window.setTimeout(() => {
                    timeoutId = void 0;
                    callback.apply(this, args);
                }, delay);
            }
        };
    }
}
