<template>
  <button
    v-if="param.type == 'btn'"
    :class="skinclass(param.skin) + skinsize(param.size)"
    @click="param.fun"
  >
    <i :class="param.icon"></i> {{ state.text }}
  </button>

  <div v-else class="qiu-btn-group">
    <button
      v-for="(item, index) in param"
      :key="index"
      :class="skinclass(item.skin) + skinsize(item.size)"
      @click="groupfun(item.fun)"
    >
      <i :class="item.icon"></i> {{ item.text }}
    </button>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "QiuButton",
  props: {
    param: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const qiubtn = reactive(props.param);

    const state = reactive({
      text: skintext(),
      skin: skinclass(),
      type: qiubtn.type || "btn",
      size: skinsize(),
    });
    function skinclass(a) {
      if (qiubtn.type == "btn") {
        switch (a) {
          case "blue":
            return "qiu-btn-blue";
          case "green":
            return "qiu-btn-green";
          case "purple":
            return "qiu-btn-purple";
          case "orange":
            return "qiu-btn-orange";
          case "dark":
            return "qiu-btn-dark";
          case "red":
            return "qiu-btn-red";
          default:
            return "qiu-btn-normal";
        }
      } else {
        switch (a) {
          case "blue":
            return "qiu-group-blue";
          case "green":
            return "qiu-group-green";
          case "purple":
            return "qiu-group-purple";
          case "orange":
            return "qiu-group-orange";
          case "dark":
            return "qiu-group-dark";
          case "red":
            return "qiu-group-red";
          default:
            return "qiu-group-normal";
        }
      }
    }
    function skinsize(a) {
      switch (a) {
        case "sm":
          return "-sm";
        case "bg":
          return "-bg";
        case "min":
          return "-min";
        default:
          return "";
      }
    }
    function skintext() {
      if (qiubtn.type != "group") {
        if (qiubtn.text) {
          return qiubtn.text;
        } else {
          return "确定";
        }
      }
    }
    function groupfun(a) {
      if (a) {
        a();
      }
    }
    return {
      qiubtn,
      state,
      skinclass,
      skinsize,
      skintext,
      groupfun,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../css/qiuui.css";
/* 单个按钮 */

// .qiu-btn-blue {
//   background: blue;
// }

// .qiu-btn-blue {
//   -moz-box-shadow: inset 0px 1px 0px 0px #29bbff;
//   -webkit-box-shadow: inset 0px 1px 0px 0px #29bbff;
//   box-shadow: inset 0px 1px 0px 0px #29bbff;
//   background: -webkit-gradient(
//     linear,
//     left top,
//     left bottom,
//     color-stop(0.05, #2dabf9),
//     color-stop(1, #0688fa)
//   );
//   background: -moz-linear-gradient(top, #2dabf9 5%, #0688fa 100%);
//   background: -webkit-linear-gradient(top, #2dabf9 5%, #0688fa 100%);
//   background: -o-linear-gradient(top, #2dabf9 5%, #0688fa 100%);
//   background: -ms-linear-gradient(top, #2dabf9 5%, #0688fa 100%);
//   background: linear-gradient(to bottom, #2dabf9 5%, #0688fa 100%);
//   // filter: progid: DXImageTransform.Microsoft.gradient(startColorstr='#2dabf9', endColorstr='#0688fa', GradientType=0);
//   background-color: #2dabf9;
//   -webkit-border-radius: 6px;
//   -moz-border-radius: 6px;
//   border-radius: 6px;
//   border: 1px solid #41b6e0;
//   display: inline-block;
//   cursor: pointer;
//   color: #ffffff;
//   font-size: 12px;
//   padding: 6px 10px;
//   text-decoration: none;
//   text-shadow: 0px 1px 0px #2c5ceb;
// }
// .qiu-btn-blue:hover {
//   background: -webkit-gradient(
//     linear,
//     left top,
//     left bottom,
//     color-stop(0.05, #0688fa),
//     color-stop(1, #2dabf9)
//   );
//   background: -moz-linear-gradient(top, #0688fa 5%, #2dabf9 100%);
//   background: -webkit-linear-gradient(top, #0688fa 5%, #2dabf9 100%);
//   background: -o-linear-gradient(top, #0688fa 5%, #2dabf9 100%);
//   background: -ms-linear-gradient(top, #0688fa 5%, #2dabf9 100%);
//   background: linear-gradient(to bottom, #0688fa 5%, #2dabf9 100%);
//   // filter: progid: DXImageTransform.Microsoft.gradient(startColorstr='#0688fa', endColorstr='#2dabf9', GradientType=0);
//   background-color: #0688fa;
// }

// .qiu-btn-blue:active {
//   border: 1px solid #41b6e0;
// }
</style>
