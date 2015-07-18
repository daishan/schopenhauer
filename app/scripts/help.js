var help = (function ($) {
    "use strict";

    $(document).ready(init);
    function init() {
        $('#help-overlay').click(deactivate);
    }

    function activate() {
        console.log('help.activate()');
        $('body').addClass('help-mode');
        $('.help-' + schop.getPage() + '-page').addClass('visible');
        if (schop.isMusicSelected()) {
            $('.help-music-info').addClass('visible');
        }
        $('#help-overlay').show();
    }

    function deactivate() {
        console.log('help.deactivate()');
        $('.help-element').removeClass('visible');
        $('body').removeClass('help-mode');
        $('#help-overlay').hide();
    }

    return {
        init: init,
        activate: activate
    }
})(jQuery);
