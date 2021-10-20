import { createVNode, render } from "vue";
import qiualert from "../module/Alert/index.vue";

const AlertN = function (options) {
  // 创建div
  const container = document.createElement("div");
  container.className = `qiu-alert`;
  //创建虚拟节点
  const vm = createVNode(qiualert, options);
  //渲染虚拟节点
  render(vm, container);
  document.body.appendChild(container);
};

export default {
  //组件注册
  install(app) {
    app.config.globalProperties.$qiuAlert = AlertN;
  },
};
