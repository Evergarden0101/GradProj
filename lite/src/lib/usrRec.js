var db = new Dexie("user");
db.version(1).stores({
  userfps: "++id, *ip, *fp",
  fingerprints:
    "fp, userAgent, cpu, screenPrint, colorDepth, availableResolution, mimeTypes, fonts, timeZone, language, core"
});

async function saveUser() {
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
    db.userfps
      .where({ fp: fingerprint })
      .distinct()
      .toArray(arr => {
        if (arr.length === 0) {
          db.userfps.add({
            fp: fingerprint,
            ip: [ip]
          });
        } else {
          if (arr[0].fp !== fingerprint) {
            db.userfps.clear().then(() => {
              db.userfps.add({
                fp: fingerprint,
                ip: [ip]
              });
            });
          } else {
            for (var i = 0; i < arr[0].ip.length; i++) {
              if (arr[0].ip[i] === ip) break;
            }
            if (i === arr[0].ip.length) {
              db.userfps
                .where({ fp: fingerprint })
                .distinct()
                .distinct()
                .modify(user => {
                  user.ip.push(ip);
                });
            }
          }
        }
      })
      .then(() => {
        db.fingerprints
          .where({ fp: fingerprint })
          .distinct()
          .toArray(arr => {
            if (arr.length === 0) {
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
      .then(() => {
        result(1001);
      });
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

export { saveUser };
