import type { TimeLineItemInfo } from "@blog/server";
import { SDDate, isEmpty } from "sdt3";

interface Content {
    _id: string;
    title: string;
    createdAt: string;
}

interface MonthItem {
    [month: string]: Content[];
}
interface TimeLine {
    [year: `${number}年`]: MonthItem;
}

export default function (data: TimeLineItemInfo[]) {
    let timeLine: TimeLine = {};

    data.forEach((item) => {
        const createdAt = new SDDate(item.createdAt);
        const year = createdAt.getFullYear() + "年";
        const month = createdAt.getmonth(true);
        const content: Content = {
            _id: item._id,
            title: item.title,
            createdAt: createdAt.format("/MM/-/DD/"),
        };

        if (timeLine[year]) {
            if (timeLine[year][month]) {
                timeLine[year][month].push(content);
            } else {
                timeLine[year][month] = [content];
            }
        } else {
            timeLine[year] = {
                [month]: [content],
            };
        }
    });

    return isEmpty(timeLine) ? null : timeLine;
}
