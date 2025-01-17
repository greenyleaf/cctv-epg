import {DateTime} from "luxon";

/**
 * 生成当前星期的日期数组
 */
export const curWeekdaysGen = (d) => {
    const iter = d.startOf('week');

    const arr = [];
    for (let i = 0; i < 7; i++) {
        arr.push(iter.plus({day: i}));
    }

    return arr;
};

export const calWeekdaysGen = (startMonth) => {
    const resMonthWeeks = {};

    let ym;
    // const validStart = DateTime.now().plus({day: -27});
    // const validStart = DateTime.now().plus({month: -1}).startOf('month');
    const validStart = DateTime.now().plus({month: -3, day: 1}).startOf('day');
    // const validEnd = DateTime.now().plus({day: 6});
    const validEnd = DateTime.now().plus({week: 1}).endOf('week').startOf('day');

    // const start = validEnd.plus({month: -1}).startOf('month');
    // const end = validEnd.endOf('month');

    startMonth ??= validEnd.plus({month: -1});
    const start = startMonth.startOf('month');
    const end = startMonth.plus({month: 1}).endOf('month');

    // for (let d = validStart.startOf('month'); d <= end; d = d.plus({day: 1})) {
    for (let d = start; d <= end; d = d.plus({day: 1})) {
        ym = d.toFormat('yyyy-MM');
        if (!resMonthWeeks[ym]) {
            resMonthWeeks[ym] = [...new Array(d.weekday - 1)];
        }
        // d.valid = d >= validStart && d <= validEnd;
        d.valid = d >= validStart && d <= validEnd;
        resMonthWeeks[ym].push(d);
    }

    return resMonthWeeks;
};

/**
 * 月份牌；前27天后6天所在的月份
 */
export const calendarItemsGen = () => {
    const today = DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0});
    const start = today.minus({day: 27});
    const end = today.plus({day: 6});
    const calStart = start.startOf('month');
    const calEnd = end.endOf('month');

    const months = {}; // { '2023-10': [ [Mon ... Sun], [ ~~ ] ], ~~ }
    let weeks;
    let week = [];
    let monthIter;

    for (monthIter = calStart; monthIter.diff(calEnd, 'month').months <= 0; monthIter = monthIter.plus({month: 1})) {
        weeks = [];
        week = [];
        weeks.push(week);
        months[monthIter.toFormat('yyyy年MM月')] = weeks;

        const endOfMonth = monthIter.endOf('month');
        for (let dateIter = monthIter; dateIter.diff(endOfMonth, 'day').days <= 0; dateIter = dateIter.plus({day: 1})) {
            if (dateIter.weekday === 1) {
                // 新的循环
                // 月份的第一周，补齐一周空白日子
                if (week.length && week.length < 7) {
                    week.unshift(...new Array(7 - week.length));
                }

                week = [];
                weeks.push(week);
            }

            week.push({
                in: dateIter.diff(start, 'day') >= 0 && dateIter.diff(end, 'day') <= 0,
                text: dateIter.day,
                key: dateIter.toFormat('yyyyMMdd'),
                isToday: dateIter.diff(today, 'day').days === 0,
                date: dateIter.toISODate()
            });
        }
    }

    return months;
};

export const renderPlaybackUrl = (lvUrl, start, end) => {
    return `${lvUrl}/?stime=${start}&etime=${end}&type=lbacks`;
};

