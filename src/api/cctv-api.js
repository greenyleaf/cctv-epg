import axios from "axios";

/**
 * c=channel2,channel2
 * */
export const epgApiGet = async (channel, date, options) => {
    if (channel) {
        const obj = await axios.get(`https://api.cntv.cn/epg/getEpgInfoByChannelNew?c=${channel}&serviceId=tvcctv&d=${date}`, options);
        if (obj.data?.errcode) {
            throw new Error(obj.data?.errcode);
        }
        return obj.data?.data?.[channel] ?? null;
    }
};

/*
 * 字段，空字符串，表示没有内容
 * 回放地址例子
 * lvUrl http页面地址
 * isLive  当前播放节目名称,
 * liveSt  (当前节目开始时间, 毫秒),
 * channelName
 * list[0].title, startTime, endTime (unix秒), showTime (开播时间，字符串，时分), length (秒), column_url: '', columnBackvideourl: '' (不用这个)
 * https://tv.cctv.com/live/cctv1
 * (.lvUrl '?' ...)
 * https://tv.cctv.com/live/cctv1?stime=1698431155&etime=1698431445&type=lbacks
 */

/*
 * date, 范围，包括今天在，以及之前的 27 天 / 之前 3 个月的第 1 天，到今天之后的 6 天
 */
