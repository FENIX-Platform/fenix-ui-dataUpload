define([
    'jquery',
    'fx-DataUpload/js/DataUpload/DataUpload',
    'bootstrap',
    'domReady!'
], function ($, DataUpload) {

    function init(containerID, config) {
        this.DUpload = new DataUpload(config);
        this.DUpload.render($(containerID), null);
    }

    function getData() { return this.DUpload.getData(); }

    function getColumns() { return this.DUpload.getColumns(); }

    return {
        init: init,
        getData: getData,
        getDSD: getColumns
    }
});