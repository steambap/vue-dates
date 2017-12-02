<template>
  <div role="application" class="DayPicker">

  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'day-picker'
}
</script>

<style>
.DayPicker {
  background: #fff;
  position: relative;
  text-align: left;
}
.DayPicker__horizontal {
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.07);
  border-radius: 3px;
}
.DayPicker__verticalScrollable {
  height: 100%;
}
.DayPicker__hidden {
  visibility: hidden;
}
.DayPicker_portal__horizontal  {
  box-shadow: none;
  position: absolute;
  left: 50%;
  top: 50%;
}
.DayPicker_portal__vertical {
  position: initial;
}
.DayPicker_focusRegion {
  outline: none;
}
.DayPicker_weekHeaders {
  position: relative;
}
.DayPicker_weekHeaders__horizontal {
  margin-left: 9px;
}
.DayPicker_weekHeader {
  color: #757575;
  position: absolute;
  top: 62px;
  z-index: 2;
  padding: 0 13px;
  text-align: left;
}
.DayPicker_weekHeader__vertical {
  left: 50%;
}
.DayPicker_weekHeader__verticalScrollable {
  top: 0;
  display: table-row;
  border-bottom: 1px solid #dbdbdb;
  background: #fff;
  margin-left: 0;
  left: 0;
  width: 100%;
  text-align: center;
}
.DayPicker_weekHeader_ul {
  list-style: none;
  margin: 1px 0;
  padding-left: 0;
  padding-right: 0;
}
.DayPicker_weekHeader_li {
  display: inline-block;
  text-align: center;
}
.DayPicker_transitionContainer {
  position: relative;
  overflow: hidden;
  border-radius: 3px;
}
.DayPicker_transitionContainer__horizontal {
  transition: height 0.2s ease-in-out;
}
.DayPicker_transitionContainer__vertical {
  width: 100%;
}
.DayPicker_transitionContainer__verticalScrollable {
  padding-top: 20px;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: scroll;
}
</style>
