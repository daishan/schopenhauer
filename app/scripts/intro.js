var intro = (function ($) {
    "use strict";

    var $body, $nav, $audio, audio, $startButton, $info, $skipButton;

    function init() {
        console.log('intro.init()');

        $body = $('body');
        $nav = $('#nav');
        $audio = $('#intro-music');
        audio = $audio.get(0);
        $startButton = $('.start-button');
        $info = $('.intro-info');
        $skipButton = $('.skip-button');

        $audio.on('playing', function () {
            console.log('intro.audio.playing', time());
            $body.addClass('playing');
        });

        $body.click(start);
        $startButton.click(end);
        $skipButton.click(end);
    }

    function start() {
        console.log('intro.start()', time());
        $info.removeClass('visible');
        $body.removeClass('playing');

        // readd $nav to dom to trigger reflow (or whatever), otherwise the animation won't restart
        //$nav.appendTo($nav.parent());

        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
        audio.play();

        $body.off('click', start);
        return false;
    }

    function end() {
        console.log('intro.end()');
        $body.removeClass('intro').removeClass('playing');
        audio.pause();
        return false;
    }

    function time() {
        var t = new Date();
        return t.getSeconds() + (t.getMilliseconds() / 1000.);
    }

    $(document).ready(init);
    return {};
})(jQuery);
