// importScripts("http://pv.sohu.com/cityjson?ie=utf-8");
// alert("Hello world!");
// document.write("<script language=javascript src=\"http://pv.sohu.com/cityjson?ie=utf-8\"></script>");
// alert(returnCitySN["cip"] + "," + returnCitySN["cname"]);
// var sc = document.createElement("script");
var h4 = "    var h3 = document.createElement(\"h3\");\n" +
    "    h3.innerText = returnCitySN[\"cip\"] + \",\" + returnCitySN[\"cname\"];\n" +
    "    document.body.insertBefore(h3, document.body.lastChild);";
// document.body.insertBefore(sc, document.body.lastChild);
document.write("<script language=javascript>" + h4 + "</script>");
// alert("Hello world!");

// import ClientJS from "clientjs";
// var ClientJS = require("clientjs");

// import Dexie from 'dexie';

async function getIp() {
    // var h3 = document.createElement("h3");
    // h3.innerText = returnCitySN["cip"] + "," + returnCitySN["cname"];
    // document.body.insertBefore(h3, document.body.lastChild);

    var core = window.navigator.hardwareConcurrency;
    var ua = window.navigator.userAgent;
    var screenOrientation = window.screen.orientation.type;
    var screenAngle = window.screen.orientation.angle;
    var screenHeight = window.screen.availHeight;
    var screenWidth = window.screen.availWidth;
    var ip = returnCitySN["cip"];
    console.log(ip);

    // var client = new ClientJS();
    var client = new window.ClientJS();
    var fingerprint = client.getFingerprint();
    var userAgent = client.getUserAgent(); // Get User Agent String
    var cpu = client.getCPU();
    var screenPrint = client.getScreenPrint();
    var colorDepth = client.getColorDepth();
    var availableResolution = client.getAvailableResolution();
    var mimeTypes = client.getMimeTypes();
    var fonts = client.getFonts();
    var timeZone = client.getTimeZone();
    var language = client.getLanguage();
    console.log("language: " + language);

    //indexedDB - dexie
    var db = new Dexie('user');
    db.version(1).stores({
        userfp: '++, *ip, *fingerprint',
        fp: 'fingerprint, userAgent, cpu, screenPrint, colorDepth, availableResolution, mimeTypes, fonts, timeZone, language, core'
    });
    // db.open();
    var findIp = await db.userfp
        .where({ip: ip}).distinct().toArray()
        .catch(function (error) {
            console.log("error: " + error);
            // db.close()
        });
    var findFp = await db.userfp
        .where({fingerprint: fingerprint}).distinct().toArray()
        .catch(function (error) {
            console.log("error: " + error);
            // db.close()
        });
    if (findIp.length > 0 && findFp.length == 0) {
        findIp[0].modify(user => {
            user.fingerprint.add(fingerprint);
        });
    } else if (findIp.length == 0 && findFp.length > 0) {

    } else if (findIp.length == 0 && findFp.length == 0) {
        db.userfp.put({
            ip: ip, fingerprint: fingerprint
        })
    } else if (findIp.length > 0 && findFp.length > 0) {

    }

    db.userfp.bulkPut([
        {uid: "1", ip: ip, fingerprint: fingerprint},
        {uid: "2", ip: "127.0.0.1", fingerprint: fingerprint},
    ]).then(function () {
        return db.userfp.get('1');
    });

    console.log(findIp.length);
    db.fp.put(
        {
            fingerprint,
            userAgent,
            cpu,
            screenPrint,
            colorDepth,
            availableResolution,
            mimeTypes,
            fonts,
            timeZone,
            language,
            core,
            screenOrientation,
            screenAngle,
            screenHeight,
            screenWidth
        },
    ).then(function () {
        return;
    });

    // db.close();
}
