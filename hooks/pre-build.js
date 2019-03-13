var fs = require('fs-extra');
var jsonConcat = require("json-concat");

var localizationSourceFilesEN = [
  "./i18n/general.en.json",
  "./i18n/auth.en.json",
  "./i18n/categories.en.json",
  "./i18n/components.en.json",
  "./i18n/admin.en.json",
  "./i18n/artifacts.en.json"
];

var localizationSourceFilesHR = [
  "./i18n/general.hr.json",
  "./i18n/auth.hr.json",
  "./i18n/categories.hr.json",
  "./i18n/components.hr.json",
  "./i18n/admin.hr.json",
  "./i18n/artifacts.hr.json"
];

var localizationSourceFilesFR = [
  "./i18n/artifacts.fr.json",
  "./i18n/auth.fr.json",
  "./i18n/categories.fr.json",
  "./i18n/components.fr.json",
  "./i18n/admin.fr.json",
];

function mergeAndSaveJsonFiles(src, dest) {
  jsonConcat({ src: src, dest: dest },
    function (res) {
      console.log('Localization files successfully merged!');
    }
  );
}

function setEnvironment(configPath, environment) {
  fs.writeJson(configPath, {env: environment},
    function (res) {
      console.log('Environment variable set to ' + environment)
    }
  );
}

// Set environment variable to "production"
setEnvironment('./src/config/env.json', 'production');

// Merge all localization files into one
mergeAndSaveJsonFiles(localizationSourceFilesEN, "./src/i18n/en.json");
mergeAndSaveJsonFiles(localizationSourceFilesHR, "./src/i18n/hr.json");
mergeAndSaveJsonFiles(localizationSourceFilesFR, "./src/i18n/fr.json");

