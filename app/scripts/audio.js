var audio = (function ($) {
    "use strict";

    var stopCallback;
    var currentPlaylist;
    var titleOverride;

    function init(onStop) {
        console.log('audio.init()');
        $('audio')
            .on('timeupdate', function (ev) {
                //console.log('timeupdate', ev, this);
                updateSeekBar(this.currentTime / this.duration);
            })
            .on('ended', function (ev) {
                console.log('ended', ev, this);
                //stopCallback();
                toggleButtonState($('#play-button'), false);
            });

        $('#play-button').click(function () {
            toggleButtonState($('#play-button'), play());
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

    function loadPlaylist(playlist, titleOverrideParam) {
        //console.log('loadPlaylist()', playlist);
        titleOverride = titleOverrideParam;
        currentPlaylist = playlist;
        renderPlaylist();
        $('.part-of-audio').show();
    }

    function renderPlaylist() {
        var $list = $('#playlist').html('');
        $.each(currentPlaylist, function (i, entry) {
            //console.log(i, entry, entry.title, entry.file, entry.length);
            $('<li><span class="trackname"></span><span class="tracklength"></span></li>')
                .find('.trackname').text(titleOverride ? titleOverride : entry.title).end()
                .find('.tracklength').text(entry.length).end()
                .click(function () {
                    selectEntry.call(this, entry);
                })
                .appendTo($list);
        });
        selectEntry.call($list.find(':first-child'), currentPlaylist[0]);
    }

    function selectEntry(entry) {
        console.log('song selected', entry);
        $('audio').attr('src', 'content/' + entry.file);
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        updateSeekBar(0);
        toggleButtonState($('#play-button'), false);
        stop();
    }

    function stop() {
        $('audio').get(0).pause();
    }

    function reset() {
        stop();
        $('.part-of-audio').hide();
    }

    function toggleButtonState($button, on) {
        $button.attr('src', $button.data(on ? 'src-on' : 'src-off'));
    }

    return {
        init: init,
        play: play,
        reset: reset,
        loadPlaylist: loadPlaylist
    };
})(jQuery);
