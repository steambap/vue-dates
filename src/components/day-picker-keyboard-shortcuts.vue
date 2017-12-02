<template>
  <div>
    <button ref="showKeyboardShortcutsButton"
      class="DayPickerKeyboardShortcuts_buttonReset DayPickerKeyboardShortcuts_show"
      :class="{
        DayPickerKeyboardShortcuts_show__bottomRight: bottomRight,
        DayPickerKeyboardShortcuts_show__topRight: topRight,
        DayPickerKeyboardShortcuts_show__topLeft: topLeft
      }"
      type="button"
      @click="onShowKeyboardShortcutsButtonClick"
      @keydown.enter.prevent
      @keydown.space="onShowKeyboardShortcutsButtonClick"
      @mouseup="blur($event)"
    >
      <span class="DayPickerKeyboardShortcuts_showSpan"
        :class="{
          DayPickerKeyboardShortcuts_showSpan__bottomRight: bottomRight,
          DayPickerKeyboardShortcuts_showSpan__topRight: topRight,
          DayPickerKeyboardShortcuts_showSpan__topLeft: topLeft
        }"
      >?</span>
    </button>
    <div v-if="showKeyboardShortcutsPanel"
      class="DayPickerKeyboardShortcuts_panel"
      :class="{DayPickerKeyboardShortcuts_panel__block: block}"
      role="dialog"
      aria-labelledby="DayPickerKeyboardShortcuts__title"
      aria-describedby="DayPickerKeyboardShortcuts__description"
    >
      <div class="DayPickerKeyboardShortcuts_title"
        id="DayPickerKeyboardShortcuts__title"
      >{{phrases.keyboardShortcuts}}</div>

      <button ref="hideKeyboardShortcutsButton"
        class="DayPickerKeyboardShortcuts_buttonReset DayPickerKeyboardShortcuts_close"
        type="button"
        tabindex="0"
        :aria-label="phrases.hideKeyboardShortcutsPanel"
        @click="closeKeyboardShortcutsPanel"
        @keydown="onKeyDown($event)"
      >
        <x-icon class="DayPickerKeyboardShortcuts_closeSvg"></x-icon>
      </button>

      <ul class="DayPickerKeyboardShortcuts__list"
        id="DayPickerKeyboardShortcuts__description"
      >
        <keyboard-shortcut-row
          v-for="k in keyboardShortcuts"
          :key="k.label"
          :unicode="k.unicode"
          :label="k.label"
          :action="k.action"
          :block="block"
        ></keyboard-shortcut-row>
      </ul>
    </div>
  </div>
</template>

<script>
import { DayPickerKeyboardShortcutsPhrases } from "../phrases";
import { XIcon } from "vue-feather-icons";
import KeyboardShortcutRow from "./keyboard-shortcut-row.vue";

export const TOP_LEFT = "top-left";
export const TOP_RIGHT = "top-right";
export const BOTTOM_RIGHT = "bottom-right";

export default {
  name: "day-picker-keyboard-shortcuts",
  components: { XIcon, KeyboardShortcutRow },
  props: {
    block: {
      type: Boolean,
      default: false
    },
    buttonLocation: {
      type: String,
      default: BOTTOM_RIGHT
    },
    showKeyboardShortcutsPanel: {
      type: Boolean,
      default: false
    },
    openKeyboardShortcutsPanel: {
      type: Function,
      default: function() {}
    },
    closeKeyboardShortcutsPanel: {
      type: Function,
      default: function() {}
    },
    phrases: {
      type: Object,
      default: function() {
        return DayPickerKeyboardShortcutsPhrases;
      }
    }
  },
  computed: {
    bottomRight() {
      return this.buttonLocation === BOTTOM_RIGHT;
    },
    topRight() {
      return this.buttonLocation === TOP_RIGHT;
    },
    topLeft() {
      return this.buttonLocation === TOP_LEFT;
    },
    keyboardShortcuts() {
      return getKeyboardShortcuts(this.phrases);
    }
  },
  methods: {
    onShowKeyboardShortcutsButtonClick() {
      const { openKeyboardShortcutsPanel } = this;

      // We want to return focus to this button after closing the keyboard shortcuts panel
      openKeyboardShortcutsPanel(() => {
        this.$ref.showKeyboardShortcutsButton.focus();
      });
    },
    blur(e) {
      e.currentTarget.blur();
    },
    handleFocus() {
      if (this.$ref.hideKeyboardShortcutsButton) {
        this.$ref.hideKeyboardShortcutsButton.focus();
      }
    }
  },
  updated() {
    this.handleFocus();
  },
  onKeyDown(e) {
    const { closeKeyboardShortcutsPanel } = this;
    // Because the close button is the only focusable element inside of the panel, this
    // amount to a very basic focus trap. The user can exit the panel by "pressing" the
    // close button or hitting escape
    switch (e.keyCode) {
      case 32: // Space
      case 27: // Escape
        e.stopPropagation();
        closeKeyboardShortcutsPanel();
        break;

      // Only stopPropagation here - this allows the up and down arrows continue their
      // default behavior of scrolling the content of the Keyboard Shortcuts Panel
      // which is needed when only a single month is shown for instance.
      case 38: // ArrowUp
      case 40: // ArrowDown
        e.stopPropagation();
        break;

      // Completely block the rest of the keys that have functionality outside of this panel
      case 9: // Tab
      case 13: // Enter
      case 36: // Home
      case 35: // End
      case 33: // PageUp
      case 34: // PageDown
      case 37: // ArrowLeft
      case 39: // ArrowRight
        e.stopPropagation();
        e.preventDefault();
        break;

      default:
        break;
    }
  }
};

function getKeyboardShortcuts(phrases) {
  return [
    {
      unicode: "↵",
      label: phrases.enterKey,
      action: phrases.selectFocusedDate
    },
    {
      unicode: "←/→",
      label: phrases.leftArrowRightArrow,
      action: phrases.moveFocusByOneDay
    },
    {
      unicode: "↑/↓",
      label: phrases.upArrowDownArrow,
      action: phrases.moveFocusByOneWeek
    },
    {
      unicode: "PgUp/PgDn",
      label: phrases.pageUpPageDown,
      action: phrases.moveFocusByOneMonth
    },
    {
      unicode: "Home/End",
      label: phrases.homeEnd,
      action: phrases.moveFocustoStartAndEndOfWeek
    },
    {
      unicode: "Esc",
      label: phrases.escape,
      action: phrases.returnFocusToInput
    },
    {
      unicode: "?",
      label: phrases.questionMark,
      action: phrases.openThisPanel
    }
  ];
}
</script>

<style>
.DayPickerKeyboardShortcuts_buttonReset {
  background: none;
  border: 0;
  border-radius: 0;
  color: inherit;
  font: inherit;
  line-height: normal;
  overflow: visible;
  padding: 0;
  cursor: pointer;
}
.DayPickerKeyboardShortcuts_buttonReset:active {
  outline: none;
}
.DayPickerKeyboardShortcuts_show {
  width: 22px;
  position: absolute;
  z-index: 2;
}
.DayPickerKeyboardShortcuts_show__bottomRight {
  border-top: 26px solid transparent;
  border-right: 33px solid #00a699;
  bottom: 0;
  right: 0;
}
.DayPickerKeyboardShortcuts_show__bottomRight:hover {
  border-right: 33px solid #008489;
}
.DayPickerKeyboardShortcuts_show__topRight {
  border-bottom: 26px solid transparent;
  border-right: 33px solid #00a699;
  top: 0;
  right: 0;
}
.DayPickerKeyboardShortcuts_show__topRight:hover {
  border-right: 33px solid #008489;
}
.DayPickerKeyboardShortcuts_show__topLeft {
  border-bottom: 26px solid transparent;
  border-left: 33px solid #00a699;
  top: 0;
  left: 0;
}
.DayPickerKeyboardShortcuts_show__topLeft:hover {
  border-left: 33px solid #008489;
}
.DayPickerKeyboardShortcuts_showSpan {
  color: white;
  position: absolute;
}
.DayPickerKeyboardShortcuts_showSpan__bottomRight {
  bottom: 0;
  right: -28px;
}
.DayPickerKeyboardShortcuts_showSpan__topRight {
  top: 1px;
  right: -28px;
}
.DayPickerKeyboardShortcuts_showSpan__topLeft {
  top: 1px;
  left: -28px;
}
.DayPickerKeyboardShortcuts_panel {
  overflow: auto;
  background: white;
  border: 1px solid #dbdbdb;
  border-radius: 2px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;
  padding: 22px;
  margin: 33px;
}
.DayPickerKeyboardShortcuts_title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}
.DayPickerKeyboardShortcuts_list {
  list-style: none;
  padding: 0;
}
.DayPickerKeyboardShortcuts_close {
  position: absolute;
  right: 22px;
  top: 22px;
  z-index: 2;
}
.DayPickerKeyboardShortcuts_close:active {
  outline: none;
}
.DayPickerKeyboardShortcuts_closeSvg {
  height: 15px;
  width: 15px;
  fill: #cacccd;
}
.DayPickerKeyboardShortcuts_closeSvg:hover,
.DayPickerKeyboardShortcuts_closeSvg:focus {
  fill: #82888a;
}
</style>

