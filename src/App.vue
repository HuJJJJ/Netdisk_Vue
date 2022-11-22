<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
 
  created() {
    sessionStorage.getItem("userMsg") &&
      this.$store.replaceState(JSON.parse(sessionStorage.getItem("userMsg")));

    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("userMsg", JSON.stringify(this.$store.state));
    });
  },
};
</script>
