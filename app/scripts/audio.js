var audio = (function ($) {
    var stopCallback;

    function init(onStop) {
        console.log('audio.init()');
        $('audio')
            .on('timeupdate', function (ev) {
                //console.log('timeupdate', ev, this);
                updateSeekBar(this.currentTime / this.duration);
            })
            .on('ended', function (ev) {
                console.log('ended', ev, this);
                stopCallback();
            });
        stopCallback = onStop;
    }

    function play() {
        var audioElement = $('audio').get(0);
        if (audioElement.paused) {
            audioElement.play();
            return true;
        } else {
            audioElement.pause();
            return false;
        }
    }

    function updateSeekBar(played) {
        var width = 200;
        var pos = played * width;
        $('.seekbar-marker')
            .attr('x1', pos)
            .attr('x2', pos);
    }

    function select() {

    }

    return {
        init: init,
        select: select,
        play: play
    };
})(jQuery);
