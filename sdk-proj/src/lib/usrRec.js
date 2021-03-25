// var ClientJS=require("clientjs");

module.exports = {
  getIp: function() {
    const client = new ClientJS();
    
    const windowClient = new window.ClientJS();

    const fingerPrint = windowClient.getFingerprint();

    console.log(fingerPrint);
  }
};
