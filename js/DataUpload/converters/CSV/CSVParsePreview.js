define([
'jquery',
'fx-DataUpload/js/DataUpload/converters/CSV/CSVToStringArray',
'fx-DataUpload/js/DataUpload/converters/CSV/CSVParseValidator',
'text!fx-DataUpload/templates/DataUpload/DataParsePreview.html'
],
function ($, CSVToStringArray, CSVParseValidator, DataParsePreviewHTML) {
    var keyCodesIgnore = [16];

    this.defConfig = {
        maxLinesToShow: 10,
        CSVParseOptions: {
            fSep: ',',
            //quot: '"',
            decimalSep: ".",
            thousandsSep: "",
            trim: true,
            removeEmptyLines: true
        }
    };

    function CSVParsePreview(config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$container;
        this.$prevArea;
        this.txt;
        this.toArr = new CSVToStringArray();
        this.arrData;
        this.arrDataTypes;
    };

    CSVParsePreview.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$container = container;
        this.$container.html(DataParsePreviewHTML);
        this.$prevArea = this.$container.find('#divPreviewArea');
        this.$txtSeparator = this.$container.find('#txtSeparator');
        this.addEvents();
        this.parseOptionsToInterface();
    }

    CSVParsePreview.prototype.setCSV_Text = function (txt) {
        this.txt = txt;
        this.parseCSV();

        var valRes = this.validate();
        if (valRes && valRes.length > 0) {
            return valRes;
        }

        this.createTable();
        this.updateDataPreview();
        return valRes;
    }

    CSVParsePreview.prototype.updateCSVOptions = function (newParseOptions) {
        this.config.CSVParseOptions = newParseOptions;
        this.parseCSV();
        this.createTable();
        this.updateDataPreview();
    }

    CSVParsePreview.prototype.parseCSV = function () {
        this.arrData = null;
        this.arrDataTypes = [];
        if (!this.txt)
            return;
        var pOptions = {
            fSep: this.config.CSVParseOptions.fSep,
            trim: this.config.CSVParseOptions.trim
        };

        this.arrData = this.toArr.toArray(this.txt, pOptions);

        if (this.arrData && this.arrData.length > 0)
            for (var i = 0; i < this.arrData[0].length; i++) {
                this.arrData[0][i] = this.arrData[0][i].replace(/\s/g, '');//Remove spaces from the columnIDs
                this.arrDataTypes[i] = "text";//Init the datatypes array
            }

        for (i = this.arrData.length - 1; i >= 0; i--)
            if (this.arrData[i] == "")
                this.arrData.splice(i, 1);
    }

    CSVParsePreview.prototype.createTable = function () {
        if (!this.arrData) {
            this.$prevArea.html("");
            return;
        }

        var csvTbl = '<table id="tblDataParsePreview">';
        if (this.arrData.length > 0) {
            csvTbl += createTableHeaderRow(this.arrData[0], true);
            csvTbl += createTHIsNumber(this.arrData[0], this.arrDataTypes);
        }
        csvTbl += "</table>";
        this.$prevArea.html(csvTbl);

        //Attach the Number checkbox event
        if (this.arrData.length > 0) {
            for (i = 0 ; i < this.arrData[0].length; i++)
                this.numberCHKChange(this.$prevArea, i);
        }
    }

    CSVParsePreview.prototype.updateDataPreview = function () {
        var $tbl = this.$container.find('#tblDataParsePreview');
        var rows = $tbl.find("tr");
        for (var i = 2; i < rows.length; i++)
            rows[i].remove();
        if (!this.arrData)
            return;

        var upTo = this.config.maxLinesToShow + 1; //+1 to excude the header
        if (this.arrData.length < upTo)
            upTo = this.arrData.length;
        for (i = 1; i < upTo; i++) {
            var newRow = createTableRow(this.arrData[i], this.config.CSVParseOptions, this.arrDataTypes);
            $tbl.append(newRow);
        }
    }

    var createTHIsNumber = function (headerRow, dataTypes) {
        var toRet = "<tr>";
        var chk;
        for (var i = 0; i < headerRow.length; i++) {
            chk = false;
            if (dataTypes[i] == "num")
                chk = true;
            toRet += "<th>" + "Number " + createChk(i, chk) + "</th>";
        }
        toRet += "</tr>";
        return toRet;
    }
    var createChk = function (pos, checked) {
        if (checked)
            return '<input id="' + 'chkNumber_' + pos + '" type="checkbox" checked ="' + checked + '" />';
        else
            return '<input id="' + 'chkNumber_' + pos + '" type="checkbox" />';
    }
    CSVParsePreview.prototype.numberCHKChange = function ($cnt, pos) {
        var me = this;
        $cnt.find("#chkNumber_" + pos).change(function (e) {
            if (this.checked)
                me.arrDataTypes[pos] = "num";
            else
                me.arrDataTypes[pos] = "text";
            me.updateDataPreview();
        })
    }

    var createTableHeaderRow = function (row) {
        var toRet = "<tr>";
        for (var i = 0; i < row.length; i++)
            toRet += '<th>' + row[i] + '</th>';
        toRet += "</tr>";
        return toRet;
    }

    var createTableRow = function (row, options, dataTypes) {
        var toRet = "<tr>";
        for (var i = 0; i < row.length; i++)
            toRet += '<td>' + parseVal(row[i], options, dataTypes[i]) + '</td>';
        toRet += "</tr>";
        return toRet;
    }

    var parseVal = function (val, options, dataType) {
        var toRet = val;
        if (!dataType)
            return toRet;
        if (dataType == 'num') {
            if (options.decimalSep) {
                var re = new RegExp(fixRegExp(options.decimalSep), 'g');
                toRet = toRet.replace(re, '.');
            }
            if (options.thousandsSep) {
                var re = new RegExp(fixRegExp(options.thousandsSep), 'g');
                toRet = toRet.replace(re, '');
            }
        }
        return toRet;
    }

    fixRegExp = function (str) {
        return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    }


    CSVParsePreview.prototype.parseOptionsToInterface = function () {
        this.$container.find('#txtSeparator').val(this.config.CSVParseOptions.fSep);

        switch (this.config.CSVParseOptions.decimalSep) {
            case ".":
                this.$container.find('#decDot').prop("checked", true);
                break;
            case ",":
                this.$container.find('#decComma').prop("checked", true);
                break;
        }
        switch (this.config.CSVParseOptions.thousandsSep) {

            case "":
                this.$container.find('#thoNo').prop("checked", true);
                break;
            case ".":
                this.$container.find('#thoDot').prop("checked", true);
                break;
            case ",":
                this.$container.find('#thoComma').prop("checked", true);
                break;
        }
        //this.$container.find('#chkTrim').prop('checked', this.config.CSVParseOptions.trim);
    }
    CSVParsePreview.prototype.parseOptionsFromInterface = function () {
        var toRet = {}
        toRet.fSep = this.$container.find('#txtSeparator').val();
        //toRet.quot = this.$container.find('#txtQuote').val();
        toRet.decimalSep = this.$container.find("input[type='radio'][name='decSep']:checked").val();
        toRet.thousandsSep = this.$container.find("input[type='radio'][name='thoSep']:checked").val();
        //toRet.trim = this.$container.find('#chkTrim').prop('checked');
        return toRet;
    }

    CSVParsePreview.prototype.addEvents = function () {
        var me = this;
        this.$txtSeparator.on('keyup', function (e) {
            if (me.on1CharKeyUp(e, me.$txtSeparator)) {
                me.config.CSVParseOptions = me.parseOptionsFromInterface();
                me.parseCSV();
                me.createTable();
                me.updateDataPreview();
            }
        });
        this.$container.find('#decDot').on('change',function () { me.parseAndUpdate(); });
        this.$container.find('#decComma').on('change', function () { me.parseAndUpdate(); });
        this.$container.find('#thoNo').on('change', function () { me.parseAndUpdate(); });
        this.$container.find('#thoComma').on('change', function () { me.parseAndUpdate(); });
        this.$container.find('#thoDot').on('change', function () { me.parseAndUpdate(); });
    }

    CSVParsePreview.prototype.destroy = function () {
        this.$txtSeparator.off('keyup');
        this.$container.find('#decDot').off('change');
        this.$container.find('#decComma').off('change');
        this.$container.find('#thoNo').off('change');
        this.$container.find('#thoComma').off('change');
        this.$container.find('#thoDot').off('change');
    }

    CSVParsePreview.prototype.parseAndUpdate = function () {
        this.config.CSVParseOptions = this.parseOptionsFromInterface();
        this.updateDataPreview();
    }

    CSVParsePreview.prototype.on1CharKeyUp = function (evt, $src) {
        if ($.inArray(evt.keyCode, keyCodesIgnore) != -1)
            return false;
        var len = $src.val().length;
        if (len > 1)
            $src.val($src.val().substring(len - 1, len));
        return true;
    }

    CSVParsePreview.prototype.getData = function () {
        if (!this.txt)
            return null;
        var toRet = [];
        if (!this.arrData)
            return toRet;
        if (this.arrData.length == 0)
            return toRet;
        if (this.arrData.length > 1)
            for (var i = 1; i < this.arrData.length; i++)
                toRet[i - 1] = doDataRow(this.arrData[i], this.config.CSVParseOptions, this.arrDataTypes);
        return toRet;
    }
    var doDataRow = function (row, CSVParseOptions, arrDataTypes) {
        if (!row)
            return null;
        var toRet = [];
        for (var i = 0; i < row.length; i++)
            toRet[i] = parseVal(row[i], CSVParseOptions, arrDataTypes[i]);
        return toRet;
    }
    CSVParsePreview.prototype.getHeaderRow = function () {
        if (!this.txt)
            return null;
        if (this.arrData && this.arrData.length > 0)
            return this.arrData[0];
        return null;
    }
    CSVParsePreview.prototype.getDataTypes = function () {
        return this.arrDataTypes;
    }

    //Validation
    CSVParsePreview.prototype.validate = function () {
        var val = new CSVParseValidator();
        var valRes = val.validate(this.getHeaderRow(), this.getData(), this.arrDataTypes);

        return valRes;
    }
    return CSVParsePreview;
});