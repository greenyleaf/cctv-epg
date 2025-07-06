<script setup>

import {weekdays} from "@/util/app-constants.js";
import {DateTime} from "luxon";
import {ref} from "vue";
import {calWeekdaysGen} from "@/util/app-utils.js";

const props = defineProps(['selDate']);
const emit = defineEmits(['date-sel']);

const calWeekdays = ref(calWeekdaysGen());

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
<span class="cal-popup" @click.stop.prevent>
  <template v-for="(days,ym) in calWeekdays">
    <div class="cal-ym-title-container"><button class="cal-ym-month-btn"
                                                @click="prevMonAction(ym)">&lt;</button>{{
        ym
      }}<button class="cal-ym-month-btn" @click="nextMonAction(ym)">&gt;</button></div>

    <div class="cal-week-container">
      <span v-for="d in weekdays" class="cal-weekday-title">{{ d }}</span>

      <button v-for="d in days" class="cal-day"
              :class="{'cal-day-invalid': !d?.valid, 'cal-day-sel': d?.hasSame(selDate, 'day'), 'cal-day-today': d?.hasSame(DateTime.now(), 'day')}"
              @click="emit('date-sel', d)">{{ d?.day ?? '' }}
      </button>
    </div>
  </template>
</span>

</template>

<style scoped>

.cal-popup {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;

  border-radius: 4px;

  /*width: 300px;*/
  box-shadow: 0 0 4px 2px lightgrey;
  background-color: white;

  z-index: 1000;
}

.cal-container:hover .cal-popup, .cal-container:focus-within .cal-popup {
  display: block;
}

.cal-ym-title-container {
  display: flex;
  justify-content: space-between;

  /*font-size: 18px;*/
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

</style>
