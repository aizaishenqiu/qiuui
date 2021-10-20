<template>
  <div class="qiu-table-container">
    <div v-if="toolbar != false" class="qiu-toolbar">
      <div v-for="(item, index) in toolbar" :key="index">
        <div v-for="(tcm, bind) in item.set" :key="bind" :class="tcm.class">
          <component
            v-if="tcm.type == 'group'"
            :param="tcm.param"
            v-bind:is="tcm.component"
          ></component>
          <component v-else :param="tcm" v-bind:is="tcm.component"></component>
        </div>
      </div>
    </div>
    <table class="qiu-table">
      <thead>
        <tr>
          <th v-for="(item, index) in cols" :key="index" :width="item.width">
            <div class="qiu-table-head-title" v-if="item.type == 'checkbox'">
              <input
                type="checkbox"
                v-model="state.checkAll"
                @change="checkall(unidata)"
              />
            </div>
            <div class="qiu-table-head-title" v-else>
              <span>{{ item.title }}</span>
              <!-- 排序 -->
              <div v-if="item.sort" class="qiu-table-sort">
                <a
                  class="qiu-sanjiao-up"
                  @click="sortdown('up', item.field, $event)"
                ></a>
                <a
                  class="qiu-sanjiao-down"
                  @click="sortdown('down', item.field, $event)"
                ></a>
              </div>
              <!-- 筛选 -->
              <span v-if="item.sai" class="qiu-table-sai">
                <span class="sai-span" @click="datasai(index, $event)"></span>
                <div class="qiu-table-sai-dropdown" @mouseleave="saileave">
                  <div class="qiu-table-sai-list">
                    <input
                      v-model="state.AllSaiCheck"
                      type="checkbox"
                      value="全选"
                      checked
                      @change="saiclick('Allsai', '', $event)"
                    />
                    全选
                    <span>
                      (
                      <span style="color: red">{{ saivalall() }}</span>
                      )
                    </span>
                  </div>
                  <div
                    v-for="(sai, sa) in state.checksaidata"
                    :key="sa"
                    class="qiu-table-sai-list"
                  >
                    <input
                      type="checkbox"
                      name="checksainame"
                      checked
                      @change="saiclick(sai, sa, $event)"
                    />
                    {{ sai }}
                    <span>
                      (
                      <span style="color: green">{{ saivalnum(sai) }}</span>
                      )
                    </span>
                  </div>
                </div>
              </span>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in unidata" :key="index">
          <td v-for="(val, key) in item" :key="key" class="qiu-table-cell">
            <div
              v-if="checktype(key) == 'checkbox'"
              class="qiu-table-checkbox-div"
            >
              <input
                type="checkbox"
                v-model="state.checkdata"
                :value="item"
                @change="checkone()"
              />
            </div>
            <div v-else-if="checktype(key) == 'radio'">
              <input type="radio" v-model="state.radiodata" />
            </div>
            <div v-else-if="checktype(key) == 'number'">1</div>
            <div
              v-else-if="
                checktemp(key) == 'set' && checktype(key) == 'template'
              "
            >
              {{ tempset(key, val) }}
            </div>
            <div v-else-if="checktotal(key, index) == 'true'">
              {{ rowtotal(key, index) }}
            </div>
            <div
              v-else
              @click="cellclick($event, key, index)"
              @dblclick="celldblclick($event, key, index)"
            >
              <span v-if="checktemp(key) == 'temp'">
                <div v-if="temptype(val, key) == 'component'">
                  <component
                    v-for="(cm, inm) in template(val, key, index, item)"
                    :key="inm"
                    :param="cm.param"
                    v-bind:is="cm.component"
                  ></component>
                </div>
                <div v-else>{{ template(val, key) }}</div>
              </span>
              <span v-else>{{ val }}</span>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="footer">
        <tr>
          <td
            v-for="(foot, index) in footer"
            :key="index"
            :colspan="foot.rowspan"
          >
            <span v-if="foot.total">
              <span v-if="foot.format">
                {{
                  number_format(
                    celltotal(foot.key),
                    foot.format[0],
                    foot.format[1],
                    foot.format[2]
                  )
                }}
              </span>
              <span v-else> {{ celltotal(foot.key) }}</span>
            </span>
            <!-- 处理total数据需传入当前列的key， -->
            <span v-else-if="foot.rmb">
              {{ changgeRMB(celltotal(foot.key)) }}
            </span>
            <span v-else>{{ foot.text }}</span>

            <!-- 处理total等事宜 v-if -->
          </td>
        </tr>
      </tfoot>
    </table>
    <div v-if="page" class="qiu-table-page"></div>
  </div>
</template>

<script>
import "../../css/qiuui.css";
import { qiuMsg, qiuPage } from "../../index";
import { RMB, NFM } from ".././../qiuui";
import { computed, nextTick, onMounted, reactive, watch } from "vue";
export default {
  name: "QiuTable",
  props: {
    elem: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "auto",
    },
    tableid: {
      type: String,
      default: "",
    },
    cols: {
      type: Object,
      default: null,
    },
    head: {
      type: Object,
      default: null,
    },
    data: {
      type: Object,
      default: null,
    },
    checkboxdata: {
      type: Function,
      default: Function,
    },
    celledit: {
      type: String,
      default: "dbl",
    },
    cellodd: {
      type: [Boolean, String],
      default: false,
    },
    hover: {
      type: [Boolean, String],
      default: "#dfdede",
    },
    color: {
      type: String,
      default: "#1f1e1e",
    },
    toolbar: {
      type: Array,
      // default: false,
    },
    footer: {
      type: Array,
    },
    page: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    //定义原始数据，方便后期操作
    // if (props.page && props.data) {
    //   qiuMsg("本地数据和网络数据不能同时存在", { icon: 2 });
    //   console.info("table：本地数据和网络数据不能同时存在")
    //   return false;
    // }
    // const state.pagedata = reactive(props.data);

    const state = reactive({
      checkAll: false,
      checkdata: [],
      radiodata: [],
      cellcolor: "#ececec",
      //计算属性的相关设置
      sumnum: /[0-9]/,
      sumop: /[()/*\-+]/,
      sumspec: /[)/*+.]/,
      sumbig: /[/*]/,
      sumsmall: /[+-]/,
      sumfdm: /[(#]/,
      fornum: "", //格式数据
      //计算属性设置结束
      nindex: 0, // 设置上限按键的行数
      // 赛选
      checksaifirst: [],
      checksai: [],
      checksainum: 0,
      checksaidata: [],
      saidatalist: "",
      saikey: "",
      saimodel: [],
      AllSaiCheck: true,

      // 工具条
      // choosedata: [],
      choosechecked: true,
      choosedisplay: false,
      choosenum: 0,
      choosedata: [],
      AllChooseChecked: true,
      searchkey: "",
      mouseback: "",

      // left focus
      leftkey: 0,

      // page data
      pagedata: props.data,
    });

    // 加载完成后需要处理数据在nextTick中进行
    nextTick(() => {
      // if (props.page && props.data) {
      //   qiuMsg("本地数据和网络数据不能同时存在", { icon: 2 });
      //   return false;
      // }
      //1、将插件移动至指定位置(elem) 暂时注释掉
      // const elid = document.getElementById(props.elem);
      // const container = document.getElementById(props.tableid).firstChild;
      // document.body.removeChild(container.parentNode);
      // elid.appendChild(container);
      // console.log(state.pagedata);
      //初始化筛选数据
      state.choosenum = props.cols.length;
      // if (props.cellodd != false) {
      //   trodd();
      // }

      //如果是网络数据
      if (props.page) {
        getpagedata();
      } else {
        state.pagedata = reactive(props.data);
      }
    });
    watch(
      () => state.pagedata,
      () => {
        const Pnode =
          document
            .getElementById(props.elem)
            .getElementsByTagName("table")[0] ||
          document
            .getElementById(props.tableid)
            .getElementsByTagName("table")[0];
        //是否设置斑马纹
        if (props.cellodd != false) {
          trodd();
        }

        // 鼠标经过行
        if (props.hover) {
          trhover();
        }

        //设置cell文字颜色
        if (props.color) {
          const dv =
            Pnode.getElementsByTagName("tbody")[0].getElementsByTagName("td");
          for (let i = 0; i < dv.length; i++) {
            dv[i].style.color = props.color;
          }
        }
      }
    );
    onMounted(() => {
      // 直接修改数据，方法如下
      // state.pagedata[1] = "sing"; //
      // console.log(state.pagedata); // 修改后的数据
      // console.log(unialldata(props.cols));
      // unialldata(props.cols);
    });
    const unidata = computed(() => {
      //调整数据，使数据符合标题的字段顺序

      //初始化数据保存
      return unialldata(props.cols, state.pagedata);
    });
    // 入果网络获取数据，page为真，
    function getpagedata() {
      let page = props.page;
      qiuPage({
        url: page.url,
        limit: page.limit,
        setlimit: page.setlimit,
        language: page.language,
        elem: props.tableid,
        skin: page.skin,
        first: page.first,
        previous: page.previous,
        next: page.next,
        last: page.last,
        callback: (data) => {
          state.pagedata = data.data;
        },
      });
    }

    function checkall(a) {
      //发送checkboxdata到前台
      if (state.checkAll) {
        state.checkdata = a;
      } else {
        state.checkdata = [];
      }

      if (props.checkboxdata) {
        if (state.checkdata.length > 0) {
          props.checkboxdata(delfield(state.checkdata));
        }
      }
    }
    //单个checkbox改变
    //获取单个选中值
    function checkone() {
      //当当前显示数量
      if (state.checkdata.length == state.pagedata.length) {
        //如果单个checkbox的数量等于表格条数，则全选选中
        state.checkAll = true;
      } else {
        state.checkAll = false;
      }
      //发送checkboxdata到前台
      if (props.checkboxdata) {
        if (state.checkdata.length > 0) {
          props.checkboxdata(delfield(state.checkdata));
        }
      }
    }
    // 删除不必要的字段
    function delfield(data) {
      let a = props.cols;
      let b = deepClone(data);
      for (let i = 0; i < a.length; i++) {
        let ck = a[i].field;
        switch (a[i].type) {
          case "checkbox":
            b.forEach((item) => {
              delete item[ck];
            });
            break;
          case "template":
            b.forEach((item) => {
              delete item[ck];
            });
            break;
          case "radio":
            b.forEach((item) => {
              delete item[ck];
            });
            break;
        }
      }
      return b;
    }
    // 深度克隆
    function deepClone(obj) {
      let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
      return objClone;
    }
    //根具字段查找数据a中的下标
    //a是字段数据，b是返回数据
    //使输出的数据与标题数据对标
    function findindex(a, b) {
      const AB = [];
      a.forEach((x) => {
        if (x.field) {
          AB.push(x);
        }
      });
      return b.map((v) => {
        let c = {};
        AB.forEach((e) => {
          c[e.field] = v[e.field];
        });
        return c;
      });
    }

    //
    //
    /***
     * 合并所有数据
     *  @param 参数说明：
     *  @param  a 表头数据
     *  @param  b 本地数据或网络数据
     *  @return 合并后数据
     */
    function unialldata(a, b) {
      for (let i = 0; i < a.length; i++) {
        switch (a[i].type) {
          case "checkbox":
            b.forEach((item) => {
              item["checbox"] = "true";
            });
            break;
          case "template":
            b.forEach((item) => {
              item["template"] = a[i].set;
            });
            break;
          case "radio":
            b.forEach((item) => {
              item["radio"] = true;
            });
            break;
          default:
            break;
        }
      }

      return findindex(a, b);
    }
    // 处理数据，使数据正常显示
    //检查当前字段的属性TYPE
    //a为字段
    function checktype(a) {
      let newtype = "";
      props.cols.forEach((i) => {
        if (i.field == a) {
          if (i.type == "text") {
            if (i.edit) {
              newtype = "edit";
            }
          } else {
            newtype = i.type;
          }
        }
      });

      return newtype;
    }
    /**
     * @param 处理template
     * @param 参数配置
     * @param key： 字段felid
     * @author qiuye
     * @time   2021-10-11
     *
     */
    function checktemp(key) {
      let newset = false;
      props.cols.forEach((i) => {
        if (i.field == key) {
          if (i.set) {
            newset = "set";
          } else if (i.template) {
            newset = "temp";
          }
        }
      });

      return newset;
    }
    /**
     * @param 处理typpe==template
     * @param 参数配置
     * @param key： 字段felid
     * @param index 下标
     * @param val 数值
     * @author qiuye
     * @time   2021-10-11
     *
     */
    function tempset(key) {
      props.cols.forEach((i) => {
        if (i.field == key) {
          if (i.set) {
            i.set.fun(key);
          }
        }
      });
    }
    /**
     * @param 处理template
     * @param 参数配置
     * @param key： 字段felid
     * @param index 下标
     * @param val 数值
     * @author qiuye
     * @time   2021-10-11
     *
     */
    function template(val, key, index, item) {
      let fun;
      props.cols.forEach((i) => {
        if (i.field == key) {
          if (i.template) {
            fun = i.template.fun(val, key, index, item);
          }
        }
      });
      return fun;
    }
    /**
     * @param 处理template
     * @param 参数配置
     * @param key： 字段felid
     * @param index 下标
     * @param val 数值
     * @author qiuye
     * @time   2021-10-11
     *
     */
    function temptype(val, key) {
      let type;
      props.cols.forEach((i) => {
        if (i.field == key) {
          if (i.template) {
            if (i.template.type == 2) {
              type = "component";
            } else {
              type = "text";
            }
          }
        }
      });
      return type;
    }
    function isChrome360() {
      if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
        let desc =
          navigator.mimeTypes[
            "application/x-shockwave-flash"
          ].description.toLowerCase();
        if (desc.indexOf("adobe") > -1) {
          return true;
        }
      }
      return false;
    }
    // 判断浏览器类型
    function checknav() {
      let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      let isOpera = userAgent.indexOf("Opera") > -1;
      let browse = navigator.userAgent.toLowerCase();
      if (isOpera) {
        //判断是否Opera浏览器
        return "Opera";
      }
      if (userAgent.indexOf("Firefox") > -1) {
        //判断是否Firefox浏览器
        return "FF";
      }
      if (userAgent.indexOf("Chrome") > -1) {
        //判断是否Chrome浏览器,其中搜狗，360也是chrome内核 需重新判断
        return "Chrome";
      }

      if (browse.indexOf("se 2.x") > 1) {
        return "Sogou";
      }

      if (userAgent.indexOf("Safari") > -1) {
        //判断是否Safari浏览器
        return "Safari";
      }
      if (
        userAgent.indexOf("compatible") > -1 &&
        userAgent.indexOf("MSIE") > -1 &&
        !isOpera
      ) {
        //判断是否IE浏览器
        return "IE";
      }
    }
    // 单元格单击事件
    function cellclick(e, key, index) {
      if (checktype(key) == "edit") {
        if (props.celledit == "sin") {
          editinput(e, key, index);
        }
      }
    }

    // 单元格双击事件
    function celldblclick(e, key, index) {
      if (checktype(key) == "edit") {
        if (props.celledit == "dbl") {
          editinput(e, key, index);
        }
      }
    }
    // 编辑方法 支持vue3
    /*
     *
     *
     * 内容：鼠标点击元素执行编辑
     * 运行方式：鼠标单击或双击
     * @param e：元素
     * @param key 字段
     * @param index  下标
     * @param type 鼠标按下方式
     * @patam tp 最大index
     * @param data 源数据
     * @author qiuye
     * @time  2021-09-29
     *
     */

    function editinput(e, key, index, type, tp) {
      let el = "";
      if (!type) {
        el = e.currentTarget.parentNode;
      } else {
        el = e.parentNode;
      }
      // 按下箭头上 最大index设置，不设置将出现bug
      if (type == "up") {
        //
        if (tp) {
          let vn = tp.node.nextElementSibling;
          let pn = tp.node;
          if (!pn) {
            return false;
          }
          pn.style.display = "";
          pn.firstChild.innerText = vn.value;
          pn.parentNode.removeChild(vn);
          state.pagedata[tp.ind][key] = vn.value;
        }
      }

      const nav = checknav();
      const edit = document.createElement("input");
      edit.className = "qiu-table-cell-edit";
      let ua = navigator.userAgent.toLowerCase();
      edit.className = "qiu-table-cell-edit";
      if (nav == "Chrome") {
        if (ua.indexOf("se 2.x") > 1) {
          //sougou
          edit.style.width = "calc(100% - 2px)";
        } else {
          edit.style.width = "calc(100% - 6px)";
        }
      } else if (nav == "FF") {
        edit.style.width = "calc(100% - 6px)";
      } else {
        // 其他浏览器
        edit.style.width = "calc(100% - 2px)";
      }
      // chrom内核的360浏览器
      try {
        // 360;
        if (isChrome360()) {
          edit.style.width = "calc(100% - 2px)";
        }
      } catch (e) {
        e;
      }

      edit.placeholder = "请输入内容";
      edit.value = el.firstChild.innerText;
      el.firstChild.style.display = "none";
      el.appendChild(edit);
      edit.focus();

      // 鼠标离开事件
      edit.onmouseleave = function () {
        editleave(edit, key, index);
      };

      // 按键按下

      edit.onkeydown = function (d) {
        watchkey(d, key, index);
        if (
          d.keyCode == 13 ||
          d.keyCode == 37 ||
          d.keyCode == 38 ||
          d.keyCode == 39 ||
          d.keyCode == 40
        ) {
          editleave(edit, key, index, type, tp);
        }
      };
    }

    /*
     *
     *
     *内容：编辑后鼠标离开事件
     *运行方式：鼠标离开
     * @param e：元素
     * @param key 字段
     * @param index  下标
     * @param data  源数据
     *@author qiuye
     *@time  2021-09-29
     *
     */

    function editleave(e, key, index, type, tp) {
      switch (type) {
        case "down":
          if (index > state.pagedata.length - 2) {
            return;
          }
          break;
        case "up":
          if (index < 0) {
            return;
          }
          break;
        case "left":
          if (!checkedit(key, "left")) {
            return;
          }
          break;
        case "right":
          if (!checkedit(key, "right")) {
            return;
          }
          break;
        default:
          break;
      }
      if (tp) {
        if (e.previousSibling) {
          // 处理index一开始就最大时，箭头上按下处理事件
          e.previousSibling.style.display = "";
          e.previousSibling.firstChild.innerText = e.value;
          e.parentNode.removeChild(e);
          // 修改源数据
          state.pagedata[index][key] = e.value;
        }
      } else {
        if (!e.previousSibling) {
          return false;
        }
        e.previousSibling.style.display = "";
        e.previousSibling.firstChild.innerText = e.value;
        e.parentNode.removeChild(e);
        // 修改源数据
        state.pagedata[index][key] = e.value;
      }
    }

    /*
     *
     *
     *内容：监听鼠标按下事件
     *运行方式：鼠标离开
     * @param e：元素
     * @param key 字段
     * @param index  下标
     * @param data  源数据
     * @param keycode  13enter 37down 38up 39right 40left
     *@author qiuye
     *@time  2021-09-29
     *
     */

    function watchkey(e, key, index) {
      // 当前按下的input框j节点
      let node = e.currentTarget;
      switch (e.keyCode) {
        case 13:
          // enter键按下
          downfocus(key, index, props.elem, props.tableid);
          break;
        case 40:
          downfocus(key, index, props.elem, props.tableid);
          break;
        case 37:
          //左LEFT箭头按下
          leftfocus(node, key, index);

          break;
        case 39:
          //右Right按下
          rightfocus(node, key, index);
          break;
        case 38:
          //箭头上UP按下
          upfocus(key, index, props.elem, props.tableid);
          break;
        default:
          break;
      }
    }

    /*
     *
     *
     * 内容：监听键盘箭头上按下
     * 运行方式：鼠标离开
     * @param e：元素
     * @param key 字段
     * @param index  下标
     * @param data  源数据
     * @param keycode  13enter 37down 38up 39right 40left
     * @author qiuye
     * @time  2021-09-29
     *
     */
    function upfocus(key, index, id, oid) {
      // 需要配合table使用
      let row; //当index=0时，row=1; 否则row=index;
      if (index < 0) {
        return false;
      }
      if (index > 0 && index < state.pagedata.length) {
        row = index;
      } else {
        row = 1;
      }
      let table =
        document.getElementById(id).getElementsByTagName("table")[0] ||
        document.getElementById(oid).getElementsByTagName("table")[0];
      let cell;
      for (let i = 0; i < props.cols.length; i++) {
        if (props.cols[i].field == key) {
          cell = i;
        }
      }
      let newnode;
      if (index == 0) {
        newnode = table.rows[1].cells[cell].firstChild;
        editinput(newnode, key, 0, "up");
      } else if (index == state.pagedata.length - 1) {
        newnode = table.rows[row].cells[cell].firstChild;
        let Inode = table.rows[row + 1].cells[cell].firstChild;
        editinput(newnode, key, index - 1, "up", {
          node: Inode,
          ind: state.pagedata.length - 1,
        });
      } else {
        newnode = table.rows[row].cells[cell].firstChild;
        editinput(newnode, key, index - 1, "up");
      }
    }

    /*
     *
     *
     * 内容：监听键盘箭头右按下
     * 运行方式：鼠标离开
     * @param e：元素
     * @param key 字段
     * @param index  下标
     * @param data  源数据
     * @param keycode  13enter 37down 38up 39right 40left
     * @author qiuye
     * @time  2021-09-29
     *
     */
    function rightfocus(node, key, index) {
      // 往右的一个input元素
      let cell;
      let newkey;
      let leftnd = false;
      for (let i = 0; i < props.cols.length; i++) {
        if (props.cols[i].field == key) {
          if (i == 0) {
            cell = 0;
          } else {
            cell = i + 1;
          }
          leftnd = props.cols[cell].edit;
          newkey = props.cols[cell].field;
        }
      }
      let rightedit = node.parentNode.nextSibling.firstChild;
      // 如果可以编辑
      if (leftnd == true) {
        editinput(rightedit, newkey, index, "right");
      } else {
        return false;
      }
    }

    function downfocus(key, index, id, oid) {
      // 需要配合table使用
      //node= table.rows[row-1].cells[index];
      let row; //当index=0时，row=1; 否则row=index+1; 因为table多一行thead，

      if (index >= state.pagedata.length - 1) {
        return false;
      }
      if (index < state.pagedata.length - 1 || index > 0) {
        row = index + 2;
      } else {
        row = 2;
      }
      let table =
        document.getElementById(id).getElementsByTagName("table")[0] ||
        document.getElementById(oid).getElementsByTagName("table")[0];
      let cell;
      for (let i = 0; i < props.cols.length; i++) {
        if (props.cols[i].field == key) {
          cell = i;
        }
      }
      let newnode;

      if (index <= state.pagedata.length - 2) {
        newnode = table.rows[row].cells[cell].firstChild;
        editinput(newnode, key, index + 1, "down");
      } else if (index == state.pagedata.length - 1) {
        newnode = table.rows[row - 1].cells[cell].firstChild;
        editinput(newnode, key, index, "down");
      }
    }
    function checkedit(key, type) {
      let cell;
      let leftnd;
      for (let i = 0; i < props.cols.length; i++) {
        if (props.cols[i].field == key) {
          if (i == 0) {
            cell = 0;
          } else {
            if (type == "left") {
              cell = i - 1;
            } else {
              cell = i + 1;
            }
          }
          leftnd = props.cols[cell].edit;
        }
      }
      if (!leftnd) {
        return false;
      } else {
        return true;
      }
    }

    function leftfocus(node, key, index) {
      let cell;
      let newkey;
      let leftnd = false;
      for (let i = 0; i < props.cols.length; i++) {
        if (props.cols[i].field == key) {
          if (i == 0) {
            cell = 0;
          } else {
            cell = i - 1;
          }
          leftnd = props.cols[cell].edit;
          newkey = props.cols[cell].field;
        }
      }

      // 如果可以编辑
      if (leftnd == true) {
        let leftedit = node.parentNode.previousSibling.firstChild;
        editinput(leftedit, newkey, index, "left");
      } else {
        return false;
      }
    }

    //设置表格行鼠标经过事件
    function trhover() {
      const Pnode = document
        .getElementById(props.tableid)
        .getElementsByTagName("tbody")[0];
      const trnum = Pnode.getElementsByTagName("tr");
      for (let i = 0; i < trnum.length; i++) {
        trnum[i].onmouseenter = function () {
          state.mouseback = trnum[i].style.background;
          trnum[i].style.background = props.hover;
        };
        trnum[i].onmouseleave = function () {
          trnum[i].style.background = state.mouseback;
        };
      }
    }

    //设置表格奇数偶数行显示颜色
    function trodd() {
      if (props.cellodd != true) {
        state.cellcolor = props.cellodd;
      }
      const Pnode = document
        .getElementById(props.tableid)
        .getElementsByTagName("tbody")[0];
      const trnum = Pnode.getElementsByTagName("tr");
      setTimeout(function () {
        for (let i = 0; i < trnum.length; i++) {
          if (i % 2 !== 1) {
            trnum[i].style.background = "";
          } else {
            trnum[i].style.background = state.cellcolor;
          }
        }
      }, 1);
    }
    //
    // 计算开始----
    //a字段，检查是否存在编辑
    function checktotal(a) {
      let cell = "";
      props.cols.forEach((i) => {
        if (i.field == a) {
          if (i.total) {
            cell = "true";
          } else {
            cell = "false";
          }
        }
      });
      return cell;
    }
    //计算行数据
    function rowtotal(key, b) {
      let nb;
      props.cols.forEach((i) => {
        if (i.field == key) {
          if (i.total) {
            let a = state.pagedata;
            let str = i.total.sum;
            let nh = a.map((v) =>
              str.replace(/[a-z]+/g, (a) => (v[a] !== undefined ? v[a] : a))
            );
            nh.forEach((item, index) => {
              if (b == index) {
                let newrmb = sumtotal(item);
                //是否格式化金额
                if (i.total.format) {
                  nb = number_format(
                    newrmb,
                    i.total.format[0],
                    i.total.format[1],
                    i.total.format[2]
                  );
                } else {
                  nb = newrmb;
                }
              }
            });
          }
        }
      });
      // 修改源数据的total值
      state.pagedata[b].total = nb;
      return nb;
    }

    // 计算列合计
    function celltotal(key) {
      let num = [];
      for (let i in state.pagedata) {
        for (let keyd in state.pagedata[i]) {
          if (keyd == key) {
            num.push(Number(state.pagedata[i][key].replace(/,/g, "")));
          }
        }
      }
      return num.reduce(function (total, n) {
        return total + n;
      }, 0);
    }

    //计算
    // -------------------
    function sumchange(char1, char2) {
      let v1, v2;
      if (state.sumbig.test(char1)) v1 = 2;
      if (state.sumbig.test(char2)) v2 = 2;
      if (state.sumsmall.test(char1)) v1 = 1;
      if (state.sumsmall.test(char2)) v2 = 1;
      if (state.sumfdm.test(char1)) v1 = 0;
      if (state.sumfdm.test(char2)) v2 = 0;
      return v1 > v2;
    }
    function solve(num1, op, num2) {
      switch (op) {
        case "-":
          return num1 - num2;
        case "+":
          return num1 + num2;
        case "*":
          return num1 * num2;
        case "/":
          if (num2 == 0) return "?";
          return num1 / num2;
      }
    }
    function sumtotal(a) {
      //网上找的代码，的作者不详，感谢分享,根据vue3.x模式改编
      let q1 = [],
        qq1 = [],
        q1t = 0,
        q1h = 0,
        q2 = [],
        qq2 = [],
        q2t = 0,
        q2h = 0,
        s = [],
        ss = 1;
      s[0] = "#";
      let preIsOp = 0,
        pointExist = 0,
        st = a;
      preIsOp = 0;
      st = "0+(" + st + ")+0";
      for (let i = 0; i < st.length; i++) {
        if (preIsOp == 0 && state.sumspec.test(st.charAt(i))) {
          console.error("连续输入符号或两端为运算符");
          return 0;
        }
        if (preIsOp == 1 && st.charAt(i) == "(") {
          console.error("左括号前缺少运算符");
          return 0;
        }
        if (st.charAt(i) == "-") {
          if (st.charAt(i + 1) == "-") {
            console.error("连续输入减号");
            return 0;
          }
          if (preIsOp == 1) {
            qq1[q1h] = 1;
            q1[q1h] = "+";
            q1h++;
          }
          qq1[q1h] = 0;
          q1[q1h] = -1;
          q1h++;
          qq1[q1h] = 1;
          q1[q1h] = "*";
          q1h++;
          preIsOp = 0;
          continue;
        }
        if (state.sumnum.test(st.charAt(i))) {
          preIsOp = 1;
          pointExist = 0;
          let temp = parseFloat(st.charAt(i) - "0");
          while (
            (state.sumnum.test(st.charAt(i + 1)) || st.charAt(i + 1) == ".") &&
            i < st.length
          ) {
            i++;
            if (st.charAt(i) == ".") {
              if (pointExist > 0) {
                console.error("多个小数点");
                return 0;
              } else {
                pointExist = 1;
                continue;
              }
            }
            if (pointExist == 0)
              temp = parseFloat(st.charAt(i) - "0") + temp * 10;
            else {
              temp += parseFloat(st.charAt(i) - "0") / Math.pow(10, pointExist);
              pointExist++;
            }
          }
          q1[q1h] = temp;
          qq1[q1h] = 0;
          q1h++;
          continue;
        } else if (!state.sumop.test(st.charAt(i))) {
          console.error("非法字符");
          return 0;
        }
        q1[q1h] = st.charAt(i);
        qq1[q1h] = 1;
        q1h++;
        preIsOp = 0;
        if (st.charAt(i) == ")") preIsOp = 1;
      }

      let sig = 0;
      for (let i = 0; i < q1h; i++) {
        if (q1[i] == "(") sig++;
        if (q1[i] == ")") sig--;
        if (sig < 0) {
          console.error("table:括号不匹配");
          return 0;
        }
      }
      if (sig > 0) {
        console.error("table:括号不匹配");
        return 0;
      }
      for (; q1h > q1t; q1t++) {
        if (qq1[q1t] == 0) {
          q2[q2h] = q1[q1t];
          qq2[q2h] = 1;
          q2h++;
          continue;
        }
        if (q1[q1t] == "(") {
          s[ss] = "(";
          ss++;
          continue;
        }
        if (q1[q1t] == ")") {
          while (s[ss - 1] != "(") q2[q2h++] = s[--ss];
          ss--;
          continue;
        }
        while (sumchange(s[ss - 1], q1[q1t])) q2[q2h++] = s[--ss];
        s[ss++] = q1[q1t];
      }
      while (s[ss - 1] != "#") q2[q2h++] = s[--ss];
      ss--;
      for (; q2h > q2t; q2t++) {
        if (qq2[q2t] == 1) {
          s[ss++] = q2[q2t];
          continue;
        }
        let n1 = s[--ss];
        let n2 = s[--ss];
        let res = solve(n2, q2[q2t], n1);
        if (res != "?") s[ss++] = res;
        else {
          console.error("被零除");
          return 0;
        }
      }
      return String(s[ss - 1]);
    }
    function number_format(number, decimals, dec_point, thousands_sep) {
      return NFM(number, decimals, dec_point, thousands_sep);
    }
    // 计算结束

    // 排序
    function sortdown(a, b, e) {
      let upcalss = document.getElementsByClassName("qiu-sanjiao-up");
      let downcalss = document.getElementsByClassName("qiu-sanjiao-down");

      for (let i = 0; i < upcalss.length; i++) {
        upcalss[i].style = "";
      }
      for (let i = 0; i < downcalss.length; i++) {
        downcalss[i].style = "";
      }
      //设置sort点击后颜色
      if (a == "up") {
        e.currentTarget.style = "border-bottom: 6px solid #151414";
      } else {
        e.currentTarget.style = "border-top: 6px solid #151414";
      }
      if (props.sorttype == "server") {
        if (!props.url) {
          qiuMsg("Url参数错误！", { icon: 2 });
        } else {
          let sUrl = props.url;
          // let rUrl = sUrl.match(/http:\/\/.+|https:\/\/.+/);
          if (sUrl != "" && sUrl != undefined) {
            console.log("地址合法");
          } else {
            this.$qiuMsg("Url地址不合法！", { icon: 4 });
          }
        }
        //  利用ajax向服务器传参；再重新获取数据,重新改造数据
      } else {
        //排序
        // qiuMsg("排序成功！", { icon: 1 });
        sortByKey(state.pagedata, b, a);
      }
    }
    function sortByKey(array, key, t) {
      if (t == "down") {
        // 升序
        return array.sort(function (a, b) {
          let x = a[key];
          let y = b[key];
          return y < x ? -1 : y < x ? 1 : 0;
        });
      } else {
        // 降序
        return array.sort(function (a, b) {
          let x = a[key];
          let y = b[key];
          return x < y ? -1 : x < y ? 1 : 0;
        });
      }
    }
    //筛选
    function datasai(a, e) {
      state.checksaifirst = [];
      state.checksai = [];
      state.checksainum = 0;
      state.checksaidata = [];
      // 赛选有bug，在斟酌
      state.saidatalist = findindex(props.cols, state.pagedata);
      for (let i in props.cols) {
        // console.log(props.cols[i]);
        for (let key in props.cols[i]) {
          // console.log(key);
          if (key == "field") {
            state.saikey = props.cols[a][key];
          }
        }
      }

      for (let i in state.pagedata) {
        for (let key in state.pagedata[i]) {
          if (key == state.saikey) {
            if (state.checksai.length < state.pagedata.length) {
              state.checksai.push(state.pagedata[i][key]);
            }
          }
        }
      }
      state.saimodel = state.checksai;
      state.checksaifirst = state.checksai;
      //数组去重ES6
      state.checksaidata = Array.from(new Set(state.checksai));
      state.checksainum = state.checksaidata.length;
      if (e.currentTarget.nextElementSibling.style.display == "") {
        e.currentTarget.nextElementSibling.style.display = "inline-block";
      } else {
        e.currentTarget.nextElementSibling.style.display = "";
      }
    }
    function saivalall() {
      return state.pagedata.length;
    }
    function saivalnum(a) {
      let num = [];
      for (let i in state.pagedata) {
        for (let key in state.pagedata[i]) {
          if (state.pagedata[i][key] == a) {
            num.push(key);
          }
        }
      }
      return num.length;
    }
    function saiclick(a, index, e) {
      // 根据下标，查找数据B中下标等于a的数据，然后整行数据隐藏
      //1、设置全选，
      if (e.currentTarget.checked) {
        state.checksainum = state.checksainum + 1;
      } else {
        state.checksainum = state.checksainum - 1;
      }

      let table =
        document.getElementById(props.elem).getElementsByTagName("table")[0] ||
        document.getElementById(props.tableid).getElementsByTagName("table")[0];

      if (a == "Allsai") {
        //全选
        for (let x = 1; x < table.rows.length; x++) {
          const newin =
            e.target.parentNode.parentNode.getElementsByTagName("input");
          if (e.target.checked) {
            table.rows[x].style.display = "";
            state.checksai = state.checksaifirst;
            for (let i = 0; i < newin.length; i++) {
              newin[i].checked = true;
            }
          } else {
            for (let i = 0; i < newin.length; i++) {
              newin[i].checked = false;
            }
            table.rows[x].style.display = "none";
            state.checksai = [];
          }
        }
      } else {
        let num = [];
        console.log(num, state.checksai);
        if (state.checksaidata.length == state.checksainum) {
          state.AllSaiCheck = true;
        } else {
          state.AllSaiCheck = false;
        }
        for (let i = 0; i < state.pagedata.length; i++) {
          for (let key in state.pagedata[i]) {
            if (state.pagedata[i][key] == a) {
              num.push(i);
            }
          }
        }
        // 删除指定数值
        for (let i = 0; i < state.checksai.length; i++) {
          for (let key in state.checksai[i]) {
            if (state.checksai[i][key] == a) {
              // num.push(i);
              console.log(i, key, a);
            }
          }
        }

        //方式一，直接隐藏table，此方法不增加服务器压力，但只能查找当前页面的数据
        //删除 checksai中指定数据
        // arr.filter(item => item != 3) 过滤掉某个数值
        // state.checksai.filter((item) => item != a);
        // console.log(state.checksai, a);
        if (num.length > 1) {
          for (let x = 0; x < num.length; x++) {
            num[x] = num[x] + 1;
            if (table.rows[num[x]].style.display == "" && e.target.checked) {
              table.rows[num[x]].style.display = "";
            } else if (e.target.checked == false) {
              table.rows[num[x]].style.display = "none";
            } else {
              table.rows[num[x]].style.display = "";
            }
          }
        } else {
          index = index + 1;
          if (table.rows[index].style.display == "" && e.target.checked) {
            table.rows[index].style.display = "";
          } else if (e.target.checked == false) {
            table.rows[index].style.display = "none";
          } else {
            table.rows[index].style.display = "";
          }
        }
      }
      //方式二，删除对应的行数据，添加对应的行数据
    }
    function saileave(e) {
      // 筛选离开
      if (e.currentTarget.style == "inline-block") {
        e.currentTarget.style.display = "";
      } else {
        e.currentTarget.style.display = "";
      }
    }
    function gettablenum() {
      if (state.pagedata.length > 0) {
        return false;
      } else {
        return true;
      }
    }

    // 工具条筛选
    function chooseclick(a, e) {
      if (e.currentTarget.checked == false) {
        if (state.choosenum > 0) {
          state.choosenum--;
        }
      } else {
        if (state.choosenum < props.cols.length) {
          state.choosenum++;
        }
      }
      let alldata = [];
      for (let i = 0; i < props.cols.length; i++) {
        alldata.push(props.cols[i].title);
      }
      let table = document
        .getElementById(props.elem)
        .getElementsByTagName("table")[0];
      for (let x = 0; x < table.rows.length; x++) {
        if (a == "AllChoose") {
          //全选
          for (let k = 0; k < table.rows[x].cells.length; k++) {
            if (e.target.checked) {
              table.rows[x].cells[k].style.display = "";
            } else {
              table.rows[x].cells[k].style.display = "none";
            }
          }
          if (state.AllChooseChecked) {
            state.choosenum = props.cols.length;
            state.choosedata = [];
          } else {
            state.choosedata = alldata;
          }
        } else {
          if (state.choosenum == props.cols.length) {
            state.AllChooseChecked = true;
          } else {
            state.AllChooseChecked = false;
          }

          if (table.rows[x].cells[a].style.display == "" && e.target.checked) {
            table.rows[x].cells[a].style.display = "";
          } else if (e.target.checked == false) {
            table.rows[x].cells[a].style.display = "none";
          } else {
            table.rows[x].cells[a].style.display = "";
          }
        }
      }
    }
    function choose(e) {
      if (state.choosedisplay == true) {
        state.choosedisplay = false;
      } else {
        state.choosedisplay = true;
      }

      e.currentTarget.nextElementSibling.style.top =
        e.currentTarget.offsetHeight - 6 + "px";
    }
    function chooseleave() {
      state.choosedisplay = false;
    }
    function searchdata(key, b) {
      if (!key) {
        qiuMsg("请输入您要搜索的内容！");
      } else {
        console.log(b);
        // let searfun = props.toolfun(b);
        // state.pagedata = this.findindex(props.cols, searfun(key));
      }
    }
    function checknewdata(a) {
      let checkfun = this.toolfun(a);
      if (this.checkdata.length > 0) {
        checkfun(this.checkdata);
      } else {
        this.$qiuMsg("请选择您所需要的数据！", { icon: 4 });
      }
    }

    // foot处理事件
    function changgeRMB(money) {
      return RMB(money);
    }

    return {
      unidata,
      checktype,
      cellclick,
      celldblclick,
      unialldata,
      findindex,
      state,
      checkall,
      checkone,
      delfield,
      deepClone,
      trodd,
      checktotal,
      celltotal,
      rowtotal,
      sumchange,
      solve,
      number_format,
      watchkey,
      downfocus,
      upfocus,
      sortdown,
      sortByKey,
      datasai,
      saivalall,
      saiclick,
      saileave,
      gettablenum,
      saivalnum,
      chooseclick,
      choose,
      chooseleave,
      searchdata,
      checknewdata,
      rightfocus,
      leftfocus,
      editleave,
      checknav,
      isChrome360,
      changgeRMB,
      getpagedata,
      template,
      tempset,
      temptype,
      checktemp,
      trhover,
    };
  },
};
</script>

<style lang="scss">
.qiu-toolbar {
  width: 100%;
  height: 40px;
  padding-top: 10px;
  background: #c2c2c2;

  .qiu-toolbar-left {
    position: relative;
    float: left;
    padding-left: 10px;
    margin-top: -5px;
    .qiu-table-search {
      position: absolute;
      top: 0px;
      .qiu-search {
        height: 27px;
        padding-left: 2px;
        margin-left: 2px;

        border: none;
        outline: none;
      }
      button {
        position: absolute;
        right: -60px;
      }
    }
  }

  .qiu-toolbar-right {
    float: right;
    padding-right: 10px;
    margin-top: -5px;
    .qiu-table-choose {
      position: relative;
      .qiu-choose-list {
        position: absolute;
        top: 25px;
        right: 0px;
        z-index: 1000;
        min-width: 80px;
        padding: 8px 5px 5px 5px;
        color: #333333;
        text-align: Left;
        text-shadow: none;
        background: #ffffff;
        border: 1px solid #cccccc;
        .qiu-choose-li {
          width: 100%;
          height: 22px;
          line-height: 22px;
          text-align: left;
          vertical-align: middle;
          cursor: pointer;
          .qiu-choose-li-lable {
            cursor: pointer;
          }
        }
        .qiu-choose-li:hover {
          background: #c2c0c0;
        }
      }
    }
  }
}
.qiu-table {
  width: 100%;
  text-align: center; /*文本居中*/
  border-collapse: collapse; /*边框重叠，否则你会看到双实线*/
  border: 1px solid #b3b3b3; /*设置边框粗细，实线，颜色*/
  z-index: 1000;
  thead {
    th {
      font-weight: bold; /*因为是标题栏，加粗显示*/
      color: black;
      cursor: default;
      border: 1px solid #b3b3b3;
      height: 30px;
      background: #dfdede;
      font-size: 13px;
      input[type="checkbox"] {
        width: 16px;
        height: 16px;
        margin-top: 8px;
      }
      .qiu-table-head-title {
        position: relative;
        input {
          cursor: pointer;
        }
        .qiu-table-sort {
          position: absolute;
          z-index: 100;
          top: 0;
          right: 5px;
          width: 20px;
          height: 30px;
          .qiu-sanjiao-up {
            position: absolute;
            top: 3px;
            right: 0px;
            width: 0;
            height: 0;
            cursor: pointer;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #919191;
            border-left: 6px solid transparent;
          }
          .qiu-sanjiao-up:hover {
            border-bottom: 6px solid #252525;
          }
          .qiu-sanjiao-up:active {
            border-bottom: 6px solid #161616;
          }
          .qiu-sanjiao-down {
            position: absolute;
            top: 10px;
            right: 0px;
            // bottom: 0px;
            width: 0;
            height: 0;
            cursor: pointer;
            border-top: 6px solid #919191;
            border-right: 6px solid transparent;
            border-left: 6px solid transparent;
          }
          .qiu-sanjiao-down:hover {
            border-top: 6px solid #252525;
          }
          .qiu-sanjiao-down:active {
            border-top: 6px solid #161616;
          }
        }
        .qiu-table-sai {
          position: relative;
          width: 20px;
          height: 20px;
          .sai-span {
            position: absolute;
            top: 1px;
            left: 2px;
            display: inline-block;
            width: 14px;
            height: 14px;
            cursor: pointer;
            background: url("../../image/icon/sai-sm-bl.png") no-repeat;
          }
          .sai-span:hover {
            background-image: linear-gradient(#cccccc);
          }
          .qiu-table-sai-dropdown {
            position: absolute;
            top: 20px;
            z-index: 1000;
            display: none;
            height: auto;
            padding: 5px;
            margin-top: 5px;
            text-align: left;
            background: #ffffff;
            border: 1px solid #cccccc;
            .qiu-table-sai-list {
              padding: 3px 5px;
              line-height: 22px;
              white-space: nowrap;
              cursor: pointer;
              &:hover {
                background: #cccccc;
              }
              input[type="checkbox"] {
                width: 16px;
                height: 16px;
              }
            }
          }
        }
      }
    }
  }
  tbody {
    width: 100%;
    overflow: auto;
    // tr:hover {
    //   background: #dfdede;
    // }
    .qiu-table-cell {
      //td属性
      position: relative;
      height: 28px;
      font-size: 12px;
      color: #1f1e1e;
      border: 1px solid #b3b3b3;
      line-height: 28px;
      z-index: 10;
      text-align: center;
      .qiu-table-checkbox-div {
        position: relative;
        width: 100%;
        height: 24px;
        padding-top: 4px;
        line-height: 28px;
        input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }
      }

      div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: calc(100% - 2px);
        height: 28px;
      }
      .qiu-table-cell-edit {
        width: calc(100% - 2px);
        position: absolute;
        left: 0px;
        top: 0px;
        right: 1px;
        bottom: 0px;
        outline: none;
        border: 1px solid #5a5a5a;
        z-index: 12;
        &:hover {
          border: 1px solid #7a797a;
        }
        // 鼠标在input中时border颜色
        &:focus {
          border: 1px solid #585757;
        }
      }
    }
  }
  tfoot {
    td {
      height: 28px;
      font-size: 12px;
      color: #1f1e1e;
      border: 1px solid #b3b3b3;
      line-height: 28px;
      z-index: 10;
      text-align: center;
    }
  }
}
</style>
