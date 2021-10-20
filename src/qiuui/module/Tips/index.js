/**
 *
 * author:qiuye
 * @param Tps，
 * @param Version 1.0.1
 * @param VUE版本号 3.x
 * @param Time 2021-09-24
 * @param Email：yjk100@vip.qq.com
 * @param CopyRight qiuye
 *
 * */
import { createVNode, render } from "vue";
import TpsView from "./index.vue";

const Tps = function (options) {
  // 创建div
  const container = document.createElement("div");

  // 创建虚拟节点
  const vm = createVNode(TpsView, options);
  // 渲染虚拟节点
  render(vm, container);
  document.body.appendChild(container);
};

export default {
  // 组件注册
  install(app) {
    app.config.globalProperties.$qiuTps = Tps;
  },
};
