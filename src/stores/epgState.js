import {ref} from 'vue';
import {defineStore} from 'pinia';

export const useEpgStateStore = defineStore('epgState', () => {
    const onMobile = ref(false);

    const setOnMobile = (state) => {
        onMobile.value = !!state;
    };

    return {onMobile, setOnMobile};
});
