var plusmenu = (function ($, schop) {
    "use strict";

    function init() {
        console.log('plusmenu.init()');
        $('#plus-button')
            .on('click', function () {
                console.log('#plus-button click');
                $('#menu-buttons').find('.button').toggleClass('active');
            });

        $('#impressum-button').click(function () {
            schop.load("Impressum", 'special', 'impressum');
            $('#menu-buttons').find('.button').removeClass('active');
        });

        $('#links-button').click(function () {
            schop.load('Quellen', 'special', 'sources');
            $('#menu-buttons').find('.button').removeClass('active');
        })
    }

    return {
        init: init
    }

})(jQuery, schop);

$(document).ready(plusmenu.init);
