/*global requirejs, define*/
var locale = localStorage.getItem('locale' || 'en-us');

define(function () {

    //Define it as string : string
    //Explicit jquery path!  Don't use a prefix for it
    var config = {
        paths: {

            'fx-DataUpload/start': './start',
            "fx-DataUpload/config": "../config",
            "fx-DataUpload/js": "../js",
            "fx-DataUpload/templates": "../templates",
            "fx-DataUpload/multiLang": "../multiLang",
            "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min'
        },
        config: {i18n: {locale: locale}},
        shim: {
            "jqrangeslider": {
                deps: ["jquery"]
            },
            "bootstrap": {
                deps: ["jquery"]
            }
        }
    };

    return config;
});