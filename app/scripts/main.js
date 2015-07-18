var schop = (function ($) {
    "use strict";

    var currentCode;
    var firstIndex, secondIndex;

    function renderNavigation(radius, offsetX, offsetY) {
        var svg = getSvgContext();
        console.log('renderNavigation', svg);
        for (var i = 0; i < 8; i++) {
            var point1 = pointAtOffset(i, radius, offsetX, offsetY);
            for (var j = 0; j < 8; j++) {
                if (i >= j) {
                    continue;
                }
                var point2 = pointAtOffset(j, radius, offsetX, offsetY);
                var $line = renderLine(svg, point1, point2, 'line' + i + '_' + j, 'nav-line');
                var $linec = renderLine(svg, point1, point2, 'linec' + i + '_' + j, 'nav-line-clickable');
                attachClickLineListener($linec, i, j);
                attachLineHoverListener($linec, i, j);
            }
            renderTextAtVertex(svg, i, point1);
        }
    }

    function getSvgContext() {
        var $nav = $('#nav');
        $nav.svg();
        return $nav.svg('get');
    }

    function renderLine(svg, point1, point2, id, clazz) {
        return $(svg.line(point1.x, point1.y, point2.x, point2.y))
            .attr('id', id)
            .addClass(clazz);
    }

    function showSingleHeadline(text, index) {
        var subtext = index === 0 || index ? nodetexts[index].sub : '';
        $('.topic-single')
            .find('h1').html(text).end()
            .find('h2').html(subtext).end()
            .addClass('active');
        $('.topic-synthesis').removeClass('active');
    }

    function showSynthesisHeadline(i, j) {
        $('.topic-single').removeClass('active');
        $('.topic-synthesis')
            .addClass('active')
            .find('#headline1').html(getHtmlNodeText(i)).end()
            .find('#headline2').html(getHtmlNodeText(j)).end();
    }

    function renderTextAtVertex(svg, i, point) {
        var x1, x2, y1, y2;
        if (nodetexts[i].align == 'left') {
            x1 = point.x;
            x2 = point.x;
        } else if (nodetexts[i].align == 'center') {
            x1 = point.x - linewidths[i][0] / 2;
            x2 = point.x - linewidths[i][1] / 2;
        } else {
            var max = Math.max(linewidths[i][0], linewidths[i][1]);
            x1 = point.x - max + Math.max(0, linewidths[i][1] - linewidths[i][0]);
            x2 = point.x - max + Math.max(0, linewidths[i][0] - linewidths[i][1]);
        }
        x1 += nodetexts[i].offset.x;
        x2 += nodetexts[i].offset.x;
        y1 = point.y + nodetexts[i].offset.y;
        y2 = point.y + nodetexts[i].offset.y + 30;

        var svgText = svg.createText();
        svgText.span(nodetexts[i].lines[0], {x: x1, y: y1});
        svgText.span(nodetexts[i].lines[1], {x: x2, y: y2});

        var $text = $(svg.text(0, 0, svgText));
        $text.addClass('nav-text');
        $text.click(function (ev) {
            //console.log('click nav-text', ev);
            var headlineText = getHtmlNodeText(i);
            showSingleHeadline(headlineText, i);
            toggleSingleTopic(i);
            return false;
        })
    }

    function calcLineWidths() {
        var widths = [];
        for (var i = 0; i < nodetexts.length; i++) {
            var dim0 = stringDimensions(nodetexts[i].lines[0], 'nav-text');
            var dim1 = stringDimensions(nodetexts[i].lines[1], 'nav-text');
            widths.push([dim0.width, dim1.width]);
        }
        return JSON.stringify(widths);
    }

    function getHtmlNodeText(i) {
        return nodetexts[i].lines[0] + '<br>' + nodetexts[i].lines[1];
    }

    function attachClickLineListener($line, i, j) {
        $line.click(function () {
            showSynthesisHeadline(i, j);
            toggleSynthesis(i, j);
            return false;
        });
    }

    function attachLineHoverListener(line, i, j) {
        line.hover((function (i, j) {
                return function () {
                    if ($('#nav').hasClass('nav-small')) {
                        return;
                    }
                    var targetLine = $('#line' + i + '_' + j);
                    targetLine.attr('class', 'nav-line nav-line-hover');
                }
            })(i, j),
            (function (i, j) {
                return function () {
                    var targetLine = $('#line' + i + '_' + j);
                    targetLine.attr('class', 'nav-line');
                }
            })(i, j)
        );
    }

    function stringDimensions(string, clazz, element) {
        if (!element) {
            element = 'div'
        }
        var dom = $('<' + element + '>' + string + '</' + element + '>')
            .addClass(clazz)
            .css({
                'display': 'block',
                'position': 'absolute',
                'float': 'left',
                'white-space': 'nowrap',
                'visibility': 'hidden'
            })
            .appendTo($('body'));
        var dim = {'width': dom.width(), 'height': dom.height()};
        dom.remove();
        return dim;
    }

    function pointAtOffset(n, radius, offsetX, offsetY) {
        var point = pointAt(n, radius);
        return {
            "x": point.x + offsetX,
            "y": point.y + offsetY
        }
    }

    function pointAt(n, radius) {
        var diagOffset = Math.sqrt(Math.pow(radius, 2) / 2);
        switch (n) {
            case 0:
                return {"x": radius, "y": 0};
            case 1:
                return {"x": radius + diagOffset, "y": radius - diagOffset};
            case 2:
                return {"x": 2 * radius, "y": radius};
            case 3:
                return {"x": radius + diagOffset, "y": radius + diagOffset};
            case 4:
                return {"x": radius, "y": 2 * radius};
            case 5:
                return {"x": radius - diagOffset, "y": radius + diagOffset};
            case 6:
                return {"x": 0, "y": radius};
            case 7:
                return {"x": radius - diagOffset, "y": radius - diagOffset};
        }
    }

    function toggleNavigation() {
        var $nav = $('#nav');
        if ($nav.hasClass('nav-small')) {
            $('#contentpane').removeClass('active');
            resetAudioAndButtons();
        }
        $('#header').find('.title').removeClass('visible');
        $nav.removeClass('nav-small-finished');
        $nav.toggleClass('nav-small');
        $nav.children().removeClass('nav-line-hover');
        $('#nav-container').toggleClass('nav-small', $nav.hasClass('nav-small'));
    }

    function resetAudioAndButtons() {
        audio.reset();
        toggleButtonState($('#text-button'), false);
        toggleButtonState($('#music-button'), false);
        $('#info-button').removeClass('visible');
    }

    function toggleSingleTopic(i) {
        toggleNavigation();
        if ($('#nav').hasClass('nav-small')) {
            selectCode(i);
            loadContentOnly('questions', currentCode);
        }
    }

    function toggleSynthesis(i, j) {
        toggleNavigation();
        if ($('#nav').hasClass('nav-small')) {
            selectCode(i, j);
            loadContentOnly('questions', currentCode);
        }
    }

    function selectCode(i, j) {
        firstIndex = i;
        if (j != undefined) {
            secondIndex = j;
            currentCode = synthesisMapping[i + '_' + j];
        }
        else {
            secondIndex = null;
            currentCode = String.fromCharCode(65 + i);
        }
        console.log('selectCode()', i, j, '->', currentCode);
    }

    function loadContentWithTitle(title, section, code) {
        showSingleHeadline(title);
        resetAudioAndButtons();
        loadContentOnly(section, code);
        $('#buttons-center-1').removeClass('visible');
    }

    function loadContentOnly(section, code) {
        console.log('loadContentOnly', section, code);
        $('#content')
            .removeClass('musicinfo special questions')
            .addClass(section)
            .load('content/' + section + '/' + code + '.html', function (response, status) {
                if (status == 'error') {
                    console.error('content loading failed');
                    $('#content').load('content/' + section + '/A.html');
                }
            });
        if (!$('#nav').hasClass('nav-small')) {
            toggleNavigation();
        }
        $('#buttons-center-1').addClass('visible');
    }

    function toggleButtonState($button, on) {
        $button.attr('src', $button.data(on ? 'src-on' : 'src-off'));
    }

    function init() {
        audio.init();

        $('#nav').click(function (ev) {
            if ($('#nav').hasClass('nav-small')) {
                toggleNavigation();
            }
        });
        $('#nav-container').on('webkitTransitionEnd transitionend', function (ev) {
            if (ev.originalEvent.propertyName == 'height') {
                console.log('transitionEnd', ev.originalEvent.propertyName);
                if ($('#nav').hasClass('nav-small')) {
                    $('#contentpane').addClass('active');
                    $('#nav').addClass('nav-small-finished');
                    $('#header').find('.title').addClass('down');
                } else {
                    $('#header').find('.title').removeClass('down');
                }
                $('#header').find('.title').addClass('visible');
            }
        });

        $('#text-button').click(function () {
            console.log('text-button', firstIndex, secondIndex);
            toggleButtonState($(this), true);
            toggleButtonState($('#music-button'), false);
            $('#info-button').removeClass('visible');
            loadContentOnly('questions', currentCode);
            var title = nodetexts[firstIndex].complete;
            if (secondIndex != null) {
                title += ' / ' + nodetexts[secondIndex].complete;
            }
            audio.loadPlaylist(speakerPlaylists[currentCode] ? speakerPlaylists[currentCode] : speakerPlaylists['A'], title);
        });

        $('#music-button').click(function () {
            console.log('music-button');
            toggleButtonState($(this), true);
            toggleButtonState($('#text-button'), false);
            loadContentOnly('questions', currentCode);
            $('#info-button').addClass('visible');
            audio.loadPlaylist(musicPlaylists[currentCode] ? musicPlaylists[currentCode] : musicPlaylists['A']);
        });

        $('#info-button').click(function (ev) {
            console.log('info-button', ev);
            loadContentOnly('musicinfo', currentCode);
        });

        $.ajaxSetup({
            // Disable caching of AJAX responses
            cache: false
        });
    }

    return {
        'init': init,
        'render': renderNavigation,
        'calcLineWidths': calcLineWidths,
        'load': loadContentWithTitle
    };
})(jQuery);

jQuery(document).ready(function () {
    var radius = 450;
    var offsetX = 350;
    var offsetY = 50;
    schop.init();
    schop.render(radius, offsetX, offsetY);
});

var nodetexts = [
    {complete: 'Der Satz vom Grunde', lines: ['Der Satz vom', 'Grunde'], align: 'center', offset: {x: 0, y: -60}, sub: 'Kausalitätsgesetze'},
    {complete: 'Die Welt als Vorstellung', lines: ['Die Welt als', 'Vorstellung'], align: 'left', offset: {x: 30, y: 0}, sub: 'Erkenntnis- & Wissenstheorie'},
    {complete: 'Die Welt als Wille', lines: ['Die Welt als', 'Wille'], align: 'left', offset: {x: 30, y: 0}, sub: 'Metaphysik'},
    {complete: 'Metaphysik des Schönen', lines: ['Metaphysik', 'des Schönen'], align: 'left', offset: {x: 30, y: 0}, sub: 'Ästhetik'},
    {complete: 'Bejahung & Verneinung', lines: ['Bejahung &', 'Verneinung'], align: 'center', offset: {x: 0, y: 60}, sub: 'Ethik'},
    {complete: 'Schlechte & gute Musik', lines: ['Schlechte &', 'gute Musik'], align: 'right', offset: {x: -30, y: 0}, sub: 'Musikwertung'},
    {complete: 'Entzweiung & Versöhnung', lines: ['Entzweiung &', 'Versöhnung'], align: 'right', offset: {x: -30, y: 0}, sub: 'Musiktheorie'},
    {complete: 'Klassische & populäre Musik', lines: ['Klassische &', 'populäre Musik'], align: 'right', offset: {x: -30, y: 0}, sub: 'Musiktrivia'}
];

var linewidths = [[227, 120], [209, 220], [209, 93], [195, 213], [188, 199], [231, 200], [247, 219], [238, 284]];

var synthesisMapping = {
    '0_1': '1',
    '0_2': '2',
    '0_3': '3',
    '0_4': '4',
    '0_5': '5',
    '0_6': '6',
    '0_7': '7',
    '1_2': '8',
    '1_3': '9',
    '1_4': '10',
    '1_5': '11',
    '1_6': '12',
    '1_7': '13',
    '2_3': '14',
    '2_4': '15',
    '2_5': '16',
    '2_6': '17',
    '2_7': '18',
    '3_4': '19',
    '3_5': '20',
    '3_6': '21',
    '3_7': '22',
    '4_5': '23',
    '4_6': '24',
    '4_7': '25',
    '5_6': '26',
    '5_7': '27',
    '6_7': '28'
};
