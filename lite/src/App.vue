<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <button v-on:click="count()">请求</button>
    <button v-on:click="counta()">请求1</button>
    <button v-on:click="countb()">请求2</button>
    <button v-on:click="countc()">请求3</button>
    <router-view />
  </div>
</template>

<script>
import { saveUser } from "./lib/usrRec";
export default {
  name: "App",
  mounted: function() {
    saveUser().then(this.syncDB());
  },
  methods: {
    count: function() {
      this.$axios({
        method: "get",
        url: "/count",
        params: {}
      }).then(res => {
        // console.log(res.data);
      });
    },
    counta: function() {
      this.$axios({
        method: "get",
        url: "/counta",
        params: {}
      }).then(res => {
        // console.log(res.data);
      });
    },
    countb: function() {
      this.$axios({
        method: "get",
        url: "/countb",
        params: {}
      }).then(res => {
        // console.log(res.data);
      });
    },
    countc: function() {
      this.$axios({
        method: "get",
        url: "/countc",
        params: {}
      }).then(res => {
        // console.log(res.data);
      });
    },
    syncDB: function() {
      var db = new Dexie("user");
      db.version(1).stores({
        userfps: "++id, *ip, *fp",
        fingerprints:
          "fp, userAgent, cpu, screenPrint, colorDepth, availableResolution, mimeTypes, fonts, timeZone, language, core"
      });
      db.userfps.toArray(arr => {
        this.$axios({
          method: "get",
          url: "/syncufp",
          params: {
            arr: arr
          }
        }).then(res => {
          // console.log(res.data);
        });
      });
      db.fingerprints.toArray(arr => {
        this.$axios({
          method: "get",
          url: "/syncfps",
          params: {
            arr: arr
          }
        }).then(res => {
          // console.log(res.data);
        });
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
