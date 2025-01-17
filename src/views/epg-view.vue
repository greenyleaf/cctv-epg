<script setup>

// const timer = useDebounceTimer();
// const appFetch = useStatefulFetch();

import {calWeekdaysGen, curWeekdaysGen, renderPlaybackUrl} from "@/util/app-utils.js";
import {DateTime, Settings} from "luxon";
import {channels, weekdays} from "@/util/app-constants.js";
import {computed, nextTick, ref, useTemplateRef} from "vue";
import {useStatefulFetch} from "@/composables/statefulFetch.js";

Settings.defaultLocale = 'zh-CN';

const selDate = ref(DateTime.now().startOf('day'));
const selChannelId = ref('cctv1');
const epg = ref();
const liveProgrammeDom = useTemplateRef('liveProgramme');

let statefulFetch = useStatefulFetch();

const calWeekdays = ref(calWeekdaysGen());

const curWeekdays = computed(() => curWeekdaysGen(selDate.value));

const selWeekdayAction = (date) => {
  selDate.value = date;
  getEpgHandler();
};

const selChannelAction = (id) => {
  selChannelId.value = id;
  getEpgHandler();
};

const getEpgHandler = () => {
  const noon = selDate.value.set({
    hour: 12,
  }).toUnixInteger();

  statefulFetch.statefulFetch(selChannelId.value, selDate.value.toFormat('yyyyMMdd'))
      // epgApiGet(selChannelId.value, selDate.value.toFormat('yyyyMMdd'))
      .then(r => {
        const idx = r.list.findIndex(e => e.startTime >= noon);

        r.amList = r.list.slice(0, idx);
        r.pmList = r.list.slice(idx);

        delete r.list;

        epg.value = r;
      })
      .then(() => {
        nextTick(() => {
          liveProgrammeDom.value?.[0] && liveProgrammeDom.value[0].parentElement.scrollIntoView({block: 'center'});
        })
      })
      .catch(ex => {
        // console.log(ex);
      })
  ;
};

getEpgHandler();

const prevMonAction = (ym) => {
  const newYm = DateTime.fromFormat(ym, 'yyyy-MM').plus({month: -1});
  const earliest = DateTime.now().plus({month: -3, day: 1}).startOf('month');
  newYm >= earliest && (calWeekdays.value = calWeekdaysGen(newYm));
};
const nextMonAction = (ym) => {
  const newYm = DateTime.fromFormat(ym, 'yyyy-MM').plus({month: 1});
  const latest = DateTime.now().plus({day: 6}).plus({month: -1}).startOf('month');
  newYm <= latest && (calWeekdays.value = calWeekdaysGen(newYm));
};

</script>

<template>
  <div class="epg-main">
    <div class="epg-date">
      <div class="weekdays-container">
        <button v-for="w in curWeekdays" class="weekday-item" :class="{'weekday-item-cur': w.hasSame(selDate, 'day')}"
                @click="selWeekdayAction(w)">
          <span class="text-center">{{ w.toFormat('EEEE') }}</span>
          <span class="text-center">{{ w.toISODate() }}</span>
        </button>

        <button class="cal-container">
          <span class="cal-btn-content">往日节目单</span>

          <span class="cal-popup" @click.stop.prevent>
            <template v-for="(days,ym) in calWeekdays">
              <div class="cal-ym-title-container"><button class="cal-ym-month-btn"
                                                          @click="prevMonAction(ym)">&lt;</button>{{
                  ym
                }}<button
                    class="cal-ym-month-btn" @click="nextMonAction(ym)">&gt;</button></div>
              <div class="cal-week-container">
                <span v-for="d in weekdays" class="cal-weekday-title">{{ d }}</span>
                <button v-for="d in days" class="cal-day"
                        :class="{'cal-day-invalid': !d?.valid, 'cal-day-sel': d?.hasSame(selDate, 'day'), 'cal-day-today': d?.hasSame(DateTime.now(), 'day')}"
                        @click="selWeekdayAction(d)">{{ d?.day ?? '' }}
                </button>
              </div>
            </template>
          </span>
        </button>
      </div>

    </div>

    <div class="epg-channels">
      <button v-for="c in channels" @click="selChannelAction(c.id)" class="channel-link"
              :class="{'channel-link-cur': c.id===selChannelId}">
        <span class="channel-link-logo">C<span class="red">C</span>TV<span class="channel-link-logo-no">{{
            c.no
          }}</span>
        </span>
        <span class="channel-link-text">{{ c.name }}</span>
      </button>
    </div>

    <div class="epg-guides" :class="{'epg-guides-fetching': statefulFetch.fetching.value}">
      <div v-if="statefulFetch.error.value">获取遇到错误</div>

      <template v-if="epg && !statefulFetch.error.value">
        <template
            v-for="p in [{title: '上午 （00:00-12:00）',programmes:epg.amList},{title: '下午 （12:00-24:00）',programmes:epg.pmList}]">
          <div class="epg-period-title">{{ p.title }}</div>
          <div v-for="e in p.programmes" class="epg-item">
            <span class="epg-item-time">{{
                DateTime.fromSeconds(e.startTime).toLocaleString(DateTime.TIME_24_SIMPLE)
              }}</span>

            <span class="copy-all flex-grow">{{ e.title }}</span>

            <a :href="e.column_url" v-if="e.column_url" target="column" class="epg-item-column">往期视频</a>

            <a :href="renderPlaybackUrl(epg.lvUrl, e.startTime, e.endTime)" v-if="e.endTime * 1000 <= Date.now()"
               target="playback" class="epg-item-link epg-item-link-back"
               :class="{'epg-item-link-disabled': selDate < DateTime.now().plus({day:-7})}">回看</a>

            <a :href="epg?.lvUrl" v-else-if="e.startTime * 1000 <= Date.now()" target="live"
               class="epg-item-link epg-item-link-live" ref="liveProgramme">直播中</a>

            <span v-else class="epg-item-link epg-item-link-future">未开始</span>
          </div>
        </template>

      </template>

    </div>
  </div>
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

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

.epg-channels {
  grid-row: 2 / 3;
  overflow-y: auto;

  width: 180px;

  display: flex;
  flex-direction: column;

  transition: filter .2s;
}

.epg-guides {
  overflow-y: auto;
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

  padding: 4px 4px;

  display: flex;
  flex-direction: column;

  font-size: 14px;

  cursor: pointer;
}

.weekday-item:hover, .weekday-item-cur, .cal-container:hover .cal-btn-content, .cal-container:focus-within .cal-btn-content {
  background-color: yellowgreen;
}

.cal-container {
  position: relative;

  border: none;
  background: none;

  display: flex;
  align-items: stretch;
}

.cal-btn-content {
  display: flex;
  align-items: center;

  border-radius: 8px;
  padding: 4px 4px;
}

.cal-popup {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;

  border-radius: 4px;

  /*width: 300px;*/
  box-shadow: 0 0 4px 2px lightgrey;
  background-color: white;
}

.cal-container:hover .cal-popup, .cal-container:focus-within .cal-popup {
  display: block;
}

.cal-ym-title-container {
  display: flex;
  justify-content: space-between;

  font-size: 18px;
  font-weight: 300;

  padding: 4px 4px;
}

.cal-ym-month-btn {
  border: none;
  background: none;
  padding: 0;

  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 200px;

  font-weight: 900;
  text-align: center;
}

.cal-ym-month-btn:hover {
  color: deepskyblue;
  box-shadow: 0 0 2px deepskyblue;
}

.cal-week-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
}

.cal-weekday-title {
  justify-self: stretch;
  align-self: stretch;

  height: 32px;
  width: 36px;

  background-color: whitesmoke;

  display: flex;
  justify-content: center;
  align-items: center;
}

.cal-day {
  display: flex;
  justify-content: center;
  align-items: center;

  border: none;
  /*border: 4px solid white;*/
  background: none;
  box-sizing: border-box;

  height: 24px;
  width: 24px;
  /*height: 32px;
  width: 32px;*/
  border-radius: 200px;

  cursor: pointer;
}

.cal-day-today {
  box-shadow: 0 0 3px 1px deepskyblue;
}

.cal-day:hover, .cal-day-sel {
  background-color: deepskyblue;
}

.cal-day-invalid {
  pointer-events: none;
  color: darkgrey;
}

.channel-link {
  border: solid transparent;
  border-width: 1px 2px;
  background: none whitesmoke;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 10px 0;

  cursor: pointer;
}

.channel-link:hover, .channel-link:focus, .channel-link-cur {
  border-color: lightgrey transparent lightgrey lightskyblue;
  background-color: white;
}

.channel-link-logo {
  display: flex;
  align-items: stretch;

  font-size: 19px;
  font-weight: 1000;
  line-height: 18px;

  transform: scaleX(120%);
  transform-origin: center;

  text-decoration-line: underline;
  /*text-decoration-color: black;*/
  text-decoration-thickness: 2px;
  text-underline-offset: 1px;

  /*box-sizing: border-box;
  border-bottom: 2px solid black;*/
}

.channel-link-logo-no {
  display: inline-flex;
  width: 1.6em;
  background-color: black;
  color: white;
  border-radius: 40% 40% 40% 0;

  font-size: 17px;

  justify-content: center;
  align-items: stretch;
}

.channel-link-text {
  font-size: 15px;
  font-weight: 1000;
}

@keyframes anim-channels-fetching {
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

  animation: anim-channels-fetching .25s infinite linear;
}

.epg-period-title {
  padding: 14px 24px;

  background-color: whitesmoke;

  font-size: 18px;
}

.epg-item {
  padding: 12px 0;
  box-sizing: border-box;

  font-size: 18px;

  display: flex;
}

.epg-item:hover, .epg-item:focus-within {
  box-shadow: inset 0 0 6px -2px yellowgreen;
}

.epg-item-time {
  width: 96px;
  display: flex;
  justify-content: center;
}

.epg-item-column {
  margin-right: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 15px;
  text-decoration: none;
}

.epg-item-link {
  border-radius: 80px;
  background-color: lightgrey;
  width: 76px;
  padding: 3px 0;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.epg-item-link-back {
  background-color: dodgerblue;
}

.epg-item-link-back:hover, .epg-item-link-back:focus {
  box-shadow: inset 0 0 0 1px dodgerblue;
  background-color: white;
  color: dodgerblue;
}

.epg-item-link-live {
  background-color: red;
}

.epg-item-link-live:hover, .epg-item-link-live:focus {
  box-shadow: inset 0 0 0 1px red;
  background-color: white;
  color: red;
}

.epg-item-link-disabled, .epg-item-link-future {
  background-color: grey;
  pointer-events: none;
}

.text-center {
  text-align: center;
}

.red {
  color: red;
}

.flex-grow {
  flex-grow: 1;
}

.copy-all {
  user-select: all;
}

</style>
