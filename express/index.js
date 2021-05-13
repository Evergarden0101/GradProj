const express = require("express");

const app = express();
const port = 3000;

const Mongo = require("./mongo");
const ipfps = new Mongo("mongodb://localhost:27017/", "user", "ipfps");
const fps = new Mongo("mongodb://localhost:27017/", "user", "fps");

const checkLim = require("./limit");
const recCrawler = require("./crawlers");

app.get("/syncufp", (req, res) => {
    //获取数据
    if (req.query.arr) {
        let arr = [];
        req.query.arr.forEach(function (item) {
            arr.push(JSON.parse(item));
        });
        ipfps.insert(arr).then((result) => {
            res.send("1001"); //1001代表成功
        });
    }
});

app.get("/syncfps", (req, res) => {
    //获取数据
    if (req.query.arr) {
        let arr = [];
        req.query.arr.forEach(function (item) {
            arr.push(JSON.parse(item));
        });
        for (let i = 0; i < arr.length; i++) {
            fps.find(arr[i].fp).then(fp => {
                if (fp.length === 0) {
                    fps.insert(arr[i]).then((result) => {
                        res.send("1001"); //1001代表成功
                    });
                } else {
                    res.send("1001"); //1001代表成功
                }
            })
        }
    }
});

app.get("/update", (req, res) => {
    //获取数据
    if (req.query.updater) {
        console.log(JSON.parse(req.query.updater));
        ipfps.find(JSON.parse(req.query.former)).then((arr) => {
            if (arr.length > 0) {
                ipfps
                    .update(JSON.parse(req.query.former), JSON.parse(req.query.updater))
                    .then((result) => {
                        res.send("1001"); //1001代表成功
                    });
            } else {
                ipfps.insert(JSON.parse(req.query.updater)).then((result) => {
                    res.send("1001"); //1001代表成功
                });
            }
        });
    }
});

app.get("/add", (req, res) => {
    //获取数据
    if (req.query.adder) {
        console.log(JSON.parse(req.query.adder));
        ipfps.insert(JSON.parse(req.query.adder)).then((result) => {
            res.send("1001"); //1001代表成功
        });
    }
});

app.get("/count", (req, res) => {
    checkLim(req).then(lim => {
        console.log(lim)
    });
    recCrawler(req);
    res.send("1001"); //1001代表成功
});

app.get("/count1", (req, res) => {
    checkLim(req).then(lim => {
        console.log(lim)
    });
    recCrawler(req);
    res.send("1001"); //1001代表成功
});

app.get("/count2", (req, res) => {
    checkLim(req).then(lim => {
        console.log(lim)
    });
    recCrawler(req);
    res.send("1001"); //1001代表成功
});

app.get("/count3", (req, res) => {
    checkLim(req).then(lim => {
        console.log(lim)
    });
    recCrawler(req);
    res.send("1001"); //1001代表成功
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
