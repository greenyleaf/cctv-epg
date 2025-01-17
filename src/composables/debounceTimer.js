import {ref} from "vue";

/**
 * 一个去弹跳的计时器，150ms 默认。重复调用函数则重新开始计时。等待计时结束 then 回调
 */
export const useDebounceTimer = () => {
    let promise = null;
    let resolve;
    let reject;
    let promiseState = ref(false);
    let timer;

    const start = (duration = 150) => {
        if (promiseState.value) {
            // 清理计时器，重新计时
            clearTimeout(timer);
            timer = setTimeout(resolve, duration);
        } else {
            promise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
                promiseState.value = true;

                timer = setTimeout(resolve, duration);
            })
                .finally(() => promiseState.value = false);
        }

        return promise;
    };

    const stop = () => {
        clearTimeout(timer);
        reject && reject();
    };

    return {start, stop, state: promiseState};
};
