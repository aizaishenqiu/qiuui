<template>
  <div>
    <button @click="hand('A')">AA</button>
    <button @click="hand('B')">BB</button>
    <keep-alive>
      <component v-bind:is="currTM"></component>
    </keep-alive>
  </div>
</template>

<script>
import B from "./Home";
import A from "./Test.vue";
import { ref } from "vue";
export default {
  name: "about",
  components: { B, A },
  setup() {
    const currTM = ref("A");
    console.log(currTM, ref("B"));
    const hand = (key) => {
      currTM.value = key;
      console.log(currTM);
    };
    return { currTM, hand };
  },
};
</script>

<style></style>
