<script setup>

import {channels} from "@/util/app-constants.js";

const props = defineProps(['selChannelId']);
const emit = defineEmits(['channel-sel']);

</script>

<template>
  <div class="list-channel">
    <button v-for="c in channels" @click="emit('channel-sel', c.id)"
            class="channel-link"
            :class="{'channel-link-cur': c.id === props.selChannelId}">
        <span class="channel-link-logo">C<mark class="letter-mark">C</mark>TV<span class="channel-link-logo-no">{{
            c.no
          }}</span>
        </span>
      <span class="channel-link-text">{{ c.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.list-channel {
  overflow-y: auto;
  scrollbar-width: thin;

  display: flex;
  flex-direction: column;

  transition: filter .2s;
}

.channel-link {
  border: solid transparent;
  border-width: 1px 2px;
  background: none #eceff1;

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

.letter-mark {
  background-color: transparent;
  color: red;
}
</style>
