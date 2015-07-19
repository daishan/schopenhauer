var audio = (function ($) {
    "use strict";

    var currentPlaylist;
    var titleOverride;

    var audioElement = $('#player').find('> audio').get(0);

    function init() {
        console.log('audio.init()');
        $(audioElement)
            .on('timeupdate', function (ev) {
                console.log('timeupdate', this.currentTime);
                updateSeekBar(this.currentTime / this.duration);
            })
            .on('ended', function (ev) {
                console.log('ended', ev, this);
                toggleButtonState($('#play-button'), false);
            });

        $('#play-button').click(function () {
            toggleButtonState($('#play-button'), play());
        });

        $('#seekbar').click(function (e) {
            var seekFraction = (e.pageX - $(this).offset().left) / $(this).width();
            var seekPos = seekFraction * audioElement.duration;
            console.log('seek', seekFraction, seekPos);
            audioElement.currentTime = seekPos;
        });
    }

    function play() {
        toggleButtonState($('#play-button'), true);
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
        if (isNaN(pos)) {
            pos = 0;
        }
        $('.seekbar-marker')
            .attr('x1', pos)
            .attr('x2', pos);
    }

    function loadPlaylist(playlist, titleOverrideParam) {
        //console.log('loadPlaylist()', playlist);
        titleOverride = titleOverrideParam;
        currentPlaylist = playlist;
        renderPlaylist();
        $('.part-of-audio').css('visibility', 'visible');
    }

    function renderPlaylist() {
        var $list = $('#playlist').html('');
        $.each(currentPlaylist, function (i, entry) {
            //console.log(i, entry, entry.title, entry.file, entry.length);
            $('<li><span class="trackname"></span> - <span class="tracklength"></span></li>')
                .find('.trackname').text(titleOverride ? titleOverride : entry.title).end()
                .find('.tracklength').text(entry.length).end()
                .click(function () {
                    selectEntry.call(this, entry);
                    play();
                })
                .appendTo($list);
        });
        selectEntry.call($list.find(':first-child'), currentPlaylist[0]);
    }

    function selectEntry(entry) {
        console.log('song selected', entry);
        $(audioElement).attr('src', 'content/' + entry.file);
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        updateSeekBar(0);
        toggleButtonState($('#play-button'), false);
        stop();
    }

    function stop() {
        audioElement.pause();
    }

    function reset() {
        stop();
        $('.part-of-audio').css('visibility', 'hidden');
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
