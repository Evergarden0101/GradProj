var ClientJS=require("clientjs");
var requestIp = require('request-ip');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/runoob";

module.exports = {
  getIp: function() {
    //ip
    var ip = requestIp.getClientIp(req);
    console.log(ip);

    //fingerprint
    const client = new ClientJS();

    const windowClient = new window.ClientJS();

    const fingerPrint = windowClient.getFingerprint();

    console.log(fingerPrint);

    //websql
    var udb = openDatabase("userdb", "1.0", "User DB", 4 * 1024 * 1024);
    udb.transaction(function(tx) {
      tx.executeSql("CREATE TABLE IF NOT EXISTS USERFP (id unique, ip, fingerprint)");
      tx.executeSql("CREATE TABLE IF NOT EXISTS FP (fingerprint, userAgent)");
    });
  }
};
