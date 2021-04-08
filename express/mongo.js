var MongoClient = require("mongodb").MongoClient;

class Mongo {
  constructor(url, dbName, collectionName) {
    this.url = url;
    this.dbName = dbName;
    this.collectionName = collectionName;
  }
  _connect() {
    return new Promise((res, rej) => {
      MongoClient.connect(
        this.url,
        { useUnifiedTopology: true },
        (err, client) => {
          if (err) return rej(err);
          res(client);
        }
      );
    });
  }

  insert(obj) {
    return new Promise((res, rej) => {
      this._connect().then((client) => {
        let db = client.db(this.dbName);
        if (Array.isArray(obj)) {
          db.collection(this.collectionName)
            .insertMany(obj)
            .then((resolve) => {
              res(resolve);
              client.close();
            });
        } else {
          db.collection(this.collectionName)
            .insertOne(obj)
            .then((resolve) => {
              res(resolve);
              client.close();
            });
        }
      });
    });
  }

  delete(obj) {
    return new Promise((res, rej) => {
      this._connect().then((client) => {
        let db = client.db(this.dbName);
        if (Array.isArray(obj)) {
          db.collection(this.collectionName)
            .deleteMany(obj)
            .then((resolve) => {
              res(resolve);
              client.close();
            });
        } else {
          db.collection(this.collectionName)
            .deleteOne(obj)
            .then((resolve) => {
              res(resolve);
              client.close();
            });
        }
      });
    });
  }

  update(filter, updater) {
    return new Promise((res, rej) => {
      this._connect().then((client) => {
        let db = client.db(this.dbName);
        let updaterCopy = { $set: updater };
        db.collection(this.collectionName)
          .updateMany(filter, updaterCopy)
          .then((resolve) => {
            res(resolve);
            client.close();
          });
      });
    });
  }

  find(obj) {
    obj = obj || {};
    let arr = [];
    return new Promise((res, rej) => {
      this._connect().then((client) => {
        let db = client.db(this.dbName);
        let findRes = db.collection(this.collectionName).find(obj);
        findRes.toArray((err, data) => {
          if (err) throw err;
          res(data);
          client.close();
        });
      });
    });
  }
}

module.exports = Mongo;

// const mongo = new Mongo("mongodb://localhost:27017/", "user", "ipfps");
// let obj = [{"id": 3, "ip": ["127.0.0.3"], "fp": [188316655]},{"id": 4, "ip": ["127.0.0.4"], "fp": [188316656]}];
// mongo.insert(obj).then((res) => {
//   console.log(res);
// });

// let obj ={id:"2"};
// mongo.delete(obj).then(res=>{
//   console.log(res)
// })

// let filter = { ip: "127.0.0.0" };
// let updater = { ip: ["127.0.0.1"] };
// mongo.update(filter, updater).then((res) => {
//   console.log(res);
// });

// mongo.find().then((arr) => {
//   console.log(arr);
// });

