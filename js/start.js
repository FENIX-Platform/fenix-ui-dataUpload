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

    function getData() { return DataUpload.getData(); }

    function getColumns() { return DataUpload.getColumns(); }

    return {
        init: init,
        getData: getData,
        getDSD: getColumns
    }
});