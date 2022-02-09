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
