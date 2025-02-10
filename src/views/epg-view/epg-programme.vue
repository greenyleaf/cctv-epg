<script setup>

import LinkEpgItem from "@/views/epg-view/link-epg-item.vue";

defineProps(['item']);

</script>

<template>
  <a class="epg-item"
     :class="{'epg-item-replay': item.replay, 'epg-item-past': item.timeState === 'past', 'epg-item-live': item.timeState === 'live', 'epg-item-future': item.timeState === 'future'}">
    <span class="epg-item-time">{{ item.startTimeText }}</span>

    <span class="select-all flex-grow epg-item-title"
          :class="{'epg-item-current-title': item.timeState === 'live'}">{{ item.title }}</span>

    <a class="epg-item-column" target="column"
       :href="item.column_url" v-if="item.column_url">往期视频</a>

    <link-epg-item :item="item"/>
  </a>

</template>

<style scoped>
.epg-item {
  /*padding: 12px 0;*/
  /*box-sizing: border-box;*/

  height: 45px;
  display: flex;

  font-size: 18px;
  text-decoration: none;
}

.epg-item:hover, .epg-item:focus-within {
  box-shadow: inset 0 0 6px -2px yellowgreen;
}

.epg-item-time {
  width: 88px;
  display: flex;
  /*padding: 12px 0;*/

  justify-content: center;
  align-items: center;
}

.epg-item-title {
  /*padding: 12px 0;*/

  display: flex;
  align-items: center;

  font-family: sans-serif;
  /*line-height: 1.1;*/
}

.epg-item-current-title {
  color: red;
  font-weight: 900;
}

.epg-item-column {
  padding: 0 6px;
  /*margin-right: 12px;*/

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 15px;
  text-decoration: none;
  font-weight: 900;
  text-shadow: 0 0 5px #b0bec5;
}

.epg-item-column:hover, .epg-item-column:focus {
  text-shadow: 0 0 12px #b0bec5;
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