// importScripts("http://pv.sohu.com/cityjson?ie=utf-8");
// alert("Hello world!");
document.write("<script language=javascript src=\"http://pv.sohu.com/cityjson?ie=utf-8\"></script>");
// alert(returnCitySN["cip"] + "," + returnCitySN["cname"]);
// var sc = document.createElement("script");
h4="    var h3 = document.createElement(\"h3\");\n" +
    "    h3.innerText = returnCitySN[\"cip\"] + \",\" + returnCitySN[\"cname\"];\n" +
    "    document.body.insertBefore(h3, document.body.lastChild);";
// document.body.insertBefore(sc, document.body.lastChild);
document.write("<script language=javascript>" + h4 + "</script>");
// alert("Hello world!");

function getIp() {
    // alert("Hello world!");
    // console.log(returnCitySN["cip"] + "," + returnCitySN["cname"]);

    var h3 = document.createElement("h3");
    h3.innerText = returnCitySN["cip"] + "," + returnCitySN["cname"];
    document.body.insertBefore(h3, document.body.lastChild);
}

// module.exports = {
//     getIp: function () {
//         alert("Hello world!");
//         console.log(returnCitySN["cip"] + "," + returnCitySN["cname"]);
//         document.write(returnCitySN["cip"] + "," + returnCitySN["cname"]);
//     }
// };
