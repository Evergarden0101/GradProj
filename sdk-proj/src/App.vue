<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <button v-on:click="count()">请求</button>
    <button v-on:click="count1()">请求1</button>
    <button v-on:click="count2()">请求2</button>
    <button v-on:click="count3()">请求3</button>
    <router-view />
  </div>
</template>

<script>
import {
  saveUser,
  getUserfps,
  changer,
  updateUfp,
  addUfp,
  delUfp
} from "./lib/usrRec";
export default {
  name: "App",
  mounted: function() {
    var usr = new changer([], [], [], {}, {}, {});
    // console.log(usr.add);
    // usr.outputInfo();
    saveUser(usr).then(this.syncDB());

    // .then(change => {
    //   console.log(change.add.length);
    //   if (change.addfps) {
    //     console.log("add");
    //     console.log(change.addfps);
    //     // db.userfps
    //     //   .where("id")
    //     //   .equals(usr.add[0])
    //     //   .first(adder => {
    //         this.$axios({
    //           method: "get",
    //           url: "/add",
    //           params: {
    //             adder: change.addfps
    //           }
    //         }).then(res => {
    //           console.log(res.data);
    //           if (res.date == "1001") {
    //             usr.add = null;
    //             usr.addfps=bull;
    //           }
    //         });
    //       // });
    //   }
    //   if (usr.del.length > 0) {
    //     delUfp(usr);
    //   }
    //   if (usr.update.length > 0) {
    //     updateUfp(usr);
    //   }
    // });
  },
  methods: {
    count: function() {
      this.$axios({
        method: "get",
        url: "/count",
        params: {
          //  arr: 123
        }
      }).then(res => {
        console.log(res.data);
      });
    },
    count1: function() {
      this.$axios({
        method: "get",
        url: "/count",
        params: {
          //  arr: 123
        }
      }).then(res => {
        console.log(res.data);
      });
    },
    count2: function() {
      this.$axios({
        method: "get",
        url: "/count",
        params: {
          //  arr: 123
        }
      }).then(res => {
        console.log(res.data);
      });
    },
    count3: function() {
      this.$axios({
        method: "get",
        url: "/count",
        params: {
          //  arr: 123
        }
      }).then(res => {
        console.log(res.data);
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
        console.log(arr);
        this.$axios({
          method: "get",
          url: "/sync",
          params: {
            arr: arr
          }
        }).then(res => {
          console.log(res.data);
        });
      });
      db.fingerprints.toArray(arr => {
        console.log(arr);
        this.$axios({
          method: "get",
          url: "/syncfps",
          params: {
            arr: arr
          }
        }).then(res => {
          console.log(res.data);
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
