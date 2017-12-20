<template>
  <div
    class="DateInput"
    :class="dateInputClass"
  >
    <input
      class="DateInput_input"
      :class="{
        'DateInput_input__readOnly': readOnly,
        'DateInput_input__focused': focused,
        'DateInput_input__disabled': disabled
      }"
      :aria-label="placeholder"
      type="text"
      :id="id"
      :name="id"
      ref="input"
      :value="value"
      @change="onChange($event)"
      @keydown="throttleKeyDown($event)"
      @focus="handleFocus"
      :placeholder="placeholder"
      autocomplete="off"
      :disabled="disabled"
      :readonly="typeof readOnly === 'boolean' ? readOnly : isTouchSupported"
      :required="required"
      :aria-describedby="screenReaderMessage && screenReaderMessageId"
    />
    <p
      v-if="screenReaderMessage"
      class="DateInput_screenReaderMessage"
      :id="screenReaderMessageId"
    >{{screenReaderMessage}}</p>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import { isTouchSupported } from "../helpers";
import { OPEN_DOWN, OPEN_UP, keys } from "../constants";

export default {
  name: "date-input",
  props: {
    id: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: "Select Date"
    },
    displayValue: {
      type: String,
      default: ""
    },
    screenReaderMessage: {
      type: String,
      default: ""
    },
    focused: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: null
    },
    openDirection: {
      type: String,
      default: OPEN_DOWN
    },
    showCaret: {
      type: Boolean,
      default: false
    },
    handleChange: {
      type: Function,
      default: function() {}
    },
    handleFocus: {
      type: Function,
      default: function() {}
    },
    handleKeyDownShiftTab: {
      type: Function,
      default: function() {}
    },
    handleKeyDownTab: {
      type: Function,
      default: function() {}
    },
    handleKeyDownArrowDown: {
      type: Function,
      default: function() {}
    },
    handleKeyDownQuestionMark: {
      type: Function,
      default: function() {}
    },
    isFocused: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dateString: "",
      isTouchSupported: false
    };
  },
  computed: {
    value() {
      return this.displayValue || this.dateString || "";
    },
    withCaret() {
      return this.showCaret && this.focused;
    },
    dateInputClass() {
      return {
        DateInput__withCaret: this.withCaret,
        DateInput__disabled: this.disabled,
        DateInput__openDown: this.withCaret && this.openDirection === OPEN_DOWN,
        DateInput__openUp: this.withCaret && this.openDirection === OPEN_UP
      };
    },
    screenReaderMessageId() {
      return "DateInput__screen-reader-message-" + this.id;
    }
  },
  methods: {
    onChange(e) {
      const dateString = e.target.value;

      if (dateString[dateString.length - 1] === "?") {
        this.handleKeyDownQuestionMark(e);
      } else {
        this.dateString = dateString;
        this.handleChange(dateString);
      }
    },
    throttleKeyDown: throttle(function(e) {
      this.onKeyDown(e);
    }, 300),
    onKeyDown(e) {
      e.stopPropagation();

      switch (e.keyCode) {
        case keys.tab:
          if (e.shiftKey) {
            this.handleKeyDownShiftTab(e);
          } else {
            this.handleKeyDownTab(e);
          }
          break;

        case keys.arrowDown:
          this.handleKeyDownArrowDown(e);
          break;

        case keys.question:
          e.preventDefault();
          this.handleKeyDownQuestionMark(e);
          break;

        default:
          break;
      }
    }
  },
  mounted() {
    this.isTouchSupported = isTouchSupported();
  },
  watch: {
    displayValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.dateString = "";
      }
    },
    isFocused(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }
      if (newVal && this.focused) {
        this.$refs.input.focus();
      } else {
        this.$refs.input.blur();
      }
    }
  }
};
</script>

<style>
.DateInput {
  font-weight: 200;
  font-size: 18px;
  line-height: 24px;
  color: #757575;
  margin: 0;
  padding: 0;

  background: white;
  position: relative;
  display: inline-block;
  width: 130px;
  vertical-align: middle;
}
.DateInput__withCaret:before {
  content: "";
  display: inline-block;
  position: absolute;
  bottom: auto;
  border: 10px solid transparent;
  left: 22px;
  z-index: 2;
}
.DateInput__withCaret:after {
  content: "";
  display: inline-block;
  position: absolute;
  bottom: auto;
  border: 10px solid transparent;
  left: 22px;
  z-index: 2;
}
.DateInput__openUp:before {
  border-bottom: 0;
  top: -24px;
  border-top-color: rgba(0, 0, 0, 0.1);
}
.DateInput__openUp:after {
  border-bottom: 0;
  top: -25px;
  border-top-color: white;
}
.DateInput__openDown:before {
  border-top: 0;
  top: 62px;
  border-bottom-color: rgba(0, 0, 0, 0.1);
}
.DateInput__openDown:after {
  border-top: 0;
  top: 63px;
  border-bottom-color: white;
}
.DateInput__disabled {
  background: #f2f2f2;
  color: #dbdbdb;
}
.DateInput_input {
  font-weight: 200;
  font-size: 18px;
  color: #565a5c;
  background: white;
  width: 100%;
  padding: 12px 12px;
  border: 0;
  border-top: 0;
  border-right: 0;
  border-bottom: 2px solid transparent;
  border-left: 0;
}
.DateInput_input__readOnly {
  user-select: none;
}
.DateInput_input__focused {
  outline: 0;
  background: white;
  border: 0;
  border-top: 0;
  border-right: 0;
  border-bottom: 2px solid #008489;
  border-left: 0;
}
.DateInput_input__disabled {
  background: #f2f2f2;
  font-style: italic;
}
.DateInput_screenReaderMessage {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
</style>
