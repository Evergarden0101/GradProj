<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <router-view />
  </div>
</template>

<script>
import {
  saveUser,
  changer
} from "./lib/usrRec";
export default {
  name: "App",
  mounted: function() {
    var usr = new changer([], [], [], {}, {}, {});
    saveUser(usr).then(this.syncDB());
  },
  methods: {
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
  },
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
