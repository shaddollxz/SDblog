import { usePanStore } from "@/store/pan";
import { SDDate, Message } from "sdt3";
import { downloadFileApi } from "@apis";
import { downloadWithFetch } from "@/utils/download";
import { DownloadFileTypeEnum } from "@blog/server";

export let isMulti = ref(false);

export function updateIsMulti(state?: boolean) {
    clearChosed();
    if (state === undefined) {
        isMulti.value = !isMulti.value;
    } else {
        isMulti.value = state;
    }
}

const files: { _id: string; hash: string; name: string }[] = [];
const folders: { id: string; name: string }[] = [];
export const filesState = ref<Record<string, boolean>>({});
export const foldersState = ref<Record<string, boolean>>({});
watch(
    () => usePanStore().currentPath,
    () => {
        const panStore = usePanStore();
        filesState.value = {};
        foldersState.value = {};
        if (panStore.currentFolder.files) {
            for (const file of panStore.currentFolder.files) {
                filesState.value[file._id] = false;
            }
        }
        if (panStore.currentFolder.folders) {
            for (const folder of panStore.currentFolder.folders) {
                foldersState.value[folder.id] = false;
            }
        }
    }
);

export function choseAll() {
    const currentFolder = usePanStore().currentFolder;
    if (
        files.length == (currentFolder.files ? currentFolder.files.length : 0) &&
        folders.length == (currentFolder.folders ? currentFolder.folders.length : 0)
    ) {
        // 当前全部都选中
        clearChosed();
    } else {
        // 当前有没有选中的
        clearChosed();
        currentFolder.files && files.push(...currentFolder.files);
        currentFolder.folders && folders.push(...currentFolder.folders);
        for (let key in filesState.value) {
            filesState.value[key] = true;
        }
        for (let key in foldersState.value) {
            foldersState.value[key] = true;
        }
    }
}
export function folderStateChange(state: boolean, key: string, name: string) {
    if (state) {
        folders.push({ id: key, name });
        foldersState.value[key] = true;
    } else {
        // prettier-ignore
        folders.splice(folders.findIndex((item) => item.id == key), 1);
        foldersState.value[key] = false;
    }
}
export function fileStateChange(state: boolean, key: string, name: string, _id: string) {
    if (state) {
        files.push({ hash: key, name, _id });
        filesState.value[key] = true;
    } else {
        // prettier-ignore
        files.splice(files.findIndex((item) => item.hash == key), 1);
        filesState.value[key] = false;
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
    files.length && (await panStore.removeFile(files.map((item) => item._id)));
    folders.length && (await panStore.removeFolder(folders.map((item) => item.name)));
    clearChosed();
}

function clearChosed() {
    files.length = 0;
    folders.length = 0;
    for (let key in filesState.value) {
        filesState.value[key] = false;
    }
    for (let key in foldersState.value) {
        foldersState.value[key] = false;
    }
}
