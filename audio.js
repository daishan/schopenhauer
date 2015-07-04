var audio = (function ($) {
    function init() {
        $('audio').on('timeupdate', function (ev) {
            console.log('timeupdate', ev, this);
            updateSeekBar(this.currentTime / this.duration);
        });
    }

    function play() {
        var audioElement = $('audio').get(0);
        if (audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.pause();
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
