<template>
  <div class="qiu-page">
    <ul>
      <li v-if="pageset.current == 1">
        <a class="banclick" :class="pageset.skinclass">首页</a>
      </li>
      <li v-if="pageset.current > 1">
        <a
          :class="pageset.skinclass"
          @click="(pageset.current = 1), pageClick()"
          >首页</a
        >
      </li>
      <li v-if="pageset.current > 1">
        <a :class="pageset.skinclass" @click="pageset.current--, pageClick()"
          >上一页</a
        >
      </li>
      <li v-if="pageset.current == 1">
        <a class="banclick" :class="pageset.skinclass">上一页</a>
      </li>
      <li v-for="index in pages" :key="index" :class="getskin(index)">
        <a :class="pageset.skinclass" @click="btnClick(index)">{{ index }}</a>
      </li>
      <li v-if="pageset.current != pageset.totalpage">
        <a :class="pageset.skinclass" @click="pageset.current++, pageClick()"
          >下一页</a
        >
      </li>
      <li v-if="pageset.current == pageset.totalpage">
        <a class="banclick" :class="pageset.skinclass">下一页</a>
      </li>
      <li v-if="pageset.current != pageset.totalpage">
        <a
          :class="pageset.skinclass"
          @click="(pageset.current = pageset.totalpage), pageClick()"
        >
          尾页
        </a>
      </li>
      <li v-if="pageset.current == pageset.totalpage">
        <a class="banclick" :class="pageset.skinclass">尾页</a>
      </li>
      <li>
        <span v-if="checklimit()">
          <select class="qiu-select-limit" @change="changelimit($event)">
            <option v-for="se in page.setlimit" :key="se" :value="se">
              {{ se }}
            </option>
          </select>
        </span>
        <span>
          第
          <i :class="pageset.iclass">{{ pageset.current }}</i>
          页
        </span>
        <span class="qiu-btn">
          <input
            class="qiu-page-turn"
            type="text"
            @keydown.enter="turnpage($event)"
          />
          <button :class="pageset.turnclass" @click="turnpage($event, true)">
            跳
          </button>
        </span>
        <span>
          共
          <i :class="pageset.iclass">{{ pageset.totalpage }}</i>
          页
        </span>

        <span>
          共
          <i :class="pageset.iclass">{{ pageset.totalnum }}</i>
          条
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, nextTick, reactive } from "vue";
import { qiuMsg } from "../../index";
import axios from "axios";
export default {
  name: "QiuPage",
  props: {
    limit: {
      type: Number,
      default: 10,
    },
    current: {
      type: Number,
      default: 1,
    },
    language: {
      type: String,
      default: "zh-cn",
    },
    elem: String,
    skin: String,
    first: String,
    previous: String,
    next: String,
    last: String,
    content: String,
    total: Number,
    url: String,
    webpage: Boolean,
    webcurrent: Boolean,
    webnum: Boolean,
    pageid: {
      type: String,
    },
    setlimit: {
      type: Array,
      default() {
        return [10, 20, 30, 50, 100];
      },
    },
    callback: {
      type: Function,
    },
  },
  setup(props) {
    const page = reactive(props);
    const pages = computed(() => {
      let start = Number(1);
      let end = Number(pageset.totalpage);
      let arr = [];

      if (pageset.totalpage >= 10) {
        if (pageset.current > 4 && pageset.current < pageset.totalpage - 4) {
          start = Number(pageset.current) - 4;
          end = Number(pageset.current) + 5;
        } else if (pageset.current <= 4) {
          start = 1;
          end = 10;
        } else {
          start = Number(pageset.totalpage) - 9;
          end = Number(pageset.totalpage);
        }
      }
      while (start <= end) {
        arr.push(start);
        start++;
      }
      return arr;
    });
    const pageset = reactive({
      Pagedata: [],
      totalpage: 0, //总页数
      current: 1, //当前页码
      totalnum: 0, //当前总条数,
      pageturn: "",
      url: "",
      turnclass: "qiu-btn-normal-sm",
      skinclass: "a-normal",
      iclass: "i-normal",
      currentlimt: 10,
      limit: props.limit,
    });

    nextTick(() => {
      init();
    });

    //如果不是测试环境，将此方法到init中
    function dataListFn(index) {
      if (page.url) {
        axios
          .get(page.url, {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
            params: {
              page: index,
              limit: pageset.limit,
            },
          })
          .then((res) => {
            if (page.callback) {
              page.callback(res.data);
            }
          });
      }
    }
    //分页
    function btnClick(data) {
      //页码点击事件
      if (data != this.current) {
        pageset.current = data;
      }
      //根据点击页数请求数据
      dataListFn(pageset.current.toString());
    }
    function pageClick() {
      //根据点击页数请求数据
      dataListFn(pageset.current.toString());
    }
    function turnpage(e, b) {
      let numReg = /^[0-9]*$/;
      let number = new RegExp(numReg);
      let pageall = Math.ceil(pageset.totalnum / page.limit);
      if (b) {
        let last = e.currentTarget.previousElementSibling.value;
        if (last != "") {
          if (number.test(last)) {
            if (last <= pageall) {
              pageset.current = last;
              dataListFn(pageset.current.toString());
            } else {
              qiuMsg("您输入的页码大于总页码1", { icon: 2 });
              return false;
            }
          } else {
            qiuMsg("请输入正确的页码！", { icon: 2 });
            return false;
          }
        } else {
          qiuMsg("请输入您要跳转的页码！", { icon: 5 });
          return false;
        }
      } else {
        if (e.keyCode == 13) {
          let vpage = e.currentTarget.value;
          if (vpage != "") {
            if (number.test(page)) {
              if (page > pageall) {
                qiuMsg("您输入的页码大于总页码", { icon: 2 });
                return false;
              } else {
                console.log(vpage);
                pageset.current = vpage;
                dataListFn(pageset.current.toString());
              }
            } else {
              qiuMsg("请输入正确的页码！", { icon: 2 });
              return false;
            }
          } else {
            qiuMsg("请输入您要跳转的页码！", { icon: 5 });
            return false;
          }
        }
      }
    }
    function init() {
      let pagecotainer = document
        .getElementById(page.elem)
        .getElementsByClassName("qiu-table-page")[0];
      let pageID = document.getElementById(props.pageid);
      pagecotainer.appendChild(pageID);
      if (!page.url) {
        qiuMsg("请配置数据来源地址！", { icon: 5 });
        return false;
      } else {
        //初始化设置
        //获取数据
        // console.
        axios
          .get(page.url, {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
            },
            params: {
              page: 1,
              limit: pageset.limit,
            },
          })
          .then((res) => {
            if (res.code != "0") {
              if (res.data.data.length > "0") {
                pageset.totalpage = Math.ceil(res.data.count / page.limit);
                pageset.totalnum = res.data.count;
                if (page.callback) {
                  page.callback(res.data);
                }
              } else {
                console.error("返回参数错误！");
                return false;
              }
            } else {
              console.log("参数错误或者url地址错误");
              return false;
            }
          });

        switch (page.skin) {
          case "orange":
            pageset.skinclass = "a-orange";
            pageset.iclass = "i-orange";
            return "active-orange";
          case "purple":
            pageset.skinclass = "a-purple";
            pageset.iclass = "i-purple";
            return "active-purple";
          case "red":
            pageset.skinclass = "a-red";
            pageset.iclass = "i-red";
            return "active-red";
          case "green":
            page.skinclass = "a-green";
            pageset.iclass = "i-green";
            return "active-green";
          case "blue":
            pageset.skinclass = "a-blue";
            pageset.iclass = "i-blue";
            return "active-blue";
          default:
            pageset.skinclass = "a-normal";
            pageset.iclass = "i-normal";
            return "active";
        }
      }
    }
    function getskin(b) {
      if (pageset.current == b) {
        switch (pageset.skin) {
          case "orange":
            pageset.skinclass = "a-orange";
            return "active-orange";
          case "purple":
            pageset.skinclass = "a-purple";
            return "active-purple";
          case "red":
            pageset.skinclass = "a-red";
            return "active-red";
          case "green":
            pageset.skinclass = "a-green";
            return "active-green";
          case "blue":
            pageset.skinclass = "a-blue";
            return "active-blue";
          default:
            pageset.skinclass = "a-normal";
            return "active";
        }
      }
    }
    function checklimit() {
      if (page.setlimit) {
        return true;
      } else {
        return false;
      }
    }
    function changelimit(e) {
      pageset.limit = e.currentTarget.value;
      dataListFn(pageset.current.toString());
    }
    return {
      dataListFn,
      btnClick,
      pageClick,
      turnpage,
      init,
      getskin,
      checklimit,
      changelimit,
      page,
      pageset,
      pages,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../../css/common.scss";
/*分页*/
.qiu-page {
  margin-top: 10px;
  font-size: 12px;
  color: #1e1e1f;
  user-select: none;
  a {
    color: #1e1e1f;
  }
  ul,
  li {
    padding: 0px;
    margin: 0px;
    li {
      list-style: none;
      &:first-child > a {
        margin-left: 0px;
      }
      //默认normal
      .a-normal {
        position: relative;
        float: left;
        padding: 5px 10px;
        margin-right: 3px;
        margin-left: -1px;
        text-decoration: none;
        cursor: pointer;
        border: 1px solid #ddd;

        &:hover {
          color: #ffffff;
          background-color: #000000;
        }
      }
      //橙色
      .a-orange {
        position: relative;
        float: left;
        padding: 5px 10px;
        margin-right: 3px;
        margin-left: -1px;
        text-decoration: none;
        cursor: pointer;
        border: 1px solid #ddd;
        &:hover {
          color: #ffffff;
          background-color: #ffab23;
        }
      }
      //蓝色色
      .a-blue {
        position: relative;
        float: left;
        padding: 5px 10px;
        margin-right: 3px;
        margin-left: -1px;
        text-decoration: none;
        cursor: pointer;
        border: 1px solid #ddd;
        &:hover {
          color: #ffffff;
          background-color: #2dabf9;
        }
      }
      //红色
      .a-red {
        position: relative;
        float: left;
        padding: 5px 10px;
        margin-right: 3px;
        margin-left: -1px;
        text-decoration: none;
        cursor: pointer;
        border: 1px solid #ddd;
        &:hover {
          color: #ffffff;
          background-color: #fe1a00;
        }
      }
      //绿色
      .a-green {
        position: relative;
        float: left;
        padding: 5px 10px;
        margin-right: 3px;
        margin-left: -1px;
        text-decoration: none;
        cursor: pointer;
        border: 1px solid #ddd;
        &:hover {
          color: #ffffff;
          background-color: #a5cc52;
        }
      }
      //橙色
      .a-purple {
        position: relative;
        float: left;
        padding: 5px 10px;
        margin-right: 3px;
        margin-left: -1px;
        text-decoration: none;
        cursor: pointer;
        border: 1px solid #ddd;
        &:hover {
          color: #ffffff;
          background-color: #c123de;
        }
      }
      .a-olive {
        position: relative;
        float: left;
        padding: 5px 10px;
        margin-right: 3px;
        margin-left: -1px;
        text-decoration: none;
        cursor: pointer;
        border: 1px solid #ddd;
        &:hover {
          color: #ffffff;
          background-color: $olive;
        }
      }
      .banclick {
        cursor: not-allowed;
        &:hover {
          color: #5d6062;
          background: #ffffff;
        }
      }
      span {
        display: inline-block;
        // margin-top: 6px;
        margin-left: 5px;
        color: #7c7c7c;
        .qiu-select-limit {
          padding: 3px 0;
          // margin-top: -3px;
          outline: none;
        }
        .i-normal {
          margin: 0px 4px;
          font-size: 12px;
          font-style: normal;
          color: $dark;
        }
        .i-blue {
          margin: 0px 4px;
          font-size: 12px;
          font-style: normal;
          color: $blue;
        }
        .i-red {
          margin: 0px 4px;
          font-size: 12px;
          font-style: normal;
          color: $red;
        }
        .i-green {
          margin: 0px 4px;
          font-size: 12px;
          font-style: normal;
          color: $green;
        }
        .i-purple {
          margin: 0px 4px;
          font-size: 12px;
          font-style: normal;
          color: $purple;
        }
        .i-orange {
          margin: 0px 4px;
          font-size: 12px;
          font-style: normal;
          color: $orange;
        }
        .qiu-page-turn {
          width: 18px;
          margin-right: 2px;
          outline: none;
          &:active {
            outline: none;
          }
          &:hover {
            outline: none;
          }
        }
      }
    }
  }
  .active {
    a {
      color: #ffffff;
      cursor: default;
      background-color: $dark;
      border-color: $dark;
    }
  }
  .active-blue {
    a {
      color: #ffffff;
      cursor: default;
      background-color: $blue;
      border-color: $blue;
    }
  }
  .active-orange {
    a {
      color: #ffffff;
      cursor: default;
      background-color: $orange;
      border-color: $orange;
    }
  }
  .active-purple {
    a {
      color: #ffffff;
      cursor: default;
      background-color: $purple;
      border-color: $purple;
    }
  }
  .active-red {
    a {
      color: #ffffff;
      cursor: default;
      background-color: $red;
      border-color: $red;
    }
  }
  .active-green {
    a {
      color: #ffffff;
      cursor: default;
      background-color: $green;
      border-color: $green;
    }
  }
}
</style>
