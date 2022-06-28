<template>
    <section class="userMsg">
        <div class="name">
            <span>用户名：</span>
            <div>
                <input ref="input" type="text" v-model="name" :readonly="!isEdit" />
                <SvgIcon name="public-edit" @click="editName"></SvgIcon>
            </div>
        </div>
        <div>
            <span>邮箱：</span>
            <span>
                {{ email }}
            </span>
        </div>
        <CheckButton :isCanClick="!!name" @onClick="updateUserInfo">&nbsp;修改&nbsp;</CheckButton>
    </section>
</template>

<script setup lang="ts">
import CheckButton from "@/components/CheckButton/index.vue";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const isEdit = ref(false);
const input = shallowRef<HTMLInputElement | null>(null);
const { name, email } = toRefs(userStore.userInfo);

function editName() {
    isEdit.value = !isEdit.value;
    input.value!.focus();
}

function updateUserInfo() {
    const userData = { name: name!.value };
    userStore.updateUserInfo(userData);
}
</script>

<style lang="scss" scoped>
.userMsg {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: var(--fontsize-large);
    .name {
        margin-bottom: 2rem;
        div {
            display: inline;
            .svgIcon {
                margin-left: 1rem;
                width: var(--fontsize-large);
                height: var(--fontsize-large);
            }
        }
    }
    .checkButton {
        margin-top: 3rem;
    }
}
</style>
