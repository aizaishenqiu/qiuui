<template>
  <div class="header">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
      |
      <router-link to="/demo">Demo</router-link>
    </div>
  </div>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.header {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #cccccc;
}
#nav {
  width: 100%;
  height: 50px;
  line-height: 50px;
  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration-line: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
