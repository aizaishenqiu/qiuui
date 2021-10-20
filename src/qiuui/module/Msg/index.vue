<template>
  <div v-if="info" class="qiu-msg-container-info">
    <div class="qiu-msg-info">{{ msg }}</div>
    <div class="qiu-msg-shade"></div>
  </div>
  <div v-else class="qiu-msg-container">
    <div class="qiu-msg-icon">
      <img :src="msgicon" />
    </div>
    <div class="qiu-msg-content">{{ msg }}</div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
export default defineComponent({
  props: {
    msg: {
      type: String,
      default: "",
    },
    time: {
      type: Number,
      default: 3000,
    },
    icon: {
      type: Number,
      default: 1,
    },
    info: {
      type: Boolean,
      default: false,
    },
    //msg出现显示区域  5个区域
    // 默认：居中center 左上leftTop,左下leftDown,右上：rightTop,右下：rightDown
    area: {
      type: String,
      default: "center",
    },
  },

  setup(props) {
    const msgicon = require("@/qiuui/image/icon/" + props.icon + ".png");

    //关闭模块 MSG
    function closetime(css) {
      setTimeout(function () {
        const modelDom = document.body.querySelector(css);
        if (modelDom) {
          document.body.removeChild(modelDom);
        }
      }, props.time);
    }
    onMounted(() => {
      let msg_more = document.getElementsByClassName("qiu-msg");
      let msg_rightTop = document.getElementsByClassName("qiu-msg-rightTop");
      let msg_leftTop = document.getElementsByClassName("qiu-msg-leftTop");
      let msg_rightDown = document.getElementsByClassName("qiu-msg-rightDown");
      let msg_leftDown = document.getElementsByClassName("qiu-msg-leftDown");

      //设置不同位置打开与关闭
      switch (props.area) {
        case "leftTop":
          if (msg_leftTop.length > 0) {
            for (let i = 0; i < msg_leftTop.length; i++) {
              msg_leftTop[i].style.top =
                msg_leftTop[i].offsetTop +
                msg_leftTop[i].offsetHeight +
                5 +
                "px";
            }
          }
          closetime(".qiu-msg-leftTop");
          break;
        case "leftDown":
          if (msg_leftDown.length > 0) {
            for (let i = 0; i < msg_leftDown.length; i++) {
              const cssbottom = msg_leftDown[i].style.bottom;
              const cssnum = Number(cssbottom.replace(/px/, ""));
              msg_leftDown[i].style.bottom =
                msg_leftDown[i].offsetHeight + cssnum + 5 + "px";
            }
          }
          closetime(".qiu-msg-leftDown");
          break;
        case "rightTop":
          if (msg_rightTop.length > 0) {
            for (let i = 0; i < msg_rightTop.length; i++) {
              msg_rightTop[i].style.top =
                msg_rightTop[i].offsetTop +
                msg_rightTop[i].offsetHeight +
                5 +
                "px";
            }
          }
          closetime(".qiu-msg-rightTop");
          break;
        case "rightDown":
          if (msg_rightDown.length > 0) {
            for (let i = 0; i < msg_rightDown.length; i++) {
              const cssbottom = msg_rightDown[i].style.bottom;
              const cssnum = Number(cssbottom.replace(/px/, ""));
              msg_rightDown[i].style.bottom =
                msg_rightDown[i].offsetHeight + cssnum + 5 + "px";
            }
          }
          closetime(".qiu-msg-rightDown");
          break;
        default:
          if (msg_more.length > 0) {
            for (let i = 0; i < msg_more.length; i++) {
              msg_more[i].style.top =
                msg_more[i].offsetTop - msg_more[i].offsetHeight - 5 + "px";
            }
          }
          closetime(".qiu-msg");
          break;
      }
    });

    return {
      msgicon,
      closetime,
    };
  },
});
</script>

<style scoped lang="scss">
.qiu-msg-container {
  .qiu-msg-icon {
    float: left;
    img {
      margin: 5px 5px 5px 10px;
      width: 25px;
      height: 25px;
    }
  }
  .qiu-msg-content {
    margin: 5px 10px 5px 5px;
    padding-top: 5px;
    float: left;
  }
}
.qiu-msg-container-info {
  .qiu-msg-shade {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    height: 30px;
    padding: 5px 15px;
    background: #000000;
    opacity: 0.6;
  }
  .qiu-msg-info {
    padding: 0 10px;
    height: 40px;
    background: none;
    color: rgb(255, 255, 255);
    line-height: 40px;
    z-index: 999999999;
  }
}
</style>
