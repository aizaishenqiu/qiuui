import { createVNode, render } from "vue";
import TableView from "./index.vue";

const Table = function (options) {
  // 创建div

  const container = document.createElement("div");
  const unique = OnlyID();
  container.id = "qiu-table-" + unique;
  options.tableid = "qiu-table-" + unique;
  // 创建虚拟节点
  const vm = createVNode(TableView, options);
  // 渲染虚拟节点
  render(vm, container);
  document.body.appendChild(container);
};
const OnlyID = function (n) {
  n = 1; // 生成一个唯一id，包含数字和字母
  var random = function () {
    // 生成10-12位不等的字符串
    return Number(Math.random().toString().substr(2)).toString(36); // 转换成十六进制
  };
  var arr = [];
  function createId() {
    var num = random();
    var _bool = false;
    arr.forEach((v) => {
      if (v === num) _bool = true;
    });
    if (_bool) {
      createId();
    } else {
      arr.push(num);
    }
  }
  var i = 0;
  while (i < n) {
    createId();
    i++;
  }
  return arr[0];
};

export default {
  // 组件注册
  install(app) {
    app.config.globalProperties.$qiuTable = Table;
  },
};
