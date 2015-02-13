define([
'jquery'
],
function ($) {
    var ERR_NO_DATA = "noData";
    var ERR_NO_DATA = "noData";
    var ERR_DUPLICATE_COLUMN_IDS = "duplicateIDs";
    var ERR_DATA_COLUMNS_COUNT = "wrongDataColumnsCount";
    var ERR_IS_NOT_A_NUMBER = "isNotANumber";

    function CSVParseValidator(config) { };

    CSVParseValidator.prototype.validate = function (header, data, dataTypes) {
        //var e={level:"E", message:"", info:""};
        if (!header || header.length == 0)
            return [{ level: 'e', type: ERR_NO_DATA }];

        var toRet = [];
        if (hasDuplicates(header))
            toRet.push({ level: 'e', type: ERR_DUPLICATE_COLUMN_IDS });
        //Check if header and data have the same number of columns
        var headerLen = header.length;

        for (var i = 0; i < data.length; i++)
            if (data[i].length != headerLen)
                toRet.push({ level: 'e', type: ERR_DATA_COLUMNS_COUNT, row: i });
        for (i = 0; i < dataTypes.length; i++)
            if (dataTypes[i] == 'num')
                for (var r = 1; r < data.length; r++)
                    if (!$.isNumeric(data[r][i]))
                        toRet.push({ level: 'e', type: ERR_IS_NOT_A_NUMBER, row: r });
        if (toRet.length == 0)
            return null;
        return toRet;
    }

    var hasDuplicates = function (arr) {
        if (arr.length < 2)
            return false;
        for (var i = 0; i < arr.length - 1; i++)
            for (var j = i + 1; j < arr.length; j++)
                if (arr[i] == arr[j])
                    return true;
    }

    return CSVParseValidator;
});