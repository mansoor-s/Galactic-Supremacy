(function() {
    "use strict";
    /*
        Function: Network
            Constructor for Network object. Abstracts all network IO operations
    */
    var Network = App.Network = function() {
        
    };

    /*
        Function: get
            Make a GET request on the givne URL

        Parameters:

            url - {String} URL to make request on
            data - {String|Object} A string or map to be sent with the request
            fn - {Function} Callback function to call after completion. Should take two parameters. error and data
            dataType - {String} Type of data expected from the server (XML, JSON, HTML, Script). (Optional)
    */
    Network.prototype.get = function(url, data, fn, dataType) {
        $.ajax({
            url: url,
            data: data,
            success: function(data) {
                fn(false, data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                fn(textStatus);
            }
        });
    };


    /*
        Function: post
            Make a POST request on the givne URL

        Parameters:

            url - {String} URL to make request on
            data - {String|Object} A string or map to be sent with the request
            fn - {Function} Callback function to call after completion. Should take two parameters. error and data
            dataType - {String} Type of data expected from the server (XML, JSON, HTML, Script). (Optional)
    */
    Network.prototype.post = function() {
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function(data) {
                fn(false, data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                fn(textStatus);
            }
        });
    };

    /*
        Alias for jQuery.ajax

        **props are the same settings as passed to jQuery.ajax()
        http://api.jquery.com/jQuery.ajax/
    */
    Network.prototype.ajax = function(props) {
        $.ajax(props);
    };

})();