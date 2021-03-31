// importScripts("http://pv.sohu.com/cityjson?ie=utf-8");
// alert("Hello world!");
document.write("<script language=javascript src=\"http://pv.sohu.com/cityjson?ie=utf-8\"></script>");
// alert(returnCitySN["cip"] + "," + returnCitySN["cname"]);
// var sc = document.createElement("script");
var h4 = "    var h3 = document.createElement(\"h3\");\n" +
    "    h3.innerText = returnCitySN[\"cip\"] + \",\" + returnCitySN[\"cname\"];\n" +
    "    document.body.insertBefore(h3, document.body.lastChild);";
// document.body.insertBefore(sc, document.body.lastChild);
document.write("<script language=javascript>" + h4 + "</script>");
// alert("Hello world!");

console.log(ua);
// import ClientJS from "clientjs";
var ClientJS = require("clientjs");
// // Create a new ClientJS object
// var client = new ClientJS();
//
// // Get the client's fingerprint id
// var fingerprint = client.getFingerprint();
//
// // Print the 32bit hash id to the console
// console.log(fingerprint);
function getIp() {
    // var h3 = document.createElement("h3");
    // h3.innerText = returnCitySN["cip"] + "," + returnCitySN["cname"];
    // document.body.insertBefore(h3, document.body.lastChild);

    var core = window.navigator.hardwareConcurrency;
    var ua = window.navigator.userAgent;

    var ip = returnCitySN["cip"];
    console.log(ip);

    // var client = new ClientJS();
    const client = new window.ClientJS();
    const fingerprint = client.getFingerprint();
    console.log(fingerprint);
    var cUserAgent = client.getUserAgent(); // Get User Agent String
    console.log("clientUserAgent: " + cUserAgent);
    var cpu = client.getCPU();
    console.log("CPU: " + cpu);
    var screenPrint = client.getScreenPrint();
    console.log("screenPrint: " + screenPrint);
    var colorDepth = client.getColorDepth();
    console.log("colorDepth: " + colorDepth);
    var availableResolution = client.getAvailableResolution();
    console.log("availableResolution: " + availableResolution);
    var mimeTypes = client.getMimeTypes();
    console.log("mimeTypes: " + mimeTypes);
    var fonts = client.getFonts();
    var timeZone = client.getTimeZone();
    console.log("timeZone: " + timeZone);
    var language = client.getLanguage();
    console.log("language: " + language);
    //websql
    var udb = openDatabase("userdb", "1.0", "User DB", 3 * 1024 * 1024);

    udb.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERFP (id unique, ip, fingerprint)');
        // tx.executeSql('CREATE TABLE IF NOT EXISTS FP (fingerprint, userAgent, cpu, colorDepth,availableResolution,mimeTypes,fonts,timeZone,language)');
    });

    console.log("111")
    udb.transaction(function (tx) {
        tx.executeSql('INSERT INTO USERFP (id, ip, fingerprint) VALUES (1, ip, fingertprint)');
    });
    console.log("222")
    udb.transaction(function (tx) {
        tx.executeSql('SELECT * FROM USERFP', [], function (tx, results) {
            var len = results.rows.length;
            msg = "查询记录条数: " + len;
            // document.querySelector('#status').innerHTML +=  msg;
            console.log(msg)

            for (var i = 0; i < len; i++){
                console.log(results.rows.item(i).fingerprint );
            }

        }, null);
    });
}
