<template>
  <div id="app">
    <el-raw style="padding-left:20px">
      <el-button type="primary" plain v-on:click="count()">请求</el-button>
      <el-button type="primary" plain v-on:click="counta()">请求1</el-button>
      <el-button type="primary" plain v-on:click="countb()">请求2</el-button>
      <el-button type="primary" plain v-on:click="countc()">请求3</el-button>
      <el-button type="primary" plain v-on:click="gap()">间隔请求</el-button>
    </el-raw>
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
    },
    // test api
    count: function() {
      this.$axios({
        method: "get",
        url: "/count",
        params: {}
      }).then(res => {
        if (res.data.lim === 0) {
          this.$notify({
            title: "成功",
            message: "成功访问接口",
            type: "success"
          });
        } else {
          const h = this.$createElement;
          this.$notify.error({
            title: "错误",
            message: h("p", null, [
              h("span", null, "请求过于频繁，请等待"),
              h("i", { style: "color: teal" }, res.data.lim),
              h("span", null, " 毫秒")
            ])
          });
        }
      });
    },
    counta: function() {
      this.$axios({
        method: "get",
        url: "/counta",
        params: {}
      }).then(res => {
        if (res.data.lim === 0) {
          this.$notify({
            title: "成功",
            message: "成功访问接口",
            type: "success"
          });
        } else {
          const h = this.$createElement;
          this.$notify.error({
            title: "错误",
            message: h("p", null, [
              h("span", null, "请求过于频繁，请等待"),
              h("i", { style: "color: teal" }, res.data.lim),
              h("span", null, " 毫秒")
            ])
          });
        }
      });
    },
    countb: function() {
      this.$axios({
        method: "get",
        url: "/countb",
        params: {}
      }).then(res => {
        if (res.data.lim === 0) {
          this.$notify({
            title: "成功",
            message: "成功访问接口",
            type: "success"
          });
        } else {
          const h = this.$createElement;
          this.$notify.error({
            title: "错误",
            message: h("p", null, [
              h("span", null, "请求过于频繁，请等待"),
              h("i", { style: "color: teal" }, res.data.lim),
              h("span", null, " 毫秒")
            ])
          });
        }
      });
    },
    countc: function() {
      this.$axios({
        method: "get",
        url: "/countc",
        params: {}
      }).then(res => {
        if (res.data.lim === 0) {
          this.$notify({
            title: "成功",
            message: "成功访问接口",
            type: "success"
          });
        } else {
          const h = this.$createElement;
          this.$notify.error({
            title: "错误",
            message: h("p", null, [
              h("span", null, "请求过于频繁，请等待"),
              h("i", { style: "color: teal" }, res.data.lim),
              h("span", null, " 毫秒")
            ])
          });
        }
      });
    },
    gap: function() {
      this.$axios({
        method: "get",
        url: "/gap",
        params: {}
      }).then(res => {
        if (res.data.lim === 0) {
          this.$notify({
            title: "成功",
            message: "成功访问接口",
            type: "success"
          });
        }
      });
    }
  }
};
</script>
