import { usePanStore } from "@/store/pan";
import { SDDate, Message } from "sdt3";
import { downloadFileApi } from "@apis";
import { downloadWithFetch } from "@/utils/download";
import { DownloadFileTypeEnum } from "@blog/server";

export let isMulti = ref(false);

export function updateIsMulti(state?: boolean) {
    if (state === undefined) {
        isMulti.value = !isMulti.value;
    } else {
        isMulti.value = state;
    }
    if (!isMulti.value) {
        clearChosed();
    }
}

const files: { _id: string; hash: string; name: string }[] = [];
const folders: { id: string; name: string }[] = [];

export function folderStateChange(state: boolean, key: string, name: string) {
    if (state) {
        folders.push({ id: key, name });
    } else {
        // prettier-ignore
        folders.splice(folders.findIndex((item) => item.id == key), 1);
    }
}
export function fileStateChange(state: boolean, key: string, name: string, _id: string) {
    if (state) {
        files.push({ hash: key, name, _id });
    } else {
        // prettier-ignore
        files.splice(files.findIndex((item) => item.hash == key), 1);
    }
}

export async function downloadMulti() {
    const panStore = usePanStore();
    const intervalFunc = await panStore.zipFolder({ folders, files });
    clearChosed();
    const interval = window.setInterval(async () => {
        const { data } = await intervalFunc();
        if (data.hash) {
            window.clearInterval(interval);
            Message.success("开始下载文件：" + SDDate.formatNow() + ".zip");
            const res = await downloadFileApi({ hash: data.hash, type: DownloadFileTypeEnum.folder });
            downloadWithFetch(SDDate.formatNow() + ".zip", res);
        }
    }, 800);
}

export async function removeMulti() {
    const panStore = usePanStore();
    await panStore.removeFile(files.map((item) => item._id));
    await panStore.removeFolder(folders.map((item) => item.name));
    clearChosed();
}

function clearChosed() {
    files.length = 0;
    folders.length = 0;
}
