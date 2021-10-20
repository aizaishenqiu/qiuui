import { createVNode, render } from "vue";
import componentConstructor from "./index.vue";

const Msg = function (options) {
  // 创建div
  const container = document.createElement("div");
  switch (options.area) {
    case "leftTop":
      container.className = "qiu-msg-leftTop";
      break;
    case "leftDown":
      container.className = "qiu-msg-leftDown";
      break;
    case "rightTop":
      container.className = "qiu-msg-rightTop";
      break;
    case "rightDown":
      container.className = "qiu-msg-rightDown";
      break;
    default:
      container.className = `qiu-msg`;
      break;
  }

  // 创建虚拟节点
  const vm = createVNode(componentConstructor, options);
  // 渲染虚拟节点
  render(vm, container);
  document.body.appendChild(container);
};

export default {
  // 组件注册
  install(app) {
    app.config.globalProperties.$qiuMsg = Msg;
  },
};
