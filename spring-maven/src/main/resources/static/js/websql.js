var udb = openDatabase("userdb", "1.0", "User DB", 3 * 1024 * 1024);

udb.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS USERFP (id unique, ip, fingerprint)', [], function () {
        console.log('USERFP succeed');

    }, function () {
        console.log('USERFP fail');
    });
    tx.executeSql('CREATE TABLE IF NOT EXISTS FP (fingerprint, userAgent, cpu, colorDepth,availableResolution,mimeTypes,fonts,timeZone,language)', [], function () {
        console.log('fp succeed');

    }, function () {
        console.log('fp fail');
    });
});

udb.transaction(function (tx) {
    tx.executeSql('INSERT INTO USERFP (id, ip, fingerprint) VALUES (1, ip, fingertprint)', [], function () {
        console.log('insert succeed');

    }, function () {
        console.log('insert fail');
    });
});
console.log("222")
udb.transaction(function (tx) {
    tx.executeSql('SELECT * FROM USERFP', [], function (tx, results) {
        var len = results.rows.length;
        msg = "查询记录条数: " + len;
        // document.querySelector('#status').innerHTML +=  msg;
        console.log(msg)

        for (var i = 0; i < len; i++) {
            console.log(results.rows.item(i).fingerprint);
        }

    }, null);
});
