var plusmenu = (function ($, schop) {
    "use strict";

    var $menuButtons = $('#menu-buttons');

    function init() {
        console.log('plusmenu.init()');
        $('#plus-button')
            .click(function () {
                console.log('#plus-button click');
                $menuButtons.find('.button').toggleClass('active');
            });

        $('#impressum-button').click(function () {
            schop.load("Impressum", 'special', 'impressum');
            close();
        });

        $('#links-button').click(function () {
            schop.load('Weiterführend', 'special', 'sources');
            close();
        });

        $('#pdf-button').click(function () {
            close();
        });

        $('#help-button').click(function () {
            help.activate(close);
        });
    }

    function close() {
        console.log('plusmenu.close()');
        $menuButtons.find('.button').removeClass('active');
    }

    return {
        init: init
    }

})(jQuery, schop);

$(document).ready(plusmenu.init);
