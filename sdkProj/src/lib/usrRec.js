const FingerprintJS = require("@fingerprintjs/fingerprintjs");

module.exports = {
  getIp: function() {
    //fingerprin
    var agent = FingerprintJS.load({});
    var identifier = agent.get({ debug: true });
    var visitorId = identifier.visitorId;
    var comp = identifier.components;
    
  }
};
