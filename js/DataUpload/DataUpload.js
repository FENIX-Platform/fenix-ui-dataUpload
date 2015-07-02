define([
        'jquery',
        'fx-DataUpload/js/DataUpload/TextFileUpload',
        'text!fx-DataUpload/templates/DataUpload/DataUpload.htm',
        'fx-DataUpload/js/DataUpload/converters/CSV/CSVParsePreview',
        'i18n!fx-DataUpload/multiLang/DataUpload/nls/ML_DataUpload',
        'pnotify'
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
                var valRes = me.CSVParsePreview.setCSV_Text(csvData);
                //Something is not validated
                if (valRes && valRes.length > 0) {
                    for (var i = 0; i < valRes.length; i++)
                    {
                        var msg = mlRes[valRes[i].type];
                        //if (valRes[i].type=='wrongColumnID')
                        new PNotify({
                            title: '',
                            //text: errMsg,
                            text:valRes[i].message,
                            type: 'error'
                        });
                    }
                    
                    //Error parsing reset
                    me.txtUpload.reset();
                }
                else {
                    me.$csvParseWindow.modal('show');
                }
            });
            this.$container.find('#btnUploadPreviewCanc').on('click', function () {
                me.$csvParseWindow.modal('hide');
                me.txtUpload.reset();
            });
            this.$container.find('#btnUploadPreviewOk').on('click', function () {
                me.$csvParseWindow.modal('hide');
                me.txtUpload.reset();
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

        DataUpload.prototype.reset = function () {
            this.txtUpload.reset();
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