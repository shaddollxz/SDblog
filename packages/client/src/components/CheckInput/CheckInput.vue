<template>
    <div class="checkInput">
        <div class="input">
            <input
                :class="ispwd ? 'ispwd' : ''"
                :type="ispwd && state ? 'password' : 'text'"
                v-model.trim="data"
                @keyup="checkInputDebounce"
                v-bind="$attrs"
            />
            <i v-if="ispwd" :class="`iconfont icon-yanjing_${iconState}`" @click="state = !state"></i>
            <span>
                <i v-show="data && !error" class="iconfont icon-zhengquetishi"></i>
            </span>
        </div>
        <div class="error" v-show="error">
            <i class="iconfont icon-cuowutishi"></i>
            <span>{{ error }}</span>
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

let state = ref(true);
let iconState = computed(() => (state.value ? "xianshi" : "yincang"));

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
    --mb: 1.7rem;
    --h: 2rem;
    position: relative;
    margin-bottom: var(--mb);
    .input {
        display: flex;
        align-items: center;
        position: relative;
        input {
            width: 100%;
            height: var(--h);
            padding: 0.1rem 0.4rem;
            &:focus-visible {
                + i {
                    color: var(--color-text-theme);
                }
            }
            &.ispwd {
                padding: 0.1rem 3.5rem 0.1rem 0.4rem;
            }
        }
        > i {
            position: absolute;
            right: 1rem;
            &::before {
                font-size: 1.5rem !important;
            }
        }
        span {
            position: absolute;
            right: -2rem;
            .icon-zhengquetishi {
                color: var(--color-primary);
            }
        }
    }
    .error {
        color: var(--color-error);
        position: absolute;
        top: calc(var(--h) + 0.2rem + 0.3rem); // 有0.2rem是Input的padding
        font-size: var(--fontsize-tiny);
        i {
            font-size: var(--fontsize-tiny);
        }
    }
}
</style>
