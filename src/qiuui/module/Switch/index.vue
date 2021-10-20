<template>
  <span
    ref="dataSwitch"
    class="qiu-switch-container"
    :data-switch="isChecked"
    @click="toggle()"
  >
    <slot></slot>
    <div v-if="isChecked == 'true'" class="qiu-switch-on">
      {{ direction[0] }}
      <div class="qiu-switch-node-on"></div>
    </div>
    <div v-else class="qiu-switch-off">
      {{ direction[1] }}
      <div class="qiu-switch-node-off"></div>
    </div>
  </span>
</template>
<script>
export default {
  name: "QiuSwitch",
  props: {
    ischeck: {
      type: String,
      default: "false",
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isChecked: this.ischeck,
    };
  },
  computed: {
    direction() {
      if (this.text) {
        return this.text.split("|");
      } else {
        return [];
      }
    },
  },
  watch: {
    // isChecked(val) {
    //   this.$emit('change', val)
    // },
  },
  created() {
    // console.log(this.checked)
  },
  methods: {
    toggle() {
      if (this.isChecked == "false") {
        this.isChecked = "true";
      } else {
        this.isChecked = "false";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.qiu-switch-container {
  position: relative;
  display: inline-block;
  min-width: 50px;
  line-height: 24px;
  cursor: pointer;
  user-select: none;

  .qiu-switch-on {
    min-height: 24px;
    padding-right: 28px;
    padding-left: 5px;
    color: #ffffff;
    text-align: right;
    background: #0592f0;
    border-radius: 16px;
    .qiu-switch-node-on {
      position: absolute;
      top: 0;
      right: 1px;
      min-width: 24px;
      min-height: 24px;
      background: #ffffff;
      border-radius: 15px;
      box-shadow: 1px 1px 5px #888888;
      transition: background-color 0.1s, border 0.1s;
    }
  }
  .qiu-switch-off {
    min-height: 24px;
    padding-right: 5px;
    padding-left: 28px;
    text-align: left;
    background: #afb0b1;
    border-radius: 16px;
    .qiu-switch-node-off {
      position: absolute;
      top: 0;
      left: 1px;
      min-width: 24px;
      min-height: 24px;
      background: #cccccc;
      border-radius: 15px;
      box-shadow: 1px 1px 5px #888888;
      transition: background-color 0.1s, border 0.1s;
    }
  }
}
</style>
