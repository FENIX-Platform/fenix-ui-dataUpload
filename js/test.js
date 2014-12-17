require([
    './paths'
], function (DataUpload) {
    // NOTE: This setTimeout() call is used because, for whatever reason, if you make
    // a 'require' call in here or in the Cart without it, it will just hang
    // and never actually go fetch the files in the browser. There's probably a
    // better way to handle this, but I don't know what it is.
    setTimeout(function () {
        /*
         @param: prefix of Components paths to reference them also in absolute mode
         @param: paths to override
         @param: callback function
         */
        DataUpload.initialize('./', null, function () {
            require([
                'fx-DataUpload/start'
            ], function (DataUpload) {
                var config = {};
                var callB = null;
                DataUpload.init("#divDataUpload", config, callB);

                //$("#divDataUpload").on("csvUploaded.DataUpload.fenix", function (evt, data) { console.log(data); });


                $('#btnGetData').click(function () {
                    console.log(DataUpload.getData());
                });
                $('#btnGetDataTypes').click(function () {
                    console.log(DataUpload.getDSD());
                });
            });
        });
    }, 0);
});