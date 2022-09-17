<template>
    <div class="checkInput">
        <div class="input">
            <input
                :class="ispwd ? 'ispwd' : ''"
                :type="ispwd && pwdstate ? 'password' : 'text'"
                v-model.trim="data"
                @keyup="checkInputDebounce"
                v-bind="$attrs"
            />
            <div class="icon" v-if="ispwd" @click="pwdstate = !pwdstate">
                <SvgIcon v-show="pwdstate" name="replyBox-preview_close"></SvgIcon>
                <SvgIcon v-show="!pwdstate" name="replyBox-preview"></SvgIcon>
            </div>
        </div>
        <div class="checkTip error" v-show="error">
            <SvgIcon name="public-error"></SvgIcon>
            <span>{{ error }}</span>
        </div>
        <div class="checkTip correct" v-show="data && !error">
            <SvgIcon name="public-correct"></SvgIcon>
            <span>验证通过</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { debounce, Validator } from "sdt3";
import type { CheckRules } from "./index";

interface Props {
    ispwd?: boolean;
    check: CheckRules[];
}
const props = withDefaults(defineProps<Props>(), {
    ispwd: false,
});

let pwdstate = ref(true);

const data = ref(""); // 输入框中的数据
const error = ref(""); // 输入出错时报错的提示
const validator = new Validator(data.value);
for (const rule of props.check) {
    if (typeof rule[0] == "string") {
        if (rule[2]) {
            // @ts-ignore
            validator[rule[0]](rule[1]).errorMsg(rule[2]);
        } else {
            // @ts-ignore
            validator[rule[0]](rule[1]);
        }
    } else {
        validator.addCheck(...(rule as Validator.CheckRule));
    }
}

// 触发键盘输入时执行检查
let passCheckData = ref<string | null>(null);
function checkInput() {
    try {
        validator.data = data.value;
        validator.check();
        // 通过检查
        error.value = "";
        passCheckData.value = data.value;
    } catch (e: any) {
        // 没通过检查
        error.value = e.errorMsg[0];
        passCheckData.value = null;
    }
}
// 设置防抖
const checkInputDebounce = debounce(checkInput, 600, false);

defineExpose({ passCheckData }); //? 由组件将数据抛出 父组件直接获取经过验证的数据 如果没通过检测 数据为null
</script>

<style lang="scss" scoped>
.checkInput {
    --h: 2rem;
    position: relative;
    .svgIcon {
        width: var(--fontsize-tiny);
    }
    .input {
        display: flex;
        align-items: center;
        position: relative;
        input {
            width: 100%;
            height: var(--h);
            padding: 0.1rem 0.4rem;
            &.ispwd {
                padding-right: 3.5rem;
            }
        }
        .icon {
            position: absolute;
            right: 1rem;
            height: var(--fontsize-default);
            width: var(--fontsize-default);
            .svgIcon {
                width: inherit;
            }
        }
    }
    .checkTip {
        display: flex;
        align-items: center;
        position: absolute;
        top: calc(var(--h) + 0.2rem + 0.3rem); // 有0.2rem是Input的padding
        font-size: var(--fontsize-tiny);
    }
    .error {
        color: var(--color-error);
        fill: var(--color-error);
    }
    .correct {
        color: var(--color-primary);
        fill: var(--color-primary);
    }
}
</style>
