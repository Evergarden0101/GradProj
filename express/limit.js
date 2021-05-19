const requestIp = require('request-ip');
var urlMoudule = require("url");
const Mongo = require("./mongo");
//连接ip-接口-时间表
const apis = new Mongo("mongodb://localhost:27017/", "user", "apis");
//连接ip-限制表
const lims = new Mongo("mongodb://localhost:27017/", "user", "lims");
//连接白名单表
const whites = new Mongo("mongodb://localhost:27017/", "user", "whites");
//连接爬虫表
const craws = new Mongo("mongodb://localhost:27017/", "user", "craws");

function checkLim(req) {
    return new Promise((res, rej) => {
        //获取ip、请求的接口、时间
        const clientIp = requestIp.getClientIp(req);
        // const ip=req.ip;
        const urlObj = urlMoudule.parse(req.url);
        const pathname = urlObj.pathname;
        const reqTime = new Date();
        // const reqTime = new Date().format("yyyy-MM-dd hh:mm:ss");

        const filter = {api: pathname, ip: clientIp};
        apis.find(filter).then(arr => {
            //记录请求的ip、接口与时间
            if (arr.length == 0) {
                apis.insert({ip: clientIp, api: pathname, time: [reqTime], count: 1}).then(() => {
                    //  第一次请求新接口，不受限返回0
                    res(0);
                })
            } else if (arr.length == 1) {
                lims.find({ip: clientIp}).then(limit => {
                    //    判断是否已经被限制
                    if (limit.length == 0 || (limit.length > 0 && limit[0].time <= reqTime)) {
                        //  限制时间已过则删除
                        if (limit.length > 0) {
                            lims.delete({ip: clientIp});
                        }

                        //  更新time数组，存下1min以内的time undone更新论文
                        var tmp = [reqTime];
                        for (let i = 0; i < arr[0].count; i++) {
                            let last = arr[0].time[i];
                            console.log(last)
                            let gap = reqTime.getTime() - last.getTime();
                            if (gap < 60000) {
                                tmp.push(last);
                            } else {
                                // 新的time在小位,可直接跳出
                                break;
                            }
                        }

                        //  更新count为新time.length
                        var count = tmp.length;

                        apis.update(filter, {ip: clientIp, api: pathname, time: tmp, count: count}).then(() => {
                            if (count >= 10) {
                                //  若超过每分钟10次，则查找白名单
                                whites.find({ip: clientIp}).then(white => {
                                    if (white.length == 0) {
                                        //  若不在白名单则设置限制
                                        lims.insert({ip: clientIp, time: reqTime.getTime() + 60000});
                                        craws.find({ip: clientIp}).then(craw => {
                                            if (craw.length == 0) {
                                                craws.insert({ip: clientIp, reason: ["highFreq"]});
                                            } else {
                                                let reason = craw[0].reason;
                                                if (reason.indexOf("highFreq") === -1) {
                                                    reason.push("highFreq");
                                                    craws.update({ip: clientIp}, {ip: clientIp, reason: reason});
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                            //  不被限制则返回0
                            res(0);
                        })
                    } else {
                        // 仍被限制则返回剩余等待时间(ms)
                        res(limit[0].time - reqTime);
                    }
                })
            }
        })
    });
};

// 日期格式化
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                   //月份
        "d+": this.getDate(),                        //日
        "h+": this.getHours(),                       //小时
        "m+": this.getMinutes(),                     //分
        "s+": this.getSeconds(),                     //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()                  //毫秒
    };

    //  获取年份
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        // ②
        if (new RegExp("(" + k + ")", "i").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}


// res为受限剩余秒数，最大60000ms，0为不受限
module.exports = checkLim;

