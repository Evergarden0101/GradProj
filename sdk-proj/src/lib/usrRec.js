var db = new Dexie("user");
db.version(1).stores({
  userfps: "++id, *ip, *fp",
  fingerprints:
    "fp, userAgent, cpu, screenPrint, colorDepth, availableResolution, mimeTypes, fonts, timeZone, language, core"
});

// var change = {};

function changer(add, update, del, addfps, upfps, delfps) {
  this.add = add;
  this.update = update;
  this.del = del;
  this.upfps = upfps;
  this.delfps = delfps;
  this.addfps = addfps;
  this.outputInfo = function() {
    console.log("hello");
  };
}

function test(rec) {
  rec.add = rec.add.concat([2]);
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
    // let cip = requestIp.getClientIp(req);

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
      .then(res => {
        console.log(res.del);
        // console.log(res.update);
        // let changer = JSON.parse(JSON.stringify(res));
        // console.log(changer);
        // update = res.update;
        // // del = res.del;
        // console.log(update);
        // console.log(del);
      })
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
                          // console.log(change.add[0])
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
      .then(rmDuplication())
      .then(
        //合并相同ip与fp
        combineUser(change).then(res => {
          console.log(res);
          // let changer = JSON.parse(JSON.stringify(res));
          // return changer;
          var arr = new changer(
            res.add,
            res.update,
            res.del,
            res.addfps,
            res.upfps,
            res.delfps
          );
          console.log(arr);
          result(arr);
        })
      );
  });

  //

  // let findIp = await db.userfps
  //   .where({ ip: ip })
  //   .distinct()
  //   .toArray()
  //   .catch(function(error) {
  //     // console.log("error: " + error);
  //     // db.close()
  //   });
  // let findFp = await db.userfps
  //   .where({ fp: fingerprint })
  //   .distinct()
  //   .toArray()
  //   .catch(function(error) {
  //     // console.log("error: " + error);
  //     // db.close()
  //   });
  // if (findIp.length == 1 && findFp.length == 0) {
  //   await db.userfps
  //     .where("ip")
  //     .equals(ip)
  //     .distinct()
  //     .modify(user => {
  //       user.fp.push(fingerprint);
  //       update.push(user.id);
  //     });
  //   // console.log("add fp to ip");
  // } else if (findIp.length == 0 && findFp.length == 1) {
  //   await db.userfps
  //     .where("fp")
  //     .equals(fingerprint)
  //     .distinct()
  //     .modify(user => {
  //       user.ip.push(ip);
  //       update.push(user.id);
  //     });
  //   // console.log("add ip to fp");
  // } else if (findIp.length == 0 && findFp.length == 0) {
  //   await db.userfps.add({
  //     ip: [ip],
  //     fp: [fingerprint]
  //   });
  //   await db.userfps
  //     .where("fp")
  //     .equals(fingerprint)
  //     .distinct()
  //     .modify(user => {
  //       add.push(user.id);
  //     });
  //   // console.log("add user");
  // } else if (
  //   findIp.length == 1 &&
  //   findFp.length == 1 &&
  //   findIp[0].id != findFp[0].id
  // ) {
  //   fpp = await db.userfps.get({ fp: fingerprint });
  //   await db.userfps
  //     .where("ip")
  //     .equals(ip)
  //     .distinct()
  //     .modify(user => {
  //       user.fp.push(fingerprint);
  //       user.ip = user.ip.concat(fpp.ip);
  //       update.push(user.id);
  //     });
  //   del.push(fpp.id);
  //   await db.userfps.delete(fpp.id);
  //   // console.log("combine user");
  // } else {
  //   await db.userfps.add({
  //     ip: [ip],
  //     fp: [fingerprint]
  //   });
  //   await db.userfps
  //     .where("fp")
  //     .equals(fingerprint)
  //     .distinct()
  //     .modify(user => {
  //       add.push(user.id);
  //     });
  // }

  // //去除重复ip与fp
  // await rmDuplication().then(resolve => {
  //   //合并相同ip与fp
  //   combineUser().then(res => {
  //     let changer = JSON.parse(JSON.stringify(res));
  //     console.log(changer);
  //     update = update.concat(changer.update);
  //     del = del.concat(changer.del);
  //   });
  // });
  // console.log(update);
  // console.log(del);

  // await db.fingerprints
  //   .where({ fp: fingerprint })
  //   .distinct()
  //   .toArray()
  //   .catch(function(error) {
  //     // console.log("error: " + error);
  //     // db.close()
  //   })
  //   .then(res => {
  //     if (res.length == 0) {
  //       db.fingerprints.add({
  //         fp: fingerprint,
  //         userAgent: userAgent,
  //         cpu: cpu,
  //         screenPrint: screenPrint,
  //         colorDepth: colorDepth,
  //         availableResolution: availableResolution,
  //         mimeTypes: mimeTypes,
  //         fonts: fonts,
  //         timeZone: timeZone,
  //         language: language,
  //         core: core,
  //         screenOrientation,
  //         screenAngle,
  //         screenHeight,
  //         screenWidth
  //       });
  //     }
  //   });

  // //test area
  // await db.userfps.bulkAdd([
  //   { ip: ["127.0.0.2"], fp: [278497595] }, //278497595
  //   { ip: ["127.0.0.1", "127.0.0.0"], fp: [188316653] }
  // ]);
  // // await db.userfps
  // //   .where("fp")
  // //   .equals(188316653)
  // //   .or("fp")
  // //   .equals(278497595)
  // //   .distinct()
  // //   .modify(user => {
  // //     add.push(user.id);
  // //     console.log(add);
  // //   });
  // console.log(add);
  // console.log(222);
  // combineUser().then(res => {
  //   console.log(333);
  //   let changer = JSON.parse(JSON.stringify(res));
  //   console.log(changer);
  //   update = update.concat(changer.update);
  //   del = del.concat(changer.del);
  //   console.log(update);
  //   console.log(del);
  // });
  // console.log(update);
  // console.log(del);
  // change = { add: add, update: update, del: del };
  // // console.log(add);
  // // console.log(update);
  // // console.log(del);
  // console.log(JSON.parse(JSON.stringify(change)));
  // return JSON.parse(JSON.stringify(change));
  // // console.log(change);
}

// function getAdd() {
//   let tmp = add;
//   add = [];
//   console.log(tmp);
//   return tmp;
// }

// function getUpdate() {
//   let tmp = update;
//   update = [];
//   console.log(tmp);
//   return tmp;
// }

// function getDel() {
//   console.log(del);
//   let tmp = del;
//   del = [];
//   console.log(tmp);
//   return tmp;
// }

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
    // let update = [];
    // let del = [];
    db.userfps
      .toArray(user => {
        for (let i = 0; i < user.length - 1; i++) {
          // console.log("i:" + i);
          for (let j = i + 1; j < user.length; j++) {
            // let check = await db.userfps.toArray();
            // console.log("j:" + j);
            var flag = false;
            for (let k = 0; k < user[j].ip.length; k++) {
              // console.log("k:" + k);
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
        // var changer = { update: [], del: [] };
        // changer.update = changer.update.concat(update);
        // changer.del = changer.del.concat(del);
        // console.log(changer);
        res(change);
      });
  });
}

async function getUserfps() {
  // await combineUser();
  // let arr = await db.userfps.toArray();
  // return arr;
  return new Promise((res, rej) => {
    db.userfps
      .toArray(arr => {
        res(arr);
      })
      .catch(err => {
        // console.log(err);
      });
  });
}

function updateUfp(change) {
  console.log("update");
  console.log(change.update[0]);
  db.userfps
    .where("id")
    .equals(change.update[0])
    .first(updater => {
      console.log(updater);
      this.$axios({
        method: "get",
        url: "/update",
        params: {
          former: change.upfps,
          updater: updater
        }
      }).then(res => {
        console.log(res.data);
        if (res.date == "1001") {
          change.upfps = null;
          change.update = null;
        }
      });
    });
}

function addUfp(change) {
  console.log("add");
  console.log(change.add[0]);
  db.userfps
    .where("id")
    .equals(change.add[0])
    .first(adder => {
      console.log(adder);
      this.$axios({
        method: "get",
        url: "/add",
        params: {
          adder: adder
        }
      }).then(res => {
        console.log(res.data);
        if (res.date == "1001") {
          change.add = null;
        }
      });
    });
}

function delUfp(change) {
  console.log("del");
  console.log(change.del[0]);
  this.$axios({
    method: "get",
    url: "/del",
    params: {
      del: change.delfps
    }
  }).then(res => {
    console.log(res.data);
    if (res.date == "1001") {
      change.del = null;
      change.delfps = null;
    }
  });
}

export { saveUser, getUserfps, changer, updateUfp, addUfp, delUfp };
// module.exports = {
//   getIp: function() {
//     //ip
//     var ip = requestIp.getClientIp(req);
//     console.log(ip);

//     //fingerprint
//     const client = new ClientJS();

//     const windowClient = new window.ClientJS();

//     const fingerPrint = windowClient.getFingerprint();

//     console.log(fingerPrint);
//   },
// };
