<template>
  <div class="DayPickerNavigation_container"
    :class="containerClass">
    <button class="DayPickerNavigation_button DayPickerNavigation_button__default"
      :class="navPrevClass"
      v-if="!isVerticalScrollable"
      type="button"
      @click="handlePrevMonthClick"
      @mouseup="blur($event)"
    >
      <arrow-right-icon v-if="isHorizontal && isRTL" :class="svgIconClass"></arrow-right-icon>
      <arrow-left-icon v-else-if="isHorizontal" :class="svgIconClass"></arrow-left-icon>
      <arrow-up-icon v-else :class="svgIconClass"></arrow-up-icon>
    </button>

    <button class="DayPickerNavigation_button DayPickerNavigation_button__default"
      :class="navNextClass"
      type="button"
      @click="handleNextMonthClick"
      @mouseup="blur($event)"
    >
      <arrow-left-icon v-if="isHorizontal && isRTL" :class="svgIconClass"></arrow-left-icon>
      <arrow-right-icon v-else-if="isHorizontal" :class="svgIconClass"></arrow-right-icon>
      <arrow-down-icon v-else :class="svgIconClass"></arrow-down-icon>
    </button>
  </div>
</template>

<script>
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "vue-feather-icons";

import { HORIZONTAL_ORIENTATION, VERTICAL_SCROLLABLE } from "../constants";

export default {
  name: "day-picker-navigation",
  components: {
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    ArrowDownIcon
  },
  props: {
    orientation: {
      type: String,
      default: HORIZONTAL_ORIENTATION
    },
    handlePrevMonthClick: {
      type: Function,
      default: function() {}
    },
    handleNextMonthClick: {
      type: Function,
      default: function() {}
    },
    isRTL: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isHorizontal() {
      return this.orientation === HORIZONTAL_ORIENTATION;
    },
    isVertical() {
      return this.orientation !== HORIZONTAL_ORIENTATION;
    },
    isVerticalScrollable() {
      return this.orientation === VERTICAL_SCROLLABLE;
    },
    containerClass() {
      return {
        DayPickerNavigation_container__horizontal: this.isHorizontal,
        DayPickerNavigation_container__vertical: this.isVertical,
        DayPickerNavigation_container__verticalScrollable: this
          .isVerticalScrollable
      };
    },
    navPrevClass() {
      let baseClass = null;
      if (this.isHorizontal) {
        baseClass = {
          DayPickerNavigation_button__horizontal: true,
          DayPickerNavigation_leftButton__horizontal: !this.isRTL,
          DayPickerNavigation_rightButton__horizontal: this.isRTL
        };
      } else {
        baseClass = {
          DayPickerNavigation_button__vertical: true,
          DayPickerNavigation_prevButton__vertical: true,
          DayPickerNavigation_button__vertical__default: true
        };
      }

      return baseClass;
    },
    navNextClass() {
      let baseClass = null;
      if (this.isHorizontal) {
        baseClass = {
          DayPickerNavigation_button__horizontal: true,
          DayPickerNavigation_leftButton__horizontal: this.isRTL,
          DayPickerNavigation_rightButton__horizontal: !this.isRTL
        };
      } else {
        baseClass = {
          DayPickerNavigation_button__vertical: true,
          DayPickerNavigation_nextButton__vertical: true,
          DayPickerNavigation_button__vertical__default: true,
          DayPickerNavigation_nextButton__vertical__default: true
        };
      }

      return {
        DayPickerNavigation_nextButton__verticalScrollable: this
          .isVerticalScrollable,
        ...baseClass
      };
    },
    svgIconClass() {
      return {
        DayPickerNavigation_svg__horizontal: this.isHorizontal,
        DayPickerNavigation_svg__vertical: this.isVertical
      };
    }
  },
  methods: {
    blur(e) {
      e.currentTarget.blur();
    }
  }
};
</script>


<style>
.DayPickerNavigation_container {
  position: relative;
  z-index: 2;
}
.DayPickerNavigation_container__vertical {
  background: #fff;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  position: absolute;
  bottom: 0;
  left: 0;
  height: 52px;
  width: 100%;
}
.DayPickerNavigation_container__verticalScrollable {
  position: relative;
}
.DayPickerNavigation_button {
  cursor: pointer;
  line-height: 0.78;
  user-select: none;
}
.DayPickerNavigation_button__default {
  border: 1px solid #e4e7e7;
  background-color: #fff;
  color: #757575;
}
.DayPickerNavigation_button__default:focus,
.DayPickerNavigation_button__default:hover {
  border: 1px solid #c4c4c4;
}
.DayPickerNavigation_button__default:active {
  background: #f2f2f2;
}
.DayPickerNavigation_button__horizontal {
  border-radius: 3px;
  padding: 6px 9px;
  top: 18px;
  position: absolute;
}
.DayPickerNavigation_leftButton__horizontal {
  left: 22px;
}
.DayPickerNavigation_rightButton__horizontal {
  right: 22px;
}
.DayPickerNavigation_button__vertical {
  display: inline-block;
  position: relative;
  height: 100%;
  width: 50%;
}
.DayPickerNavigation_button__vertical__default {
  padding: 5px;
}
.DayPickerNavigation_nextButton__vertical__default {
  border-left: 0;
}
.DayPickerNavigation_nextButton__verticalScrollable {
  width: 100%;
}
.DayPickerNavigation_svg__horizontal {
  height: 19px;
  width: 19px;
  fill: #82888a;
}
.DayPickerNavigation_svg__vertical {
  height: 42px;
  width: 42px;
  fill: #565a5c;
}
</style>
