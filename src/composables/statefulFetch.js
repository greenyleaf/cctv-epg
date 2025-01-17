import {ref} from "vue";
import {epgApiGet} from "@/api/cctv-api.js";

/**
 * 返回 ajax 请求结果的错误状态，响应式的获取内容，方便在 promise 调用
 * date: yyyyMMdd
 */
export const useStatefulFetch = () => {
    const fetching = ref(false);
    const error = ref(false);

    let abortCon;
    let epgInfo = ref(null);

    const statefulFetch = (channel, date) => {
        abortCon?.abort();
        abortCon = new AbortController();

        fetching.value = true;
        error.value = false;
        return epgApiGet(channel, date, {signal: abortCon.signal})
            .finally(() => {
                fetching.value = false;
            })
            .then(epgResult => {
                epgInfo.value = epgResult;

                return Promise.resolve(epgResult);
            })
            .catch(ex => {
                // console.log('epgApiGet catch entered', ex);
                error.value = true;

                return Promise.reject(ex);
            });
    };

    return {
        fetching,
        error,
        statefulFetch,
        epgInfo,
    };
};
