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
    var fingerprint = client.getFingerprint();//1883166535
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
        userfps: '++id, *ip, *fp',
        fingerprints: 'fp, userAgent, cpu, screenPrint, colorDepth, availableResolution, mimeTypes, fonts, timeZone, language, core'
    });
    // db.open();

    //test area
    db.userfps.bulkAdd([
        {ip: ["127.0.0.0"], fp: [278497595]}, //278497595
        {ip: [ip], fp: [188316653]},
    ]).then(function () {
        // return db.userfp.get('1');
    });

    var findIp = await db.userfps
        .where({ip: ip}).distinct().toArray()
        .catch(function (error) {
            console.log("error: " + error);
            // db.close()
        });
    var findFp = await db.userfps
        .where({fp: fingerprint}).distinct().toArray()
        .catch(function (error) {
            console.log("error: " + error);
            // db.close()
        });
    // console.log("ip:" + findIp.length + " fp:" + findFp.length);
    if (findIp.length > 0 && findFp.length == 0) {
        await db.userfps.where("ip").equals(ip).distinct().modify(user => {
            user.fp.push(fingerprint);
        });
        console.log("add fp to ip");
    } else if (findIp.length == 0 && findFp.length > 0) {
        await db.userfps.where("fp").equals(fingerprint).distinct().modify(user => {
            user.ip.push(ip);
        });
        console.log("add ip to fp");
    } else if (findIp.length == 0 && findFp.length == 0) {
        await db.userfps.add({
            ip: [ip], fp: [fingerprint]
        });
        console.log("add user");
    } else if (findIp.length > 0 && findFp.length > 0) {
        fpp = await db.userfps.get({fp: fingerprint});
        await db.userfps.where("ip").equals(ip).distinct().modify(user => {
            user.fp.push(fingerprint);
            user.ip = user.ip.concat(fpp.ip);
        });
        await db.userfps.delete(fpp.id);
        console.log("combine user");
    }
    ;

    findFp = await db.fingerprints
        .where({fp: fingerprint}).distinct().toArray()
        .catch(function (error) {
            console.log("error: " + error);
            // db.close()
        });

    if (findFp.length == 0) {
        await db.fingerprints.add(
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
        );
    }
    ;

    //去除重复ip与fp
    db = rmDuplicates(db);

    for (var i = 0; i < db.userfps.count() - 1; i++) {
        var user = db.userfps.toArray()[i];
        for (var j = i + 1; j < db.userfps.count(); j++) {
            var check = db.userfps.toArray()[j];
            var flag = false;
            for (var k = 0; k < check.ip.length; k++) {
                if (user.ip.some(function (uip) {
                        return uip == check.ip[k];
                    })
                    == true) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                for (var k = 0; k < check.fp.length; k++) {
                    if (user.fp.some(function (ufp) {
                            return ufp == check.fp[k];
                        })
                        == true) {
                        flag = true;
                        break;
                    }
                }
            }
            if (flag == true) {
                await db.userfps.where("id").equals(user.id).modify(newUser => {
                    newUser.fp.push(fingerprint);
                    newUser.fp = newUser.fp.concat(check.fp);
                    newUser.ip = newUser.ip.concat(check.ip);
                });
                await db.userfps.delete(check.id);
            }
        }
    }
    ;
    db = rmDuplicates(db);

    // db.close();
};

async function rmDuplicates(db) {
    await db.userfps.each(user => {
        user.ip = user.ip.filter(function (item, index, self) {
            return self.indexOf(item) == index;
        });
        user.fingerprint = user.fingerprint.filter(function (item, index, self) {
            return self.indexOf(item) == index;
        });
    });
    return db;
}
