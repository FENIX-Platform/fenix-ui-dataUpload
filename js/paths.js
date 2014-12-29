/*global requirejs, define*/
var locale = localStorage.getItem('locale' || 'en-us');

define(function () {

    var config = {
            paths: {
                'fx-DataUpload/start': './start',
                "fx-DataUpload/config": "../config",
                "fx-DataUpload/js": "../js",
                "fx-DataUpload/templates": "../templates",
                "fx-DataUpload/multiLang": "../multiLang",
                "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
                'jquery': '../lib/jquery'
            },
            config: {i18n: {locale: locale}},
            shim: {
                "jqrangeslider": {
                    deps: ["jquery", "jqueryui"]
                },
                "bootstrap": {
                    deps: ["jquery"]
                }
            }
        }
        ;

    return config;
});