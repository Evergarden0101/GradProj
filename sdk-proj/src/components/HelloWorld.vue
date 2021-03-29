<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank">
          Core Docs
        </a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank">
          Forum
        </a>
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank">
          Community Chat
        </a>
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank">
          Twitter
        </a>
      </li>
      <br />
      <li>
        <a href="http://vuejs-templates.github.io/webpack/" target="_blank">
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a href="http://router.vuejs.org/" target="_blank">
          vue-router
        </a>
      </li>
      <li>
        <a href="http://vuex.vuejs.org/" target="_blank">
          vuex
        </a>
      </li>
      <li>
        <a href="http://vue-loader.vuejs.org/" target="_blank">
          vue-loader
        </a>
      </li>
      <li>
        <a href="https://github.com/vuejs/awesome-vue" target="_blank">
          awesome-vue
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import ClientJS from "clientjs";
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  beforeMount() {
    // var client = new ClientJS();
    const client = new window.ClientJS();
    const fingerprint = client.getFingerprint();
    console.log('fingerprint: '+fingerprint);
    var softwareVersion = client.getSoftwareVersion(); // Get ClientJS Software Version
    console.log('softwareVersion: '+softwareVersion);
    var userAgent = client.getUserAgent(); // Get User Agent String
    console.log('userAgent: '+userAgent);
    var isChrome = client.isChrome(); // Check For Chrome
    console.log('isChrome: '+isChrome);
    var engine = client.getEngine(); // Get Engine
    console.log('engine: '+engine);
    var device = client.getDevice(); // Get Device
    console.log('device: '+device);
    var deviceType = client.getDeviceType(); // Get Device Type
    console.log('deviceType: '+deviceType);
    var deviceVendor = client.getDeviceVendor(); // Get Device Vendor
    console.log('deviceVendor: '+deviceVendor);
    var CPU = client.getCPU(); // Get CPU Architecture
    console.log('CPU: '+CPU);
    var screenPrint = client.getScreenPrint(); // Get Screen Print
    console.log('screenPrint: '+screenPrint);
    var colorDepth = client.getColorDepth(); // Get Color Depth
    console.log('colorDepth: '+colorDepth);
    var currentResolution = client.getCurrentResolution(); // Get Current Resolution
    console.log('currentResolution: '+currentResolution);
    var availableResolution = client.getAvailableResolution(); // Get Available Resolution
    console.log('availableResolution: '+availableResolution);
    var plugins = client.getPlugins(); // Get Plugins
    console.log('plugins: '+plugins);
    if (client.isMimeTypes()) {
      var mimeTypes = client.getMimeTypes(); // Get Mime Types
      console.log('mimeTypes: '+mimeTypes);
    }
    var fonts = client.getFonts(); // Get Fonts
    console.log('fonts: '+fonts);
    var isLocalStorage = client.isLocalStorage(); // Check For Local Storage
    console.log('isLocalStorage: '+isLocalStorage);
    var isSessionStorage = client.isSessionStorage(); // Check For Session Storage
    console.log('isSessionStorage: '+isSessionStorage);
    var isCookie = client.isCookie(); // Check For Cookies
    console.log('isCookie: '+isCookie);
    var timeZone = client.getTimeZone(); // Get Time Zone
    console.log('timeZone: '+timeZone);
    var language = client.getLanguage(); // Get User Language
    console.log('language: '+language);
    var systemLanguage = client.SystemLanguage(); // Get System Language
    console.log('systemLanguage: '+systemLanguage);
    if (client.isCanvas()) {
      var canvasPrint = client.getCanvasPrint(); // Get Canvas Print
      console.log('canvasPrint: '+canvasPrint);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
