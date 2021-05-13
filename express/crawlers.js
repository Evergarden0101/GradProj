const requestIp = require('request-ip');
var urlMoudule = require("url");
const Mongo = require("./mongo");
const reqs = new Mongo("mongodb://localhost:27017/", "user", "reqs");
const craws = new Mongo("mongodb://localhost:27017/", "user", "craws");

//执行识别的个数下限和所用最多个数
const low = 20, high = 50;

//相同间隔的百分比
const rate = 50;

function recCrawler(req) {
    return new Promise((res, rej) => {
        const clientIp = requestIp.getClientIp(req);
        const urlObj = urlMoudule.parse(req.url);
        const pathname = urlObj.pathname;
        const reqTime = new Date();

        //插入新request
        //假定插入的再后面 未验证 undone
        reqs.find({ip: clientIp}).then(arr => {
            var count = 1;
            var len = arr.length;
            if (len > 0) {
                count = arr[len - 1].count + 1;
            }
            reqs.insert({ip: clientIp, api: pathname, time: reqTime, count: count});

            //少于20个的不识别规律
            if (len < low) {
                res(0);
            }

            craws.find({ip: clientIp}).then(craw => {
                //    判断间隔
                //    选了至少20至多50个来做
                if (craw.length === 0 || craw[0].reason.indexOf("sameGap") === -1) {
                    //计算请求间隔时间
                    let tmp = reqTime.getTime() - arr[len - 1].time.getTime();
                    let gap = [tmp];
                    if (len >= high) {
                        for (let i = len - 1; i > len - 49; i--) {
                            tmp = arr[i].time.getTime() - arr[i - 1].time.getTime();
                            gap.push(tmp)
                        }
                    } else if (len >= low) {
                        for (let i = len - 1; i > 0; i--) {
                            tmp = arr[i].time.getTime() - arr[i - 1].time.getTime();
                            gap.push(tmp)
                        }
                    }

                    //对间隔排序
                    gap.sort(function (a, b) {
                        return a - b
                    });

                    //统计间隔相同的请求个数
                    let same = 0;
                    for (let i = 0; i < gap.length - 1; i++) {
                        if (gap[i] === gap[i + 1]) {
                            same++;
                        } else {
                            if (gap[i] === gap[i - 1]) {
                                same++;
                            }
                        }
                    }
                    console.log("same:"+same);


                    //间隔相同比例大于rate认定为爬虫
                    if (same * 100 / gap.length >= rate) {
                        if (craw.length === 0) {
                            craws.insert({ip: clientIp, reason: ["sameGap"]});
                            console.log("new gap");
                        } else {
                            let reason = craw[0].reason;
                            reason.push("sameGap");
                            craws.update({ip: clientIp}, {ip: clientIp, reason: reason});
                            console.log("add gap");
                        }
                    }
                }

                //判断循环接口请求
                if (craw.length === 0 || craw[0].reason.indexOf("loopApi") === -1) {
                    //记录相同接口之间的间隔计数
                    let loop = [];
                    if (len >= high) {
                        for (let i = len - 1; i > len - 49; i--) {
                            let flag = true;
                            for (let j = i - 1; j >= len - 50; j--) {
                                if (arr[i].api === arr[j].api) {
                                    loop.push(i - j);
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) loop.push(0);
                        }
                    } else {
                        for (let i = len - 1; i > 1; i--) {
                            let flag = true;
                            for (let j = i - 1; j >= 0; j--) {
                                if (arr[i].api === arr[j].api) {
                                    loop.push(i - j);
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) loop.push(0);
                        }
                    }

                    let max = 0;
                    let tmp = 1;
                    for (let i = 0; i < loop.length; i++) {
                        if (loop[i] === loop[i + 1]) {
                            if (loop[i] !== 0)
                                tmp++;
                        } else {
                            if (max < tmp) {
                                max = tmp;
                            }
                            tmp = 1;
                        }
                    }

                    //循环相同比例大于rate认定为爬虫
                    if (max * 100 / loop.length >= rate) {
                        if (craw.length === 0) {
                            craws.insert({ip: clientIp, reason: ["loopApi"]});
                            console.log("new loop");
                        } else {
                            let reason = craw[0].reason;
                            reason.push("loopApi");
                            craws.update({ip: clientIp}, {ip: clientIp, reason: reason})
                            console.log("add loop");
                        }
                    }
                }
            })
        })
    })
}

module.exports = recCrawler;
