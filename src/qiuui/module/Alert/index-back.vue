<template>
  <div class="qiu-alert-container">
    <div class="qiui-alert-header" :style="{ background: skin }">
      <div class="qiu-alert-title">{{ title }}</div>
      <div class="qiu-alert-close">x</div>
    </div>
    <div class="qiu-alert-main">
      <div class="qiu-alert-icon"></div>
      <div class="qiu-alert-content">
        {{ content }}
      </div>
    </div>
    <div class="qiu-alert-menu">
      <button @click="okfun">{{ btnokText }}</button>
    </div>
  </div>
  <div
    class="qiu-alert-shade"
    :style="{ opacity: opacity }"
    @click="closeshade"
  ></div>
</template>

<script>
  import { defineComponent } from "vue";
  export default defineComponent({
    name: "Alert",
    props: {
      title: {
        type: String,
        default: "温馨提醒",
      },
      content: {
        type: String,
        default: "网页提醒",
      },
      skin: {
        type: String,
        default: "#ffffff",
      },
      btnokText: {
        type: String,
        default: "确认",
      },
      opacity: {
        type: Number,
        default: 0.3,
      },
      shadeclose: {
        type: Boolean,
        default: false,
      },
      // 成功回调
      success: {
        type: Function,
      },
      // 失败回调
      fail: {
        type: Function,
      },
    },
    steup(props) {
      // 关闭close
      const closeshade = () => {
        console.log("11");
        if (props.shadeclose) {
          const modelDom = document.body.querySelector(`.qiu-alert`);
          if (modelDom) {
            document.body.removeChild(modelDom);
          }
        }
      };

      const okfun = () => {
        console.log("122");
      };

      return {
        closeshade,
        okfun,
      };
    },
  });
</script>

<style lang="scss">
  .qiu-alert-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 160px;
    box-shadow: 2px 2px 10px #363636;
    border-radius: 3px;
    font-size: 12px;
    z-index: 999999999;
    background: #ffffff;

    .qiu-alert-header {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #333333;

      .qiu-alert-title {
        float: left;
        height: 28px;
        width: 280px;
      }

      .qiu-alert-close {
        float: left;
        width: 20px;
      }
    }
  }
  .qiu-alert-shade {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #333333;
    z-index: 99999999;
    opacity: 0.3;
  }
</style>
