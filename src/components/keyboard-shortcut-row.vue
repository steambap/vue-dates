<template>
  <li class="KeyboardShortcutRow"
    :class="{block: 'KeyboardShortcutRow__block'}">
    <div class="KeyboardShortcutRow_keyContainer"
      :class="{block: 'KeyboardShortcutRow_keyContainer__block'}">
      <span class="KeyboardShortcutRow_key"
        role="img"
        :aria-label="label + ','">
        {{unicode}}
      </span>
    </div>
    <div class="KeyboardShortcutRow_action">
      {{action}}
    </div>
  </li>
</template>

<script>
export default {
  name: "keyboard-shortcut-row",
  props: {
    unicode: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    action: {
      type: String,
      require: true
    },
    block: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>
.KeyboardShortcutRow {
  list-style: none;
  margin: 6px 0;
}
.KeyboardShortcutRow__block {
  margin-bottom: 16px;
}
.KeyboardShortcutRow_keyContainer {
  display: inline-block;
  white-space: nowrap;
  text-align: right;
  margin-right: 6px;
}
.KeyboardShortcutRow_keyContainer__block {
  text-align: left;
  display: inline;
}
.KeyboardShortcutRow_key {
  font-family: monospace;
  font-size: 12px;
  text-transform: uppercase;
  background: #f2f2f2;
  padding: 2px 6px;
}
.KeyboardShortcutRow_action {
  display: inline;
  word-wrap: break-word;
  margin-left: 8px;
}
</style>
