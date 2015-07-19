var intro = (function ($) {
    "use strict";

    var $body, $nav, $audio, audio, $startButton, $info, $skipButton, $overlay;

    function init() {
        $body = $('body');
        $nav = $('#nav');
        $audio = $('#intro-music');
        audio = $audio.get(0);
        $startButton = $('.start-button');
        $info = $('.intro-info');
        $skipButton = $('.skip-button');
        $overlay = $('#intro-overlay');
        console.log('intro.init()', $overlay, $nav);

        $audio.on('playing', function () {
            console.log('intro.audio.playing', time());
            $body.addClass('playing');
        });

        $overlay.click(start);
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

        if (audio.readyState == 0) {
            console.error('intro.audio.readyState == 0', audio);
            console.info('intro audio broken, skipping intro...');
            end();
        }
        audio.play();
        setTimeout(function () {
            if (audio.error) {
                console.error('intro.audio.error', audio.error, audio);
                console.info('intro audio broken, skipping intro...');
                end();
            } else {
                console.log(audio.error, audio);
            }
        }, 100);

        $overlay.off('click', start);
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
