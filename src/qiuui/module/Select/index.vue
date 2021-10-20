<template>
  <!-- <select
    :class="state.class"
    :name="state.name"
    :id="'qiu-select-' + state.uinid"
  >
    <option
      v-for="(item, index) in state.data"
      :key="index"
      :value="item.value"
      class="qiu-select-option"
    >
      {{ item.text }}
    </option>
  </select> -->
  <div class="divInput">
    <div class="input" @click="openValue">
      <input v-model="state.value" type="text" placeholder="筛选实验类型" />
      <!-- <img src="../assets/arrow.png" alt="" /> -->
    </div>
    <div class="list" v-show="state.show">
      <ul>
        <li
          v-for="(item, index) in state.data"
          :key="index"
          @click="getvalue(item)"
        >
          {{ item.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { nextTick, reactive } from "vue";
import { OnlyID } from "../../qiuui";

export default {
  nameL: "QiuSelect",
  props: {
    sedata: {
      type: Object,
      default() {
        return {
          name: "",
          data: [
            {
              text: "请选择",
              value: "",
            },
          ],
          class: "qiu-select-container",
          show: false,
          value: "",
        };
      },
    },
  },
  setup(props) {
    const state = reactive({
      data: props.sedata.data,
      name: props.sedata.name,
      class: props.sedata.class,
      show: props.sedata.show,
      value: props.sedata.value,
      uinid: OnlyID(),
    });

    nextTick(() => {
      console.log({ height: setclass().pwheight + "px" });
      setclass();
    });
    function setclass() {
      let unid = "qiu-select-" + state.uinid;
      let Pnode = document.getElementById(unid).parentNode;
      let node = document.getElementById(unid);
      if (Pnode) {
        let pwidth = Pnode.offsetWidth,
          pwheight = Pnode.offsetHeight;
        node.style.width = pwidth - 1 + "px";
        node.style.height = pwheight - 1 + "px";
        return { pwidth, pwheight };
      } else {
        console.log("默认值");
      }
    }
    function openValue() {
      state.show = !state.show;
    }
    function getvalue(item) {
      state.value = item.value;
      state.text = item.text;
      state.show = false;
    }
    return {
      state,
      setclass,
      openValue,
      getvalue,
    };
  },
};
</script>

<style lang="scss" scoped>
.qiu-select-container {
  .qiu-select-option {
    height: 28px;
  }
}
.divInput {
  margin: 100px;
}
ul li {
  list-style: none;
}
.input {
  width: 100px;
  height: 30px;
  line-height: 30px;
  // padding-left: 10px;
  border: 1px solid #cccccc;
  position: relative;
}
.input input {
  border: none;
  outline: none;
  width: 90%;
}
.input img {
  position: absolute;
  right: 34px;
  top: 48%;
}
.list {
  width: 100px;
  border: 1px solid #cccccc;
  overflow: hidden;
}
ul,
li {
  padding: 0;
  margin: 0;
}
.list ul li {
  width: 100px;
  height: 30px;
  cursor: pointer;
  line-height: 30px;

  // padding-left: 10px;
}
.list ul li:hover {
  background-color: #cccccc;
}
</style>
