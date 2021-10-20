<template>
  <div class="qiu-alert-container">
    <div class="qiu-alert-header">
      <div
        class="qiu-alert-title"
        @mousedown="move($event)"
        @mouseup="mouseup($event)"
      >
        {{ title }}
      </div>
      <div class="qiu-alert-close">
        <span @click="closealert">X</span>
      </div>
    </div>
    <div class="qiu-alert-main">
      <div class="qiu-alert-icon">
        <img :src="imageurl" />
      </div>
      <div class="qiu-alert-content">{{ content }}</div>
    </div>
    <div class="qiu-alert-btns">
      <div
        class="qiu-alert-cancle qiu-alert-btn"
        v-if="cancelText"
        :style="setCancleColor()"
        @click.prevent.stop="handleCancel"
      >
        {{ cancelText }}
      </div>
      <div
        class="qiu-alert-submit qiu-alert-btn"
        v-if="okText"
        :style="setOkColor()"
        @click.prevent.stop="handleOk"
      >
        {{ okText }}
      </div>
    </div>
  </div>
  <div v-if="shade != false" class="qiu-alert-shade" @click="shadeclose"></div>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Alert",
  props: {
    // 标题
    title: {
      type: String,
      default: "温馨提醒！",
    },
    // 内容
    content: {
      type: String,
      default: "网页警告！",
      required: true,
    },
    //图标
    icon: {
      type: [Number, String],
      default: 5,
    },
    // 确定按钮文字
    okText: {
      type: [Boolean, String],
      default: "确定",
    },
    // 确定按钮文字颜色
    okTextColor: {
      type: String,
      default: "#26a2ff",
    },
    // 取消按钮文字
    cancelText: {
      type: [Boolean, String],
      default: "取消",
    },
    // 取消按钮文字颜色
    cancleTextColor: {
      type: String,
      default: "#999",
    },
    // 成功回调
    success: {
      type: Function,
    },
    // 失败回调
    fail: {
      type: Function,
    },
    shade: {
      type: [Boolean, String],
      default: true,
    },
  },
  setup(props) {
    // ok的颜色
    const imageurl = require("@/qiuui/image/icon/" + props.icon + ".png");
    const setOkColor = () => {
      return `color: ${props.okTextColor}`;
    };
    // 取消的颜色
    const setCancleColor = () => {
      return `color: ${props.cancleTextColor}`;
    };
    function move(e) {
      let dv = e.currentTarget.parentElement.parentElement; //获取目标父元素
      let wl = dv.clientWidth / 2;
      let wr = document.documentElement.clientWidth - dv.clientWidth / 2;
      let ht = dv.clientHeight / 2;
      let hb = document.documentElement.clientHeight - dv.clientHeight / 2;

      //算出鼠标相对元素的位置
      let disX;
      let disY;
      disX = e.clientX - dv.offsetLeft;
      disY = e.clientY - dv.offsetTop;

      document.onmousemove = (e) => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        //移动当前元素
        if (left >= wl && left <= wr) {
          dv.style.left = left + "px";
        }
        if (top >= ht && top <= hb) {
          dv.style.top = top + "px";
        }
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
          e.stopPropagation();
        };
        return false;
      };
    }
    function mouseup(e) {
      document.onmousemove = null;
      document.onmouseup = null;
      e.stopPropagation();
    }
    // 移除当前组件
    function removeModal() {
      const modelDom = document.body.querySelector(`.qiu_alert`);
      if (modelDom) {
        document.body.removeChild(modelDom);
      }
    }

    //是否点击遮罩层关闭alert
    function shadeclose() {
      if (props.shade == "close") {
        removeModal();
      }
    }
    const closealert = () => {
      removeModal();
    };

    const handleCancel = () => {
      removeModal();
      props.fail && props.fail();
    };

    const handleOk = () => {
      removeModal();
      props.success && props.success();
    };

    return {
      imageurl,
      move,
      mouseup,
      shadeclose,

      closealert,
      setOkColor,
      setCancleColor,

      handleOk,
      handleCancel,
    };
  },
});
</script>
<style scoped lang="scss">
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
  user-select: none;
  .qiu-alert-header {
    height: 40px;
    border-bottom: 1px solid #e2e1e1;
    .qiu-alert-title {
      line-height: 40px;
      text-align: left;
      font-size: 14px;
      color: #000000;
      width: 265px;
      float: left;
      padding-left: 10px;
      cursor: move;
    }
    .qiu-alert-close {
      float: right;
      width: 25px;
      text-align: center;
      cursor: pointer;
      span {
        line-height: 20px;
        // border: 1px solid rgb(231, 231, 231);
        height: 20px;
        width: 20px;
        // border-radius: 10px;
        display: block;
        margin-top: 10px;
      }
      span:hover {
        background: #747373;
        color: #ffffff;
        height: 20px;
        width: 20px;
        border-radius: 10px;
        border: 1px solid rgb(255, 255, 255);
      }
    }
  }

  .qiu-alert-main {
    width: 300px;
    height: 80px;
    .qiu-alert-icon {
      position: absolute;
      left: 35px;
      top: 50%;
      transform: translateY(-50%);
      height: 25px;
      width: 25px;
      img {
        width: 25px;
        height: 25px;
      }
    }
    .qiu-alert-content {
      position: absolute;
      left: 65px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .qiu-alert-btns {
    // border-top: 1px solid #ddd;
    display: flex;
    height: 40px;
    position: relative;
    cursor: pointer;
    &:after {
      position: absolute;
      content: "";
      display: inline-block;
      left: 0;
      right: 0;
      top: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #ddd;
    }
    .qiu-alert-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      padding: 0 3px;
    }
    .qiu-alert-cancle {
      cursor: pointer;
      position: relative;
      &:after {
        position: absolute;
        content: "";
        display: inline-block;
        top: 0;
        right: 0;
        bottom: 0;
        width: 1px;
        transform: scaleX(0.5);
        background: #ddd;
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
.qiu-alert-shade {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 9999999;
  background: #000000;
  opacity: 0.3;
}
</style>
