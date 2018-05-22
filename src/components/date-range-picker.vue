<template>
  <div></div>
</template>

<script>
export default {
  name: 'date-range-picker'
}
</script>

<style>
.DateRangePicker {
  position: relative;
  display: inline-block;
}
.DateRangePicker__block {
  display: block;
}
.DateRangePicker_picker {
  z-index: 1;
  background-color: white;
  position: absolute;
}
.DateRangePicker_picker__rtl {
  direction: rtl;
}
.DateRangePicker_picker__directionLeft {
  left: 0;
}
.DateRangePicker_picker__directionRight {
  right: 0;
}
.DateRangePicker_picker__openDown {
  top: 72px;
}
.DateRangePicker_picker__openUp {
  bottom: 72px;
}
.DateRangePicker_closeButton {
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  line-height: normal;
  overflow: visible;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  padding: 15px;
  z-index: 2;
}
.DateRangePicker_closeButton:hover,
.DateRangePicker_closeButton:focus {
  color: #b0b3b4;
  text-decoration: none;
}
.DateRangePicker_closeButton_svg {
  height: 15px;
  width: 15px;
  fill: #cacccd;
}
</style>
