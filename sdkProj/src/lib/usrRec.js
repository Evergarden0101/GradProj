importScripts("http://pv.sohu.com/cityjson?ie=utf-8");
alert("Hello world!");
module.exports = {
  getIp: function() {
    console.log(returnCitySN["cip"] + "," + returnCitySN["cname"]);
    document.write(returnCitySN["cip"] + "," + returnCitySN["cname"]);
  }
};
