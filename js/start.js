define([
    'jquery',
    'fx-DataUpload/js/DataUpload/DataUpload',
    'bootstrap',
    'domReady!'
], function ($, DataUpload) {

    function DataUpload_starter(containerID, config) {
        this.DU = new DataUpload(config);
        this.DU.render($(containerID), null);
    }

    return {
        init: DataUpload_starter
    }
});