import "vue";
import SvgIcon from "@/plugins/GlobalComponents/SvgIcon.vue";
import { RouterView, RouterLink } from "vue-router";

declare module "vue" {
    export interface GlobalComponents {
        SvgIcon: typeof SvgIcon;
        RouterView: typeof RouterView;
        RouterLink: typeof RouterLink;
    }
}

// sdt3的全局组件 从包的public中复制
declare module "vue" {
    export interface GlobalComponents {
        RollText: typeof import("sdt3/src/components/RollText/RollText.vue").default;
        LazyLoadBox: typeof import("sdt3/src/components/LazyLoadBox/LazyLoadBox.vue").default;
        Slider: typeof import("sdt3/src/components/Slider/Slider.vue").default;
        SplitPage: typeof import("sdt3/src/components/SplitPage/SplitPage.vue").default;
        SwitchButton: typeof import("sdt3/src/components/SwitchButton/SwitchButton.vue").default;
        CheckBox: typeof import("sdt3/src/components/CheckBox/CheckBox.vue").default;
        DropDown: typeof import("sdt3/src/components/DropDown/DropDown.vue").default;
    }
}
