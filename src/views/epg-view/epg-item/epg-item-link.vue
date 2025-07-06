<script setup>

defineProps(['item', 'liveUrl']);

</script>

<template>
  <a class="epg-item-link epg-item-link-playback" target="playback"
     :href="item.link"
     :class="{'epg-item-link-disabled': !item.replay}"
     v-if="item.timeState === 'past'"
  ><span class="epg-item-link-text">回看</span></a>

  <a class="epg-item-link epg-item-link-live" target="live"
     :href="liveUrl" v-else-if="item.timeState === 'live'"><span class="epg-item-link-text">直播中</span></a>

  <a v-else class="epg-item-link epg-item-link-future"><span class="epg-item-link-text">未开始</span></a>
</template>

<style scoped>
.epg-item-link {
  padding: 0 2px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-decoration: none;
}

.epg-item-link-text {
  border-radius: 80px;
  background-color: lightgrey;
  width: 60px;
  padding: 3px 0;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: bold;
  color: white;
}

.epg-item-link-playback .epg-item-link-text {
  /*background-color: dodgerblue;*/
  background-color: #f57c00;
}

.epg-item-link-playback:hover .epg-item-link-text, .epg-item-link-playback:focus .epg-item-link-text {
  /*box-shadow: inset 0 0 0 1px dodgerblue;*/
  box-shadow: inset 0 0 0 1px #f57c00;
  background-color: white;
  /*color: dodgerblue;*/
  color: #f57c00;
}

.epg-item-link-live .epg-item-link-text {
  background-color: red;
}

.epg-item-link-live:hover .epg-item-link-text, .epg-item-link-live:focus .epg-item-link-text {
  box-shadow: inset 0 0 0 1px red;
  background-color: white;
  color: red;
}

.epg-item-link-disabled .epg-item-link-text, .epg-item-link-future .epg-item-link-text {
  background-color: grey;
}

.epg-item-link-disabled, .epg-item-link-future {
  pointer-events: none;
}

</style>
