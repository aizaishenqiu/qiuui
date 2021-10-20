<template>
  <div class="parameter">
    <div class="title">
      我是一个组件的标题
      <div class="close">x</div>
    </div>
    <div class="content">组件的内容</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.parameter {
  height: 569px;
  width: 960px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: calc(-960px / 2);
  margin-top: calc(-569px / 2);
  z-index: 999;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0px 12px 32px 0px rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  user-select: none;
  .rightBlank {
    position: absolute;
    top: 48px;
    right: -5px;
    width: 5px;
    height: calc(100% - 53px);
  }
  .bottomBlank {
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 5px;
  }
  .title {
    display: flex;
    font-size: 16px;
    height: 48px;
    line-height: 48px;
    background: #f5f5f5;
    box-sizing: border-box;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.12);
    border-radius: 2px 2px 0px 0px;
    padding: 0 20px;
    z-index: 99;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    .close {
      img {
        width: 10px;
      }
      margin-left: auto; // 右对齐
    }
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 48px);
    box-sizing: border-box;
    background: #fff;
    overflow: auto;
  }
}
</style>
