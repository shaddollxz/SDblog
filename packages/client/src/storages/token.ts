export default {
    set(token: string) {
        window.localStorage.setItem("access_token", token);
    },
    get() {
        return window.localStorage.getItem("access_token");
    },
    remove() {
        window.localStorage.removeItem("access_token");
    },
};
