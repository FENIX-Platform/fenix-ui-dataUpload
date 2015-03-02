define([
    'jquery',
    'fx-DataUpload/js/DataUpload/DataUpload',
    'bootstrap'
], function ($, DataUpload) {

    function init(containerID, config) {
        this.DUpload = new DataUpload(config);
        this.DUpload.render($(containerID), null);
    }

    function getData() { return this.DUpload.getData(); }
    function getColumns() { return this.DUpload.getColumns(); }
    function validate() { return this.DUpload.validate(); }
    function alertValidation() { return this.DUpload.alertValidation(); }
    function destroy() { return this.DUpload.destroy(); }

    return {
        init: init,
        getData: getData,
        getColumns: getColumns,
        validate: validate,
        alertValidation: alertValidation,
        destroy: destroy
    }
});