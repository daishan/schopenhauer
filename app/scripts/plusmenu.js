var plusmenu = (function ($, schop) {
    "use strict";

    var $menuButtons = $('#menu-buttons');

    function init() {
        console.log('plusmenu.init()');
        $('#plus-button').click(open);

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

    function open() {
        console.log('#plus-button click');
        if (schop.isSpecialPage()) {
            $('#help-button').hide();
        } else {
            $('#help-button').show();
        }
        $menuButtons.find('.button').toggleClass('active');
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
