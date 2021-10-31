(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "email",
            alias: "magnitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "first_name",
            alias: "title",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "last_name",
            dataType: tableau.dataTypeEnum.geometry
        }];

        var tableSchema = {
            id: "earthquakeFeed",
            alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://reqres.in/api/users?page=2",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            // set the request header authorization to the bearer token that is generated
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            success: function(result) {
                console.log("bhai")
                console.log(result);
                feat = result.data
                tableData = [];
                tableau.log(feat)

                // Iterate over the JSON object
                for (var i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "id": feat[i].id,
                        "email": feat[i].email,
                        "first_name": feat[i].first_name,
                        "last_name": feat[i].last_name
                    });
                }
                table.appendRows(tableData);
                doneCallback();
            },
            error: function(error) {
                console.log(`Error ${error}`)
            },
        });

    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();