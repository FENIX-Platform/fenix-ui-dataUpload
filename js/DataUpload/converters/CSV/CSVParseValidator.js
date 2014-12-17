define([
'jquery'
],
function ($) {
    var ERR_NO_DATA = "noData";
    var ERR_NO_DATA = "noData";
    var ERR_DATA_COLUMNS_COUNT = "wrongDataColumnsCount";
    var ERR_IS_NOT_A_NUMBER = "isNotANumber";

    function CSVParseValidator(config) { };

    CSVParseValidator.prototype.validate = function (data, dataTypes) {
        //var e={level:"E", message:"", info:""};
        if (!data)
            return [{ level: 'e', type: ERR_NO_DATA }];
        if (data.length == 0) 
            return [{ level: 'e', type: ERR_NO_DATA }];
        var toRet = [];
        //Check if header and data have the same number of columns
        var headerLen = data[0].length;
        for (var i = 1; i < data.length; i++)
            if (data[i].length != headerLen)
                toRet.push({ level: 'e', type: ERR_DATA_COLUMNS_COUNT, row: i, });
        for (i = 0; i < dataTypes.length; i++)
            if (dataTypes[i] == 'num')
                for (var r = 1; r < data.length; r++)
                    if (!$.isNumeric(data[r][i]))
                        toRet.push({ level: 'e', type: ERR_IS_NOT_A_NUMBER, row: r, });
        return toRet;
    }
    return CSVParseValidator;
});