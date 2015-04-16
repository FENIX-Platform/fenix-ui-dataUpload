define([
        'jquery',
        'fx-DataUpload/js/DataUpload/TextFileUpload',
        'text!fx-DataUpload/templates/DataUpload/DataUpload.htm',
        'fx-DataUpload/js/DataUpload/converters/CSV/CSVParsePreview',
        'i18n!fx-DataUpload/multiLang/DataUpload/nls/ML_DataUpload',
],
    function ($, TextFileUpload, DataUploadHTML, CSVParsePreview, mlRes) {
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
            this.$container.find('#btnUploadPreviewCanc').on('click', function () { me.$csvParseWindow.modal('hide'); });
            this.$container.find('#btnUploadPreviewOk').on('click', function () {
                me.$csvParseWindow.modal('hide');
                me.$container.trigger(evtDataParsed);
            });

            this._doML();
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
            var toRet = this.CSVParsePreview.validate();
            if (toRet)
                for (var i = 0 ; i < toRet.length; i++)
                    toRet.message = mlRes[toRet[i].type];
            return toRet;
        }
        DataUpload.prototype.alertValidation = function () {
            var valRes = this.CSVParsePreview.validate();
            if (valRes == null)
                return;
            var toShow = "";
            for (var i = 0 ; i < valRes.length; i++)
                toShow += mlRes[valRes[i].type] + "\r\n";
            alert(toShow);
        }

        DataUpload.prototype.destroy = function () {
            this.CSVParsePreview.destroy();
            this.txtUpload.destroy();
            this.$upload.off('textFileUploaded.TextFileUpload.fenix');
            this.$container.find('#btnUploadPreviewCanc').off('click');
            this.$container.find('#btnUploadPreviewOk').off('click');
        }

        DataUpload.prototype._doML = function () {
            this.$container.find('#btnUploadPreviewCanc').html(mlRes.cancel);
            this.$container.find('#btnUploadPreviewOk').html(mlRes.ok);
        }

        return DataUpload;
    });