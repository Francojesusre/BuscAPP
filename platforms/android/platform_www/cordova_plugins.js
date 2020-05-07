cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com.wikitude.phonegap.wikitudeplugin.WikitudePlugin",
    "file": "plugins/com.wikitude.phonegap.wikitudeplugin/www/WikitudePlugin.js",
    "pluginId": "com.wikitude.phonegap.wikitudeplugin",
    "clobbers": [
      "WikitudePlugin"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.geolocation",
    "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "navigator.geolocation"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.PositionError",
    "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
    "pluginId": "cordova-plugin-geolocation",
    "runs": true
  },
  {
    "id": "cordova-plugin-keyboard.keyboard",
    "file": "plugins/cordova-plugin-keyboard/www/keyboard.js",
    "pluginId": "cordova-plugin-keyboard",
    "clobbers": [
      "window.Keyboard"
    ]
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova-plugin-statusbar.statusbar",
    "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
    "pluginId": "cordova-plugin-statusbar",
    "clobbers": [
      "window.StatusBar"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "com.wikitude.phonegap.wikitudeplugin": "9.0.0",
  "cordova-plugin-geolocation": "4.0.2",
  "cordova-plugin-keyboard": "1.2.0",
  "cordova-plugin-splashscreen": "5.0.3",
  "cordova-plugin-statusbar": "2.4.3",
  "cordova-plugin-whitelist": "1.3.4",
  "cordova-plugin-wkwebview-engine": "1.2.1",
  "cordova-plugin-wkwebview-file-xhr": "2.1.4"
};
// BOTTOM OF METADATA
});