var db = new Dexie("user");
db.version(1).stores({
  userfps: "++id, *ip, *fp",
  fingerprints:
    "fp, userAgent, cpu, screenPrint, colorDepth, availableResolution, mimeTypes, fonts, timeZone, language, core"
});

function changer(add, update, del, addfps, upfps, delfps) {
  this.add = add;
  this.update = update;
  this.del = del;
  this.upfps = upfps;
  this.delfps = delfps;
  this.addfps = addfps;
}

async function saveUser(change) {
  return new Promise((result, rej) => {
    let core = window.navigator.hardwareConcurrency;
    // let ua = window.navigator.userAgent;
    let screenOrientation = window.screen.orientation.type;
    let screenAngle = window.screen.orientation.angle;
    let screenHeight = window.screen.availHeight;
    let screenWidth = window.screen.availWidth;
    let ip = returnCitySN["cip"];

    const client = new ClientJS();
    // const client = new window.ClientJS();
    let fingerprint = client.getFingerprint(); //1883166535
    let userAgent = client.getUserAgent(); // Get User Agent String
    let cpu = client.getCPU();
    let screenPrint = client.getScreenPrint();
    let colorDepth = client.getColorDepth();
    let availableResolution = client.getAvailableResolution();
    let mimeTypes = client.getMimeTypes();
    let fonts = client.getFonts();
    let timeZone = client.getTimeZone();
    let language = client.getLanguage();

    //indexedDB - dexie
    combineUser(change)
      .then(function() {
        db.userfps
          .where({ ip: ip })
          .distinct()
          .toArray(findIp => {
            db.userfps
              .where({ fp: fingerprint })
              .distinct()
              .toArray(findFp => {
                if (findIp.length == 1 && findFp.length == 0) {
                  db.userfps
                    .where("ip")
                    .equals(ip)
                    .distinct()
                    .modify(user => {
                      change.upfps = user;
                      change.update.push(user.id);
                      user.fp.push(fingerprint);
                    });
                  // console.log("add fp to ip");
                } else if (findIp.length == 0 && findFp.length == 1) {
                  db.userfps
                    .where("fp")
                    .equals(fingerprint)
                    .distinct()
                    .modify(user => {
                      change.upfps = user;
                      change.update.push(user.id);
                      user.ip.push(ip);
                    });
                  // console.log("add ip to fp");
                } else if (findIp.length == 0 && findFp.length == 0) {
                  db.userfps
                    .add({
                      ip: [ip],
                      fp: [fingerprint]
                    })
                    .then(function() {
                      db.userfps
                        .where("fp")
                        .equals(fingerprint)
                        .distinct()
                        .first(user => {
                          change.add.push(user.id);
                          change.addfps = user;
                        });
                      // console.log("add user");
                    });
                } else if (findIp.length == 1 && findFp.length == 1) {
                  if (findIp[0].id != findFp[0].id) {
                    db.userfps.get({ fp: fingerprint }).then(fpp => {
                      db.userfps
                        .where("ip")
                        .equals(ip)
                        .distinct()
                        .modify(user => {
                          change.upfps = user;
                          change.update.push(user.id);
                          user.fp.push(fingerprint);
                          user.ip = user.ip.concat(fpp.ip);
                        })
                        .then(function() {
                          change.delfps = fpp;
                          change.del.push(fpp.id);
                          db.userfps.delete(fpp.id);
                          // console.log("combine user");
                        });
                    });
                  }
                } else {
                  db.userfps
                    .add({
                      ip: [ip],
                      fp: [fingerprint]
                    })
                    .then(function() {
                      db.userfps
                        .where("fp")
                        .equals(fingerprint)
                        .distinct()
                        .first(user => {
                          change.add.push(user.id);
                          change.addfps = user;
                        });
                      // console.log("add user");
                    });
                }
              });
          });
      })
      .then(function() {
        db.fingerprints
          .where({ fp: fingerprint })
          .distinct()
          .toArray(res => {
            if (res.length == 0) {
              db.fingerprints.add({
                fp: fingerprint,
                userAgent: userAgent,
                cpu: cpu,
                screenPrint: screenPrint,
                colorDepth: colorDepth,
                availableResolution: availableResolution,
                mimeTypes: mimeTypes,
                fonts: fonts,
                timeZone: timeZone,
                language: language,
                core: core,
                screenOrientation,
                screenAngle,
                screenHeight,
                screenWidth
              });
            }
          });
      })
      //去重复
      .then(rmDuplication())
      .then(
        //合并相同ip与fp
        combineUser(change).then(res => {
          var arr = new changer(
            res.add,
            res.update,
            res.del,
            res.addfps,
            res.upfps,
            res.delfps
          );
          result(arr);
        })
      );
  });
}

async function rmDuplication() {
  await db.userfps.toCollection().modify(user => {
    let arr = [];
    for (var i = 0; i < user.ip.length; i++) {
      for (var j = 0; j < arr.length; j++) {
        if (arr[j] == user.ip[i]) {
          break;
        }
      }
      if (j == arr.length) {
        arr[arr.length] = user.ip[i];
      }
    }
    user.ip = arr;
  });
  await db.userfps.toCollection().modify(user => {
    let arr = [];
    for (var i = 0; i < user.fp.length; i++) {
      for (var j = 0; j < arr.length; j++) {
        if (arr[j] == user.fp[i]) {
          break;
        }
      }
      if (j == arr.length) {
        arr[arr.length] = user.fp[i];
      }
    }
    user.fp = arr;
  });
}

async function combineUser(change) {
  return new Promise((res, rej) => {
    db.userfps
      .toArray(user => {
        for (let i = 0; i < user.length - 1; i++) {
          for (let j = i + 1; j < user.length; j++) {
            var flag = false;
            for (let k = 0; k < user[j].ip.length; k++) {
              if (
                user[i].ip.some(function(uip) {
                  return uip == user[j].ip[k];
                }) == true
              ) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              for (let k = 0; k < user[j].fp.length; k++) {
                if (
                  user[i].fp.some(function(ufp) {
                    return ufp == user[j].fp[k];
                  }) == true
                ) {
                  flag = true;
                  break;
                }
              }
            }
            if (flag == true) {
              db.userfps
                .where("id")
                .equals(user[i].id)
                .modify(newUser => {
                  newUser.fp = newUser.fp.concat(user[j].fp);
                  newUser.ip = newUser.ip.concat(user[j].ip);
                })
                .then(function() {
                  change.update.push(user[i].id);
                  change.del.push(user[j].id);
                  db.userfps
                    .where("id")
                    .equals(user[j].id)
                    .delete();
                });
            }
          }
        }
      })
      .then(rmDuplication())
      .then(function() {
        res(change);
      });
  });
}

export { saveUser, changer };
