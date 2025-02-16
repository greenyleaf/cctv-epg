<script setup>

// const timer = useDebounceTimer();

import {curWeekdaysGen, renderProgrammeUrl} from "@/util/app-utils.js";
import {DateTime, Settings} from "luxon";
import {computed, nextTick, onBeforeMount, onUnmounted, ref, useTemplateRef} from "vue";
import {useStatefulFetch} from "@/composables/statefulFetch.js";
import LayoutListChannel from "@/layout/layout-list-channel.vue";
import EpgCalendar from "@/views/epg-view/epg-calendar.vue";
import EpgProgramme from "@/views/epg-view/epg-programme.vue";

Settings.defaultLocale = 'zh-CN';

const selDate = ref(DateTime.now().startOf('day'));
const selChannelId = ref('cctv1');
const epg = ref();
const filterEpgHandle = ref();
const programmeLayoutDom = useTemplateRef('programme-layout');

let appFetch = useStatefulFetch();

const curWeekdays = computed(() => curWeekdaysGen(selDate.value));

const getEpgHandler = () => {
  const noon = selDate.value.set({
    hour: 12,
  }).toUnixInteger();

  appFetch.statefulFetch(selChannelId.value, selDate.value.toFormat('yyyyMMdd'))
      .then(r => {
        const idx = r.list.findIndex(e => e.startTime >= noon);

        for (const i of r.list) {
          i.startTimeText = DateTime.fromSeconds(i.startTime).toLocaleString(DateTime.TIME_24_SIMPLE);
          i.link = renderProgrammeUrl(r.lvUrl, i.startTime, i.endTime);
        }

        epg.value = {
          lvUrl: r.lvUrl,
          amList: r.list.slice(0, idx),
          pmList: r.list.slice(idx)
        };

        clearTimeout(filterEpgHandle.value);
        filterEpg();
      })
      .then(() => {
        nextTick(() => {
          programmeLayoutDom.value
              .querySelector('[data-live-item]')
              ?.scrollIntoView({block: 'center'});
        });
      })
      .catch(reason => {
        // console.log(reason);
      });
};

const filterEpg = () => {
  if (!epg.value) {
    return;
  }

  const nowSec = Math.trunc(Date.now() / 1000);
  const replayStartSec = DateTime.now().startOf('day').plus({day: -6}).toSeconds();

  const setState = (item) => {
    if (item.endTime <= nowSec) {
      item.timeState = 'past';

      item.replay = item.startTime > replayStartSec;
    } else if (item.startTime <= nowSec) {
      item.timeState = 'live';

      // item.link = epg.value.lvUrl;
    } else {
      item.timeState = 'future';
    }

    item.replay ??= false;
  };

  for (const item of epg.value.amList) {
    setState(item);
  }
  for (const item of epg.value.pmList) {
    setState(item);
  }

  filterEpgHandle.value = setTimeout(filterEpg, 1000);
};

const selDateAction = (date) => {
  selDate.value = date;
  getEpgHandler();
};

const selChannelAction = (id) => {
  selChannelId.value = id;
  getEpgHandler();
};

onBeforeMount(() => {
  getEpgHandler();
});

onUnmounted(() => {
  clearTimeout(filterEpgHandle.value);
});

</script>

<template>
  <div class="epg-main">
    <div class="epg-date weekdays-container">
      <button v-for="w in curWeekdays" class="weekday-item" :class="{'weekday-item-cur': w.hasSame(selDate, 'day')}"
              @click="selDateAction(w)">
        <span class="text-center">{{ w.toFormat('EEEE') }}</span>
        <span class="text-center">{{ w.toISODate() }}</span>
      </button>

      <button class="cal-container">
        <span class="cal-btn-content">往日节目单</span>

        <epg-calendar :sel-date="selDate" @date-sel="selDateAction"/>
      </button>

    </div>

    <layout-list-channel class="layout-channels" @channel-sel="selChannelAction"
                         :sel-channel-id="selChannelId"></layout-list-channel>

    <div class="epg-guides" :class="{'epg-guides-fetching': appFetch.fetching.value}" ref="programme-layout">
      <div v-if="appFetch.error.value">网络遇到错误</div>

      <template v-if="epg && !appFetch.error.value">
        <div class="epg-period-title">上午 （00:00-12:00）</div>
        <epg-programme v-for="item in epg.amList" :item="item"
                       :data-live-item="item.timeState === 'live' ? '' : undefined" :live-url="epg.value?.lvUrl"/>

        <div class="epg-period-title">下午 （12:00-24:00）</div>
        <epg-programme v-for="item in epg.pmList" :item="item"
                       :data-live-item="item.timeState === 'live' ? '' : undefined" :live-url="epg.value?.lvUrl"/>

      </template>

    </div>
  </div>
</template>

<style>
.epg-main {
  /*margin: 0;*/
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  /*width: 100%;*/
  width: 1080px;

  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;
}

.epg-date {
  grid-column: 2 / 3;

  padding: 8px 0;
}

.layout-channels {
  grid-row: 2 / 3;

  width: 180px;
}

.epg-guides {
  overflow-y: auto;

  scrollbar-width: thin;
}

.weekdays-container {
  display: flex;
  gap: 12px;

  align-items: stretch;
}

.weekday-item {
  border: none;
  border-radius: 8px;

  background: none;

  padding: 4px 6px;

  display: flex;
  flex-direction: column;

  font-size: 14px;

  cursor: pointer;
}

.weekday-item:hover, .weekday-item-cur, .cal-container:hover .cal-btn-content, .cal-container:focus-within .cal-btn-content {
  background-color: yellowgreen;
}

.cal-container {
  border: none;
  background: none;
  padding: 0;

  position: relative;

  display: flex;
  align-items: stretch;
}

.cal-btn-content {
  display: flex;
  align-items: center;

  border-radius: 8px;
  padding: 4px 6px;

  font-size: 14px;
}

@keyframes anim-guides-fetching {
  to {
    /*background-position-y: 67.88225px;*/
    background-position-y: 0;
  }
}

.epg-guides-fetching {
  /*pointer-events: none;
  filter: blur(2px) brightness(80%) sepia(40%);*/

  background: repeating-linear-gradient(-60deg, floralwhite, antiquewhite 24px, floralwhite 48px);
  background-size: 100% 200%;
  /*background-position-y: -67.88225px;*/
  background-position-y: -96px;

  animation: anim-guides-fetching .25s infinite linear;
}

.epg-period-title {
  padding: 14px 24px;

  background-color: whitesmoke;

  font-size: 18px;
}

</style>
