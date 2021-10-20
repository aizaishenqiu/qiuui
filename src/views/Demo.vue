<template>
  <div>
    <div class="title">demo测试页面</div>
    <hr />
    <div><span>Alert测试</span><button @click="btnalert">Alert</button></div>
    <hr />
    <div><span>消息测试</span><button @click="btnmsg">MSG</button></div>
    <hr />
    <div>
      <span>弹窗测试</span>
      <button @click="btnopen">普通弹窗</button
      ><button @click="btncom">组件弹窗</button>
      <button @click="btnfull">全屏弹窗</button>
      <button @click="btnhtml">全屏无标题Html弹窗</button
      ><button @click="btniframe">iframe弹窗</button>
    </div>
    <div style="width: 100px; height: 30px">
      <qiu-select :sedata="seldata"></qiu-select>
    </div>
    <hr />
    <div>
      <span>表格测试</span>
      <div id="qiu-table-demo"></div>
    </div>
  </div>
</template>

<script>
import AB from "./Home.vue";
import { qiuAlert, qiuMsg, qiuOpen, qiuTable } from "../qiuui";
import { nextTick } from "vue";
import QiuButton from "../qiuui/module/Button/index.vue";
import QiuSelect from "../qiuui/module/Select/index.vue";
export default {
  components: {
    QiuSelect,
  },

  setup() {
    const seldata = {
      data: [
        { text: "测试1", value: "1" },
        { text: "测试2", value: "2" },
      ],
    };
    nextTick(() => {
      qiuTable({
        elem: "qiu-table-demo", //ID
        celledit: "dbl", //td点击方式 ，编辑点击方式 dbl双击，单击 sin
        cellodd: "#ccc", //是否显示单双行不同烟色，默认不显示，颜色可自定义
        // hover: "blue",  //鼠标经过颜色 默认true
        // color: "red",  //td文字颜色
        toolbar: [
          {
            set: [
              {
                component: QiuButton,
                type: "group",
                class: "qiu-toolbar-left",
                param: [
                  {
                    type: "group",
                    text: "增加",
                    icon: "fa fa-plus",
                    skin: "blue",
                    size: "",
                  },
                  {
                    type: "group",
                    text: "删除",
                    icon: "fa fa-minus",
                    skin: "red",
                    size: "",
                    fun: function () {
                      console.log("删除");
                    },
                  },
                ],
              },
              {
                component: QiuButton,
                type: "btn",
                text: "减少",
                // skin: "blue",
                size: "",
                class: "qiu-toolbar-right",
                fun: function () {
                  console.log("减少");
                },
              },
            ],
          },
        ],

        cols: [
          { type: "checkbox", field: "xuan", title: "选择", fixed: "left" },
          { type: "text", field: "id", title: "ID" },
          {
            type: "text",
            field: "name",
            title: "名称",
            edit: true,
            sort: true,
            screen: true,
          },
          {
            type: "text",
            field: "code",
            title: "编码",
            template: {
              type: 1,
              fun: (a) => {
                // console.log(a, b, c);
                if (a == "1-01-02") {
                  return "编码标签";
                } else {
                  return "编码";
                }
              },
            },
          },
          {
            type: "select",
            field: "cat",
            title: "类型",
            width: 120,
            sai: true,
            // set: [
            //   { val: "是", text: "是" },
            //   { val: "否", text: "否" },
            // ],
          },
          { type: "text", field: "unit", title: "单位", width: 100 },
          {
            type: "text",
            field: "price",
            edit: true,
            title: "单价",
            width: 100,
          },
          {
            type: "text",
            field: "sale",
            title: "数量",
            edit: true,
            require: true,
          },
          {
            type: "text",
            field: "total",
            title: "总价",
            total: {
              type: "row", //row为行计算，cell为列计算
              format: [2, ".", ","], //0:小数点，1：小数点符号，2：千分位符号
              // 数据格式化格式后12,345.06
              sum: "sale*price", //需支持复杂打运算符号含括号但不支持大括号运算
            },
          },
          {
            type: "select",
            field: "free",
            title: "赠品",
            edit: true,
            set: [
              { val: "是", text: "是" },
              { val: "否", text: "否" },
            ],
          },
          { type: "text", field: "ku", title: "库存" },
          { type: "text", field: "remark", title: "备注" },
          {
            type: "template",
            field: "tem",
            title: "操作",
            template: {
              type: 2,
              fun: (a, b, c, d) => {
                // a:val b:key,c:index,d:data
                // 支持组件 ，返回组件就可以了
                // 可直接返回处理后蹲字符串，单type必须等于1
                // 温馨提醒：button组不能个单个button共存
                return [
                  {
                    component: QiuButton,
                    type: "group",
                    param: [
                      {
                        type: "group",
                        text: "增加",
                        icon: "fa fa-plus-circle",
                        skin: "blue",
                        size: "sm",
                      },
                      {
                        type: "group",
                        text: "删除",
                        skin: "red",
                        size: "sm",
                        icon: "fa fa-trash-o",
                        fun: function () {
                          console.log("删除");
                          console.log(a, b, c, d);
                        },
                      },
                    ],
                  },
                  // {
                  //   component: QiuButton, //组件名称
                  //   param: {
                  //     //这里传入你自定义的组件参数
                  //     //组件蹲参数
                  //     text: "修改",
                  //     type: "btn",
                  //     size: "sm",
                  //   },
                  // },
                  // {
                  //   component: QiuButton, //组件名称
                  //   param: {
                  //     //组件蹲参数
                  //     // text: "删除",
                  //     skin: "blue",
                  //     size: "sm",
                  //     type: "btn",
                  //     fun: () => {
                  //       console.log(a, b, c, d);
                  //     },
                  //   },
                  // },
                ];
              },
            },
          },
          { type: "template", field: "tem2", title: "操作2" },
        ],
        data: [
          {
            id: "1",
            name: "可乐",
            cat: "饮料",
            code: "1-01-01",
            free: "否",
            price: "1.0",
            unit: "听",
            ku: "300",
            sale: "1",
            total: "0.00",
            remark: "这是一种饮料",
          },
          {
            id: "2",
            name: "雪碧",
            cat: "饮料",
            code: "1-01-02",
            free: "否",
            price: "2.0",
            unit: "听",
            ku: "200",
            sale: "1",
            total: "0.00",
            remark: "这是一种饮料",
          },
          {
            id: "3",
            name: "香槟",
            cat: "酒水",
            code: "2-01-01",
            free: "否",
            price: "3.0",
            unit: "瓶",
            ku: "30",
            sale: "1",
            total: "0.00",
            remark: "这是一种酒",
          },
          {
            id: "4",
            name: "茅台",
            cat: "酒水",
            code: "2-01-01",
            free: "否",
            price: "4.0",
            unit: "瓶",
            ku: "300",
            sale: "1",
            total: "0.00",
            remark: "这是一种酒",
          },
          {
            id: "5",
            name: "啤酒",
            cat: "饮料",
            code: "2-01-01",
            free: "否",
            price: "5",
            unit: "瓶",
            ku: "3000",
            sale: "1",
            total: "0.00",
            remark: "这是一种酒",
          },
          {
            id: "6",
            name: "香槟",
            cat: "饮料",
            code: "2-01-01",
            free: "否",
            price: "6.0",
            unit: "瓶",
            ku: "30",
            sale: "1",
            total: "0.00",
            remark: "这是一种酒",
          },
          {
            id: "7",
            name: "可乐",
            cat: "饮料",
            code: "1-01-01",
            free: "否",
            price: "7.0",
            unit: "听",
            ku: "300",
            sale: "1",
            total: "0.00",
            remark: "这是一种饮料",
          },
          {
            id: "8",
            name: "雪碧",
            cat: "饮料",
            code: "1-01-02",
            free: "否",
            price: "8.0",
            unit: "听",
            ku: "200",
            sale: "1",
            total: "0.00",
            remark: "这是一种饮料",
          },
          {
            id: "9",
            name: "香槟",
            cat: "酒水",
            code: "2-01-01",
            free: "否",
            price: "9.0",
            unit: "瓶",
            ku: "30",
            sale: "1",
            total: "0.00",
            remark: "这是一种酒",
          },
          {
            id: "10",
            name: "茅台",
            cat: "酒水",
            code: "2-01-01",
            free: "否",
            price: "10.0",
            unit: "瓶",
            ku: "300",
            sale: "1",
            total: "0.00",
            remark: "这是一种酒",
          },
        ],
        checkboxdata: function (a) {
          console.log(a);
        },
        footer: [
          {
            text: "合计",
          },
          {
            text: "大写",
          },
          {
            key: "total",
            rmb: true,
            rowspan: 5,
          },
          {
            text: "小计",
          },
          {
            total: true,
            key: "total",
            format: [2, ".", ","],
          },
          {
            rowspan: 5,
          },
        ],
        page: {
          url: "http://test.cn/table",
          setlimit: [5, 10, 15, 20],
        },
      });
    });
    function btnalert() {
      qiuAlert("确认信息！");
      // qiuAlert('是否删除或者晋级？', {
      //     title: '是否晋级？',
      //     icon: 'warning',
      //     cancelText: '取消',
      //     okText: '晋级',
      //     success: function () {
      //         console.log('成功后事件执行');
      //     },
      //     fail: function () {
      //         console.log('取消后事件执行');
      //     },
      //     shade: 'close',
      // });
    }
    function btnmsg() {
      qiuMsg("简单的消息提示ms！简单的消息提示ms！简单的消息提示ms！");
      qiuMsg("简单的消息提示LT！", { icon: 3, time: 4000, area: "leftTop" });
      qiuMsg("简单的消息提示RT！", { icon: 3, time: 4000, area: "rightTop" });
      qiuMsg("简单的消息提示LD！", { icon: 3, time: 4000, area: "leftDown" });
      qiuMsg("简单的消息提示RD！", { icon: 3, time: 4000, area: "rightDown" });
    }
    function btnopen() {
      qiuOpen({
        type: 1, //1普通弹窗 2:iframe,3:html
        title: "我是长长的标题，弹窗标题！一个会笑的标题(~_~)!", //标题
        content: "我是弹窗测试", //支持插槽，html，string，iframe
        area: ["600", "400"], //宽，高
        shade: true, //true显示遮罩，false不显示，默认true
        shadeclose: true, //TRUE可以点击遮罩关闭，
        move: false, //true,限制在可视框内，false不限制,默认true
        skin: "", //标题颜色  默认#ffffff
        // maxbtn: false, //最大化按钮是否显示
        // minbtn: false, //最小化按钮
        function: function (a) {
          // 参数a为当前元素的ID
          console.log(a);
        },
        fullscreen: false, //是否开启全屏 默认不开启 false
      });
    }
    function btncom() {
      qiuOpen({
        type: 2, //1普通弹窗 2:iframe,3:html
        title: "插槽内容标题，弹窗标题！一个会笑的标题(~_~)!", //标题
        content: AB, //引入组件，然后直接填写组件名，无需注册组件，
        // 需要注意的是，组件内容的宽高若大于设置弹出宽高，则会显示差异，放大拉伸就正常了
        //另外 引入组件时 记得把外部css一起引入
        area: ["900", "600"], //宽，高
        shade: true, //非必填
        fullscreen: false, //是否开启全屏 默认不开启 false
      });
    }
    function btnfull() {
      qiuOpen({
        type: 2, //1普通弹窗 2:iframe,3:html
        title: "打开暨全屏插槽内容标题，弹窗标题！一个会笑的标题(~_~)!", //标题
        content: AB, //引入组件，然后直接填写组件名，无需注册组件，
        // 需要注意的是，组件内容的宽高若大于设置弹出宽高，则会显示差异，放大拉伸就正常了
        //另外 引入组件时 记得把外部css一起引入
        area: ["900", "600"], //宽，高
        shade: true, //非必填
        fullscreen: true, //是否开启全屏 默认不开启 false
      });
    }
    function btnhtml() {
      qiuOpen({
        type: 3, //1普通弹窗 2:组件,3:html 4，ifame
        // title: "Html内容标题，弹窗标题！一个会笑的标题(~_~)!", //标题
        title: false,
        content: "<div>Html格式，前后被div包住</div>", //引入组件，然后直接填写组件名，无需注册组件，
        // 需要注意的是，组件内容的宽高若大于设置弹出宽高，则会显示差异，放大拉伸就正常了
        //另外 引入组件时 记得把外部css一起引入
        area: ["1200", "800"], //宽，高
        shade: true,
        shadeclose: true,
        fullscreen: true, //是否开启全屏 默认不开启 false
      });
    }
    function btniframe() {
      qiuOpen({
        type: 4, //1普通弹窗 2:组件,3:html 4，ifame
        title: "iframe内容标题，弹窗标题！一个会笑的标题(~_~)!", //标题
        // title: false, //标题
        content: "https://www.qq.com", //引入组件，然后直接填写组件名，无需注册组件，
        // 需要注意的是，组件内容的宽高若大于设置弹出宽高，则会显示差异，放大拉伸就正常了
        //另外 引入组件时 记得把外部css一起引入
        area: ["1200", "800"], //宽，高
        shade: true,
      });
    }
    return {
      btniframe,
      btnhtml,
      btnalert,
      btnmsg,
      btnopen,
      btncom,
      btnfull,
      seldata,
    };
  },
};
</script>

<style lang="scss">
body {
  height: 1800px;
}
</style>
