const requestIp = require('request-ip');
var urlMoudule = require("url");
const Mongo = require("./mongo");
const apis = new Mongo("mongodb://localhost:27017/", "user", "apis");
const lims = new Mongo("mongodb://localhost:27017/", "user", "lims");
const whites = new Mongo("mongodb://localhost:27017/", "user", "whites");

function checkLim(req) {
    return new Promise((res, rej) => {
        const clientIp = requestIp.getClientIp(req);
        // const ip=req.ip;

        const urlObj = urlMoudule.parse(req.url);
        const pathname = urlObj.pathname;
        const reqTime = new Date();
        // const reqTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        // console.log("reqTime:" + reqTime);

        const filter = {api: pathname, ip: clientIp};
        apis.find(filter).then(arr => {
            if (arr.length == 0) {
                apis.insert({ip: clientIp, api: pathname, time: [reqTime], count: 1}).then(() => {
                    res(0);
                })
            } else if (arr.length == 1) {
                //    0.判断是否已经被限制
                //    1.根据count遍历time数组 undone已更新
                //    2.新数组存下1min以内的time
                //    3.更新count为新time.length
                lims.find({ip: clientIp}).then(limit => {
                    if ((limit.length > 0 && limit[0].time <= reqTime) || limit.length == 0) {
                        if (limit.length > 0) {
                            // console.log("timelimit:" + limit[0].time);
                            lims.delete({ip: clientIp});
                        }
                        //异步注意 undone
                        var tmp = [reqTime];
                        for (let i = 0; i < arr[0].count; i++) {
                            let last = arr[0].time[i];
                            let gap = reqTime.getTime() - last.getTime();
                            // console.log("last:" + gap);
                            if (gap < 60000) {
                                tmp.push(last);
                            }
                        }
                        // console.log("newTime:" + tmp);
                        var count = tmp.length;
                        // console.log("Count:" + count);
                        //注意可能的异步问题 undone
                        apis.update(filter, {ip: clientIp, api: pathname, time: tmp, count: count}).then(() => {
                            //    1.count>=10
                            //    2.查white
                            //    3.加限制
                            console.log("Count:" + count);
                            if (count >= 10) {
                                whites.find({ip: clientIp}).then(white => {
                                    console.log("white:" + white);
                                    if (white.length == 0) {
                                        lims.insert({ip: clientIp, time: reqTime.getTime() + 60000});
                                        // console.log("new limits");
                                    }
                                })
                            }
                            //异步注意 undone
                            res(0);
                        })
                    } else {
                        res(limit[0].time - reqTime);
                    }
                })
            }
        })
    });
};

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


// res为受限剩余秒数，最大60s，0为不受限
module.exports = checkLim;


// // inside middleware handler
// const ipMiddleware = function(req, res, next) {

//     next();
// };

