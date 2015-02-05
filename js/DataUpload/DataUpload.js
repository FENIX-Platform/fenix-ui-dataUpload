define([
        'jquery',
        'fx-DataUpload/js/DataUpload/TextFileUpload',
        'text!fx-DataUpload/templates/DataUpload/DataUpload.htm',
        'fx-DataUpload/js/DataUpload/converters/CSV/CSVParsePreview'
],
    function ($, TextFileUpload, DataUploadHTML, CSVParsePreview) {
        var widgetName = "DataUpload";
        var evtCSVUploaded = "csvUploaded." + widgetName + ".fenix";
        var defConfig = {
            csvOptions: {
                separator: ',',
                quote: '"'
            }
        };

        var DataUpload = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
            this.$container;
            this.$upload;
            this.txtUpload;

            this.CSVParsePreview = new CSVParsePreview();
        };

        //Render - creation
        DataUpload.prototype.render = function (container, config) {
            $.extend(true, this.config, config);
            this.$container = container;
            this.$container.html(DataUploadHTML);

            this.$upload = this.$container.find('#cntDataUpload');
            this.txtUpload = new TextFileUpload();
            this.txtUpload.render(this.$upload);

            this.CSVParsePreview.render($("#cntDataUploadPreview"));

            var me = this;
            this.$upload.on('textFileUploaded.TextFileUpload.fenix', function (evt, csvData) {
                me.CSVParsePreview.setCSV_Text(csvData);
            });
        }

        DataUpload.prototype.getData = function ()
        { return this.CSVParsePreview.getData(); }

        DataUpload.prototype.getColumns = function () {
            var header = this.CSVParsePreview.getHeaderRow();
            if (!header)
                return null;
            var dTypes = this.CSVParsePreview.getDataTypes();//Cannot determine the datatype, number could be a year or a value
            var toRet = [];
            for (var i = 0; i < header.length; i++) {
                toRet.push({ id: header[i], title: { EN: header[i] }});
            }
            return toRet;
        }

        DataUpload.prototype.validate = function ()
        {
            return this.CSVParsePreview.validate();
        }

        return DataUpload;
    });