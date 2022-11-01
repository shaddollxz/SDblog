import * as Echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers"; // 渲染器
import { LabelLayout, UniversalTransition } from "echarts/features"; // 特性
import { PieChart, BarChart } from "echarts/charts"; // 图表
import type { PieSeriesOption } from "echarts/charts"; // 图表对应类型

Echarts.use([SVGRenderer, UniversalTransition, LabelLayout, PieChart, BarChart]);

export default Echarts;
export type ECOptions = Echarts.ComposeOption<PieSeriesOption>;

export function pieOption(data: object): ECOptions {
    return {
        type: "pie",
        series: [{ type: "pie", data: Object.keys(data).map((key) => ({ name: key, value: data[key] })) }],
    };
}
