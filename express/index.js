const express = require("express");

const app = express();
const port = 3000;

//连接数据库表
const Mongo = require("./mongo");
//用户fingerprint与ip地址表
const ipfps = new Mongo("mongodb://localhost:27017/", "user", "ipfps");
//用户fingerprint与详细信息表
const fps = new Mongo("mongodb://localhost:27017/", "user", "fps");

//导入爬虫识别和流控模块
const checkLim = require("./limit");
const recCrawler = require("./crawlers");

app.get("/syncufp", (req, res) => {
    //同步fingerprint与ip地址表
    if (req.query.arr) {
        let arr = [];
        req.query.arr.forEach(function (item) {
            arr.push(JSON.parse(item));
        });

        for (let i = 0; i < arr.length; i++) {
            console.log(arr[i]);
            ipfps.find({fp: arr[i].fp}).then(user => {
                if (user.length === 0) {
                    ipfps.insert(arr[i])
                } else {
                    console.log(user[0]);
                    let ip = user[0].ip;
                    for (let j = 0; j < arr[i].ip.length; j++) {
                        if (user[0].ip.indexOf(arr[i].ip[j]) === -1) {
                            ip.push(arr[i].ip[j]);
                        }
                    }
                    ipfps.update({fp: arr[i].fp}, {fp: arr[i].fp, ip: ip})
                }
            })
        }
        res.send("1001");
    }
});

app.get("/syncfps", (req, res) => {
    //同步fingerprint与详细信息表
    if (req.query.arr) {
        let arr = [];
        req.query.arr.forEach(function (item) {
            arr.push(JSON.parse(item));
        });
        for (let i = 0; i < arr.length; i++) {
            // console.log(arr[i]);
            fps.find({fp: arr[i].fp}).then(fp => {
                if (fp.length === 0) {
                    fps.insert(arr[i]);
                }
            })
        }
        res.send("1001"); //1001代表成功
    }
});

// 爬虫识别、流量控制
app.get("/count", (req, res) => {
    checkLim(req).then(lim => {
        console.log(lim)
    });
    recCrawler(req);
    res.send("1001"); //1001代表成功
});

//用于模拟爬虫的循环借口
app.get("/counta", (req, res) => {
    checkLim(req).then(lim => {
        console.log(lim)
    });
    recCrawler(req);
    res.send("1001"); //1001代表成功
});

app.get("/countb", (req, res) => {
    checkLim(req).then(lim => {
        console.log(lim)
    });
    recCrawler(req);
    res.send("1001"); //1001代表成功
});

app.get("/countc", (req, res) => {
    checkLim(req).then(lim => {
        console.log(lim)
    });
    recCrawler(req);
    res.send("1001"); //1001代表成功
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
