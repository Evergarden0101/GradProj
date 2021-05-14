const requestIp = require('request-ip');    //用于获取ip地址
var urlMoudule = require("url");    //用于解析url

const Mongo = require("./mongo");
// 连接ip-request表
const reqs = new Mongo("mongodb://localhost:27017/", "user", "reqs");
// 连接已识别的爬虫表
const craws = new Mongo("mongodb://localhost:27017/", "user", "craws");

//执行识别的请求个数下限和所用请求个数上限
const low = 20, high = 50;

//判断为爬虫的分界百分比
const gap_rate = 50;
const loop_rate = 50;

function recCrawler(req) {
    return new Promise((res, rej) => {
        //获取ip、请求的接口、时间
        const clientIp = requestIp.getClientIp(req);
        const urlObj = urlMoudule.parse(req.url);
        const pathname = urlObj.pathname;
        const reqTime = new Date();

        //插入新request
        //新请求的在数组尾部
        reqs.find({ip: clientIp}).then(arr => {
            var count = 1;  //每个ip的请求计数
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

                    //间隔相同比例大于rate认定为爬虫
                    if (same * 100 / gap.length >= gap_rate) {
                        if (craw.length === 0) {
                            craws.insert({ip: clientIp, reason: ["sameGap"]});
                        } else {
                            let reason = craw[0].reason;
                            reason.push("sameGap");
                            craws.update({ip: clientIp}, {ip: clientIp, reason: reason});
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

                    //记录最大连续的循环个数
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
                    if (max * 100 / loop.length >=loop_rate) {
                        if (craw.length === 0) {
                            craws.insert({ip: clientIp, reason: ["loopApi"]});
                        } else {
                            let reason = craw[0].reason;
                            reason.push("loopApi");
                            craws.update({ip: clientIp}, {ip: clientIp, reason: reason});
                        }
                    }
                }
            })
        })
    })
}

module.exports = recCrawler;
