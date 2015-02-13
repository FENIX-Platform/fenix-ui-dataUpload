define([
        'jquery',
        'fx-DataUpload/js/DataUpload/TextFileUpload',
        'text!fx-DataUpload/templates/DataUpload/DataUpload.htm',
        'fx-DataUpload/js/DataUpload/converters/CSV/CSVParsePreview'
],
    function ($, TextFileUpload, DataUploadHTML, CSVParsePreview) {
        var widgetName = "DataUpload";
        var evtDataParsed = "dataParsed." + widgetName + ".fenix";
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
            this.$csvParseWindow;

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
            this.$csvParseWindow = this.$container.find('#modalDataUploadPreview');

            var me = this;
            this.$upload.on('textFileUploaded.TextFileUpload.fenix', function (evt, csvData) {
                me.CSVParsePreview.setCSV_Text(csvData);
                me.$csvParseWindow.modal('show');
            });
            this.$container.find('#btnUploadPreviewCanc').click(function () { me.$csvParseWindow.modal('hide'); });
            this.$container.find('#btnUploadPreviewOk').click(function () {
                me.$csvParseWindow.modal('hide');
                me.$container.trigger(evtDataParsed);
            });

            /*
            this.$container.find('#btnEditRowCanc').click(function () { me.$editWindow.modal('hide'); });
            this.$container.find('#btnEditRowOk').click(function () { me.rowEditOk(); });
            this.$editWindow.on('hidden.bs.modal', function (e) { me.rowEditor.reset(); });
            <button id="btnUploadPreviewCanc" type="button" class="btn btn-default">__Cancel</button>
                            <button id="btnUploadPreviewOk" type="button" class="btn btn-default">__Ok</button>
            */
        }

        DataUpload.prototype.getData = function () {
            if (this.validate() != null)
                return false;

            var toRet = this.CSVParsePreview.getData();
            if (!toRet)
                return false;
            return toRet;
        }

        DataUpload.prototype.getColumns = function () {
            if (this.validate() != null) 
                return false;

            var header = this.CSVParsePreview.getHeaderRow();
            if (!header) {
                return false;
            }
            var dTypes = this.CSVParsePreview.getDataTypes();//Cannot determine the datatype, number could be a year or a value
            var toRet = [];
            for (var i = 0; i < header.length; i++) {
                toRet.push({ id: header[i], title: { EN: header[i] } });
            }
            return toRet;
        }

        DataUpload.prototype.validate = function () {
            return this.CSVParsePreview.validate();
        }
        DataUpload.prototype.alertValidation = function () {
            var valRes = this.CSVParsePreview.validate();
            if (valRes == null)
                return;
            var toShow = "";
            for (var i = 0 ; i < valRes.length; i++)
                toShow += valRes[i].type + "\r\n";
            alert(toShow);
        }

        return DataUpload;
    });