<script setup>

import EpgItemLink from "@/views/epg-view/epg-item/epg-item-link.vue";

defineProps(['item', 'liveUrl']);

</script>

<template>
  <a class="epg-item"
     target="playback"
     :class="{'epg-item-replay': item.replay, 'epg-item-past': item.timeState === 'past', 'epg-item-live': item.timeState === 'live', 'epg-item-future': item.timeState === 'future'}"
  >
    <!--:href="item.replay ? item.link : item.timeState === 'live' ? liveUrl : undefined"-->
    <span class="epg-item-time">{{ item.startTimeText }}</span>

    <span class="select-all flex-grow epg-item-title"
          :class="{'epg-item-current-title': item.timeState === 'live'}">{{ item.title }}</span>

    <a class="epg-item-column" target="column"
       :href="item.column_url" v-if="item.column_url">往期</a>

    <epg-item-link :item="item" :live-url="liveUrl"/>
  </a>

</template>

<style scoped>
.epg-item {
  display: flex;

  color: black;
  text-decoration: none;
}

.epg-item:hover, .epg-item:focus-within {
  box-shadow: inset 0 0 10px -1px yellowgreen;
}

.epg-item-time {
  /*width: 88px;*/
  display: flex;
  padding: 0 10px;

  flex: 0 0;

  justify-content: center;
  align-items: center;

  font-weight: 700;
  font-family: monospace;
}

.epg-item-title {
  padding: 6px 0;

  display: flex;
  align-items: center;

  font-family: sans-serif;
  /*line-height: 1.1;*/

  line-break: anywhere;
}

.epg-item-current-title {
  color: red;
  font-weight: 900;
}

.epg-item-column {
  padding: 0 2px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  text-decoration: none;
  font-weight: 900;
  text-shadow: 0 0 5px #b0bec5;

  word-break: keep-all;
}

.epg-item-column:hover, .epg-item-column:focus {
  text-shadow: 0 0 12px lightgoldenrodyellow;
  color: blue;
}

.epg-item-past {
  background: repeating-linear-gradient(-.25turn, transparent 0, #f5f5f555 6px, transparent 12px);
}

.epg-item-replay {
  background: repeating-linear-gradient(-.25turn, transparent 0, #ffe0b255 6px, transparent 12px);
}

.epg-item-live {
  background: repeating-linear-gradient(-.25turn, transparent 0, #ffcdd266 6px, transparent 12px);
}

.epg-item-future {
  background: repeating-linear-gradient(-.25turn, transparent 0, #bbdefb66 6px, transparent 12px);
}

</style>