define([
    'jquery',
    'fx-DataUpload/js/DataUpload/DataUpload',
    'bootstrap',
    'domReady!'
], function ($, DataUpload) {

    function init(containerID, config) {
        DataUpload = new DataUpload(config);
        DataUpload.render($(containerID), null);
    }


    return {
        init: init
    }
});