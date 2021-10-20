<template>
  <div class="qiu-open-container" :style="setopen">
    <div class="qiu-open-resize" :style="resizeheight">
      <div
        v-if="title != false"
        class="qiu-open-header"
        :style="skin"
        @dblclick="maxopen($event, 'header')"
      >
        <div class="qiu-open-title" @mousedown="resizemove($event)">
          {{ title }}
        </div>
        <div class="qiu-open-menu">
          <span
            v-if="minbtn"
            class="qiu-open-menu-min"
            @click="minimenu($event)"
          ></span>
          <span
            v-if="maxbtn"
            class="qiu-open-menu-max"
            @click="maxopen($event)"
          ></span>
          <span class="qiu-open-close" @click="closemodel($event)"></span>
        </div>
      </div>
      <div class="qiu-open-main">
        <div v-if="type == 1" class="qiu-open-content">
          {{ content }}
        </div>
        <!-- 需要使用插槽模式 组件，必须使用模板写法 -->
        <div v-else-if="type == 2" class="qiu-open-content">
          <component v-bind:is="content"></component>
        </div>
        <!-- html代码模式 -->
        <div
          v-else-if="type == 3"
          class="qiu-open-content"
          v-html="content"
        ></div>
        <!-- iframe模式 -->
        <div v-else-if="type == 4" class="qiu-open-content">
          <iframe
            class="qiu-open-iframe"
            :src="content"
            frameborder="0"
          ></iframe>
        </div>
        <div v-else class="qiu-open-content">请设置弹窗开启参数！</div>
      </div>

      <div class="qiu-open-resize-top" @mousedown="reszitop($event)"></div>
      <div
        class="qiu-open-resize-bottom"
        @mousedown="resizebottom($event)"
      ></div>
      <div class="qiu-open-resize-left" @mousedown="resizeleft($event)"></div>
      <div class="qiu-open-resize-right" @mousedown="resizeright($event)"></div>
      <div
        class="qiu-open-resize-lefttop"
        @mousedown="resizelefttop($event)"
      ></div>
      <div
        class="qiu-open-resize-righttop"
        @mousedown="resizerighttop($event)"
      ></div>
      <div
        class="qiu-open-resize-leftdown"
        @mousedown="resizeleftdown($event)"
      ></div>
      <div
        class="qiu-open-resize-rightdown"
        @mousedown="resizerightdown($event)"
      ></div>
    </div>
  </div>

  <div
    v-if="shade !== false"
    class="qiu-open-shade"
    @click="closeshade($event)"
  ></div>
</template>

<script>
/**
 *
 * author:qiuye
 * @param open弹窗，
 * @param Version 1.0.1
 * @param VUE版本号 3.x
 * @param Time 2021-09-24
 * @param Email：yjk100@vip.qq.com
 * @param CopyRight qiuye
 *
 * */
import { defineComponent, nextTick, onMounted, reactive } from "vue";
import { qiuClose } from "../../index";
export default defineComponent({
  name: "QiuOpen",
  props: {
    title: {
      type: [String, Boolean],
      default: "",
    },
    type: {
      type: Number,
      default: 1,
    },
    content: {
      type: [Boolean, String, Number, Object, Array],
      default: "",
    },
    area: {
      type: Object,
      default() {
        const arr = ["200", "150"];
        return arr;
      },
    },
    shade: {
      type: [Boolean, String],
      default: true,
    },
    shadeclose: {
      type: [Boolean, String],
      default: false,
    },
    move: {
      type: Boolean,
      default: true,
    },
    skin: {
      type: String,
      default: "#ffffff",
    },
    minwindow: {
      type: Boolean,
      default: false,
    },
    function: {
      type: Function,
    },
    //弹窗唯一ID
    openid: {
      type: String,
      default: "",
    },
    //最大化按钮是否显示
    maxbtn: {
      type: Boolean,
      default: true,
    },
    //最小化按钮是否显示
    minbtn: {
      type: Boolean,
      default: true,
    },
    //最小化按钮是否显示
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    // 获取open元素
    const state = reactive({
      maxwin: "", //最大化参数
      maxchild: "", //最大化子元素
      maxcontent: "", //最大化子元素,内容
      reduction: true, //最大化，还原按钮
    });

    nextTick(() => {
      if (props.function) {
        props.function;
        props.function(props.openid);
      }
      // const xnode = document.getElementById(props.openid);
      if (props.fullscreen) {
        if (state.reduction == true) {
          fullmax();
        } else {
          state.reduction = false;
        }
      }

      //设置iframe不同状态下的显示情况
      if (props.type == 4) {
        //设置标题不显示时
        if (props.title == false) {
          setiframe(props.openid, 0);
        } else {
          setiframe(props.openid, 43);
        }
      } else {
        mainare();
      }
    });
    onMounted(() => {});

    // 设置iframe宽高
    const setiframe = (id, fpx) => {
      const Pnode = document.getElementById(id);
      const iframe = Pnode.getElementsByClassName("qiu-open-iframe")[0];
      iframe.style.width = Pnode.clientWidth + "px";
      iframe.style.height = Pnode.clientHeight - fpx + "px";
      if (props.title == false) {
        const main = Pnode.getElementsByClassName("qiu-open-main")[0];
        main.style.top = 0;
      }
    };
    //可视窗口宽度
    const winWidth = document.documentElement.clientWidth;
    //可视窗口高度
    const winHeight = document.documentElement.clientHeight;
    //元素居中设置
    const padtop = (winHeight - props.area[1]) / 2;
    const padleft = (winWidth - props.area[0]) / 2;

    //设置弹窗宽高
    const setopen = {
      position: "absolute",
      top: padtop + "px",
      left: padleft + "px",
      width: props.area[0] + "px",
      height: props.area[1] + "px",
      border: "1px solid #adadad",
    };

    const resizeheight = {
      width: props.area[0] + "px",
      height: props.area[1] + "px",
    };
    let startX, startY, owidth, oheight, oleft;
    const MAXWIDTH = 50; // 限制最大宽度
    const MAXHEIGHT = 50; // 限制最大高度
    //上拉伸
    function reszitop(e) {
      let Pnode = e.currentTarget.parentNode.parentNode;
      let Cnode = e.currentTarget.parentNode;
      startY = e.clientY;
      oheight = Pnode.offsetHeight;
      e.stopPropagation();
      document.onmousemove = function (e) {
        let moveY = e.clientY;
        let mHeight = startY - moveY;
        Pnode.style.top = moveY + "px";
        Cnode.style.height = Pnode.style.height =
          (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) -
          2 +
          "px";
      };
      resizemouseup(e);
    }
    //右侧拉伸
    function resizeright(e) {
      let Pnode = e.currentTarget.parentNode.parentNode;
      let Cnode = e.currentTarget.parentNode;
      startX = e.clientX;
      startY = e.clientY;
      oleft = Pnode.offsetLeft;
      owidth = Pnode.offsetWidth;
      e.stopPropagation();
      document.onmousemove = function (e) {
        let moveX = e.clientX;
        let mWidth = moveX - startX;
        Pnode.style.width = Cnode.style.width =
          (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) - 2 + "px";
      };
      resizemouseup(e);
    }
    //下拉伸
    function resizebottom(e) {
      let Pnode = e.currentTarget.parentNode.parentNode;
      let Cnode = e.currentTarget.parentNode;
      startY = e.clientY;
      oheight = Pnode.offsetHeight;
      e.stopPropagation();
      document.onmousemove = function (e) {
        let moveY = e.clientY;
        let mHeight = moveY - startY;
        Cnode.style.height = Pnode.style.height =
          (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) -
          2 +
          "px";
      };
      resizemouseup(e);
    }
    //左拉伸
    function resizeleft(e) {
      let Pnode = e.currentTarget.parentNode.parentNode;
      let Cnode = e.currentTarget.parentNode;
      startX = e.clientX;
      startY = e.clientY;
      oleft = Pnode.offsetLeft;
      owidth = Pnode.offsetWidth;
      e.stopPropagation();
      document.onmousemove = function (e) {
        let moveX = e.clientX;
        let mWidth = startX - moveX;
        Pnode.style.left = moveX + "px";
        Pnode.style.width = Cnode.style.width =
          (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) - 2 + "px";
      };
      resizemouseup(e);
    }

    //左上拉伸
    function resizelefttop(e) {
      let Pnode = e.currentTarget.parentNode.parentNode;
      let Cnode = e.currentTarget.parentNode;
      startX = e.clientX;
      startY = e.clientY;
      oleft = Pnode.offsetLeft;
      owidth = Pnode.offsetWidth;
      oheight = Pnode.offsetHeight;
      e.stopPropagation();
      document.onmousemove = function (e) {
        let moveX = e.clientX;
        let moveY = e.clientY;
        let mWidth = startX - moveX;
        let mHeight = startY - moveY;
        Pnode.style.left = moveX + "px";
        Pnode.style.top = moveY + "px";
        Pnode.style.width = Cnode.style.width =
          (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) + "px";
        Pnode.style.height = Cnode.style.height =
          (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) +
          "px";
      };
      resizemouseup(e);
    }
    //右上拉伸
    function resizerighttop(e) {
      let Pnode = e.currentTarget.parentNode.parentNode;
      let Cnode = e.currentTarget.parentNode;
      startX = e.clientX;
      startY = e.clientY;
      oleft = Pnode.offsetLeft;
      owidth = Pnode.offsetWidth;
      oheight = Pnode.offsetHeight;
      e.stopPropagation();
      document.onmousemove = function (e) {
        let moveX = e.clientX;
        let moveY = e.clientY;
        let mWidth = moveX - startX;
        let mHeight = startY - moveY;
        Pnode.style.left = oleft + "px";
        Pnode.style.top = moveY + "px";
        Pnode.style.width = Cnode.style.width =
          (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) + "px";
        Pnode.style.height = Cnode.style.height =
          (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) +
          "px";
      };
      resizemouseup(e);
    }
    //左下拉伸
    function resizeleftdown(e) {
      let Pnode = e.currentTarget.parentNode.parentNode;
      let Cnode = e.currentTarget.parentNode;
      startX = e.clientX;
      startY = e.clientY;
      oleft = Pnode.offsetLeft;
      owidth = Pnode.offsetWidth;
      oheight = Pnode.offsetHeight;
      e.stopPropagation();
      document.onmousemove = function (e) {
        let moveX = e.clientX;
        let moveY = e.clientY;
        let mWidth = startX - moveX;
        let mHeight = moveY - startY;
        Pnode.style.left = moveX - 2 + "px";
        Pnode.style.width = Cnode.style.width =
          (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) - 2 + "px";
        Pnode.style.height = Cnode.style.height =
          (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) -
          2 +
          "px";
      };
      resizemouseup(e);
    }

    //右下拉伸
    function resizerightdown(e) {
      let Pnode = e.currentTarget.parentNode.parentNode;
      let Cnode = e.currentTarget.parentNode;
      startX = e.clientX;
      startY = e.clientY;
      oleft = Pnode.offsetLeft;
      owidth = Pnode.offsetWidth;
      oheight = Pnode.offsetHeight;
      e.stopPropagation();
      document.onmousemove = function (e) {
        let moveX = e.clientX;
        let moveY = e.clientY;
        let mWidth = moveX - startX;
        let mHeight = moveY - startY;
        Pnode.style.left = oleft + "px";
        Pnode.style.width = Cnode.style.width =
          (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) + "px";
        Pnode.style.height = Cnode.style.height =
          (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) +
          "px";
      };
      resizemouseup(e);
    }
    //移动
    function resizemove(e) {
      let Pnode = e.currentTarget.parentNode.parentNode.parentNode; //获取目标父元素
      let wr = document.documentElement.clientWidth - Pnode.clientWidth;
      let hb = document.documentElement.clientHeight - Pnode.clientHeight;
      // //算出鼠标相对元素的位置
      let disX = e.clientX - Pnode.offsetLeft;
      let disY = e.clientY - Pnode.offsetTop;

      document.onmousemove = (e) => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        if (props.move) {
          //移动当前元素
          if (left >= 0 && left <= wr) {
            Pnode.style.left = left + "px";
          }
          if (top >= 0 && top <= hb) {
            Pnode.style.top = top + "px";
          }
        } else {
          Pnode.style.left = left + "px";
          Pnode.style.top = top + "px";
        }
      };
      resizemouseup(e);
    }

    //鼠标弹起
    function resizemouseup() {
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      return false;
    }
    //关闭当前
    function closemodel(e) {
      let Pnode =
        e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode; //获取目标父元素
      document.body.removeChild(Pnode);
    }

    //是否点击遮罩层关闭
    function closeshade() {
      if (props.shade == true) {
        qiuClose(props.openid);
      }
    }
    //全屏
    function fullmax() {
      const Pnode = document.getElementById(props.openid).firstElementChild;
      const Cnode = Pnode.firstChild;
      Cnode.style = Pnode.style =
        " position: absolute; top: 0; left: 0; right: 0; bottom: 0 ; z-index:999999999";
      state.maxwin =
        "width: " +
        Pnode.clientWidth +
        "px;height:" +
        Pnode.clientHeight +
        "px; left:" +
        Pnode.offsetLeft +
        "px;top:" +
        Pnode.offsetTop +
        "px;position:absolute;";
      state.maxchild =
        "width: " +
        Pnode.clientWidth +
        "px;height:" +
        Pnode.clientHeight +
        "px; ";
      if (props.title != false) {
        const Sicon = Pnode.getElementsByClassName("qiu-open-menu-max")[0];
        Sicon.className = "qiu-open-menu-max-full";
      }

      state.reduction = false;
    }
    //设置main高度
    function mainare() {
      if (props.title == false) {
        const Pnode = document.getElementById(props.openid).firstElementChild;
        const Cnode = Pnode.firstChild;
        const Main = Cnode.firstElementChild;
        Main.style =
          " position: absolute; top: 0; left: 0; right: 0; bottom: 0 ;";
      }
    }
    //最大化 ,//还原
    function maxopen(e, b) {
      let Pnode;
      if (b == "header") {
        Pnode = e.currentTarget.parentNode.parentNode; //获取目标双击父元素
      } else {
        Pnode = e.currentTarget.parentNode.parentNode.parentNode.parentNode; //获取目标父元素
      }

      let Cnode = Pnode.firstChild; //获取目标父元素

      //1：先记录现在弹窗宽高距离上，距离下
      if (props.fullscreen == true) {
        //设置初始化边距
        const Sleft =
          (document.documentElement.clientWidth - props.area[0]) / 2;
        const Stop =
          (document.documentElement.clientHeight - props.area[1]) / 2;
        state.maxwin =
          "width: " +
          props.area[0] +
          "px;height:" +
          props.area[1] +
          "px;z-index:999999999 ; left:" +
          Sleft +
          "px;top:" +
          Stop +
          "px;position:absolute;";
        state.maxchild =
          "width: " + props.area[0] + "px;height:" + props.area[1] + "px; ";
      }
      if (state.reduction) {
        if (props.title == false) {
          state.maxcontent = Pnode.clientHeight - 0 + "px";
        } else {
          state.maxcontent = Pnode.clientHeight - 43 + "px";
        }
        state.maxwin =
          "width: " +
          Pnode.clientWidth +
          "px;height:" +
          Pnode.clientHeight +
          "px; left:" +
          Pnode.offsetLeft +
          "px;top:" +
          Pnode.offsetTop +
          "px;position:absolute;";
        state.maxchild =
          "width: " +
          Pnode.clientWidth +
          "px;height:" +
          Pnode.clientHeight +
          "px; ";
        Cnode.style = Pnode.style =
          " position: absolute; top: 0; left: 0; right: 0; bottom: 0 ;";
        // 设置双击时最大化问题
        if (b == "header") {
          const Hmax =
            e.currentTarget.firstChild.nextSibling.firstChild.nextSibling;
          Hmax.className = "qiu-open-menu-max-full";
        } else {
          e.currentTarget.className = "qiu-open-menu-max-full";
        }

        Cnode.firstChild.nextSibling.style.height =
          Pnode.clientHeight - 43 + "px";
        state.reduction = false;
      } else {
        Pnode.style = state.maxwin;
        Cnode.style = state.maxchild;
        Cnode.firstChild.nextSibling.style.height = state.maxcontent;
        if (b == "header") {
          const Hmax =
            e.currentTarget.firstChild.nextSibling.firstChild.nextSibling;
          Hmax.className = "qiu-open-menu-max";
        } else {
          e.currentTarget.className = "qiu-open-menu-max";
        }

        state.reduction = true;
      }
    }

    //创建最小化窗口按钮
    function createmin() {
      // 1、body中是否存在minwindow，不存在则插入，
      const minwin = document.getElementById("miniwindow");
      if (!minwin) {
        const mw = document.createElement("div");
        mw.className = "qiu-open-minwindow";
        mw.id = "qiu-minwindow";
        document.body.appendChild(mw);
      }
    }

    //最小化窗口事件
    function minimenu(e) {
      // 1、body中是否存在minwindow，不存在则插入，
      let Pnode =
        e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode; //获取目标父元素
      const minwin = document.getElementById("qiu-miniwindow");
      if (!minwin) {
        const mw = document.createElement("div");
        mw.className = "qiu-open-miniwindow";
        mw.id = "qiu-miniwindow";
        document.body.appendChild(mw);
      }
      Pnode.style.display = "none";
      // 2 查询minid是否存在
      const miniID = document.getElementById("min-" + props.openid);

      if (!miniID) {
        const newwin = document.getElementById("qiu-miniwindow");
        const newmax = document.createElement("div");
        const miniclose = document.createElement("div");
        const md = document.createElement("div");
        const minititle = document.createElement("div");
        newmax.className = "qiu-minimax";
        md.className = "qiu-open-mini";
        miniclose.className = "qiu-open-min-close";
        minititle.className = "qiu-open-mini-title";
        md.id = "min-" + props.openid;
        minititle.innerText = props.title;
        newwin.appendChild(md);
        md.appendChild(minititle);
        md.appendChild(newmax);
        md.appendChild(miniclose);

        md.title = props.title;
        newmax.title = "还原";
        miniclose.title = "关闭窗口";
        const mininum = newwin.getElementsByClassName("qiu-open-mini");
        newmax.onclick = function () {
          Pnode.style.display = "block";
          newwin.removeChild(md);
        };
        miniclose.onclick = function () {
          qiuClose(props.openid);
          newwin.removeChild(md);
          if (mininum.length < 1) {
            document.body.removeChild(newwin);
          }
        };
      } else {
        console.log("yes");
      }
    }

    return {
      setopen,
      resizeheight,
      reszitop,
      resizeright,
      resizebottom,
      resizeleft,
      resizelefttop,
      resizerighttop,
      resizeleftdown,
      resizerightdown,
      resizemove,
      closemodel,
      closeshade,
      maxopen,
      createmin,
      minimenu,
      setiframe,
      fullmax,
      state,
      mainare,
    };
  },
});
</script>

<style lang="scss" scoped>
.qiu-open-container {
  box-shadow: 2px 2px 10px #363636;
  border-radius: 3px;
  font-size: 12px;
  background: #ffffff;
  z-index: 999999999;
  .qiu-open-resize {
    position: relative;
    .qiu-open-header {
      width: auto;
      height: 40px;
      border: 1px solid #eeeeee;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      .qiu-open-resize-top {
        cursor: n-resize;
        height: 2px;
      }
      .qiu-open-title {
        float: left;
        line-height: 40px;
        padding-left: 10px;
        cursor: move;
        width: calc(100% - 90px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .qiu-open-menu {
        float: right;
        // width: 80px;
        span {
          margin-top: 14px;
          margin-right: 8px;
          cursor: pointer;
        }
        .qiu-open-menu-min {
          width: 16px;
          height: 16px;
          background: url(../../image/img/qiu-open-menu.png) -1px -2px no-repeat;
          display: inline-block;
          &:hover {
            width: 16px;
            height: 16px;
            background: url(../../image/img/qiu-open-menu.png) -79px -2px
              no-repeat;
            display: inline-block;
          }
        }
        .qiu-open-menu-max {
          width: 16px;
          height: 16px;
          background: url(../../image/img/qiu-open-menu.png) -20px -2px
            no-repeat;
          display: inline-block;
          &:hover {
            width: 16px;
            height: 16px;
            background: url(../../image/img/qiu-open-menu.png) -98px -2px
              no-repeat;
            display: inline-block;
          }
        }
        .qiu-open-menu-max-full {
          width: 16px;
          height: 16px;
          background: url(../../image/img/qiu-open-menu.png) -59px -2px
            no-repeat;
          display: inline-block;
          &:hover {
            width: 16px;
            height: 16px;
            background: url(../../image/img/qiu-open-menu.png) -137px -2px
              no-repeat;
            display: inline-block;
          }
        }
        .qiu-open-close {
          // float: right;
          width: 16px;
          height: 16px;
          background: url(../../image/img/qiu-open-menu.png) -41px -2px
            no-repeat;
          display: inline-block;
          &:hover {
            width: 16px;
            height: 16px;
            background: url(../../image/img/qiu-open-menu.png) -119px -2px
              no-repeat;
            display: inline-block;
          }
        }
      }
    }
    .qiu-open-main {
      position: absolute;
      top: 43px;
      left: 1px;
      right: 1px;
      bottom: 2px;
      overflow: auto;
      .qiu-open-iframe {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        bottom: 2px;
        overflow: auto;
      }
    }
    .qiu-open-resize-top {
      position: absolute;
      top: -2px;
      left: 3px;
      right: 3px;
      height: 4px;
      cursor: n-resize;
    }
    .qiu-open-resize-right {
      position: absolute;
      right: -2px;
      top: 3px;
      bottom: 3px;
      width: 4px;
      cursor: e-resize;
    }
    .qiu-open-resize-bottom {
      position: absolute;
      bottom: -2px;
      left: 3px;
      right: 3px;
      height: 4px;
      cursor: n-resize;
    }
    .qiu-open-resize-left {
      position: absolute;
      left: -2px;
      top: 3px;
      bottom: 3px;
      width: 4px;
      cursor: e-resize;
    }
    .qiu-open-resize-lefttop {
      position: absolute;
      left: -3px;
      top: -3px;
      width: 6px;
      height: 6px;
      cursor: se-resize;
    }
    .qiu-open-resize-righttop {
      position: absolute;
      right: -3px;
      top: -3px;
      width: 6px;
      height: 6px;
      cursor: ne-resize;
    }
    .qiu-open-resize-rightdown {
      position: absolute;
      right: -3px;
      bottom: -3px;
      width: 6px;
      height: 6px;
      cursor: se-resize;
    }
    .qiu-open-resize-leftdown {
      position: absolute;
      left: -3px;
      bottom: -3px;
      width: 6px;
      height: 6px;
      cursor: ne-resize;
    }
  }
}
.qiu-open-shade {
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
