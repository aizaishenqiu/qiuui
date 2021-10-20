import { createVNode, render } from "vue";
import QiuPage from "./index.vue";
import { OnlyID } from "../../qiuui";

const Page = function (options) {
  // 创建div

  const container = document.createElement("div");
  const unique = OnlyID();
  container.id = "qiu-page-" + unique;
  options.pageid = "qiu-page-" + unique;

  // 创建虚拟节点
  const vm = createVNode(QiuPage, options);
  // 渲染虚拟节点
  render(vm, container);
  document.body.appendChild(container);
};

export default {
  // 组件注册
  install(app) {
    app.config.globalProperties.$qiuPage = Page;
  },
};
