import { isMobile } from "sdt3";

export default isMobile || window.document.documentElement.clientWidth < 750;
