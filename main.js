var schop = (function ($) {
    function renderNavigation(radius, offsetX, offsetY) {
        var svg = getSvgContext();
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
            $('#singleheadline')
                .html(getHtmlNodeText(i))
                .css('display', 'inline-block');
            $('#doubleheadline')
                .css('display', 'none');
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
            $('#singleheadline').css('display', 'none');
            $('#doubleheadline').css('display', 'inline-block');
            $('#headline1').html(getHtmlNodeText(i));
            $('#headline2').html(getHtmlNodeText(j));
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
                    targetLine[0].className = 'nav-line nav-line-hover';
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
            $('#contentpane').css('display', 'none');
        }
        $nav.removeClass('nav-small-finished');
        $nav.toggleClass('nav-small');
        $nav.children().removeClass('nav-line-hover');
        $('#nav-container').toggleClass('nav-small', $nav.hasClass('nav-small'));
    }

    function toggleSingleTopic(i) {
        if (!$('#nav').hasClass('nav-small')) {
            var code = String.fromCharCode(65 + i);
            $('#content').load('content/' + code + '.html', function (response, status) {
                if (status == 'error') {
                    $('#content').load('content/fallback.html');
                }
            });
        }
        toggleNavigation();
    }

    function toggleSynthesis(i, j) {
        if (!$('#nav').hasClass('nav-small')) {
            var code = i * 8 + j;
            $('#content').load('content/' + code + '.html', function (response, status) {
                if (status == 'error') {
                    $('#content').load('content/fallback.html');
                }
            });
        }
        toggleNavigation();
    }

    function init() {
        $('#nav').click(function (ev) {
            //console.log('click nav', ev);
            if ($('#nav').hasClass('nav-small')) {
                toggleNavigation();
            }
        });
        $('#nav-container').on('webkitTransitionEnd transitionend', function (ev) {
            //console.log('transitionEnd', ev.originalEvent.propertyName);
            if (ev.originalEvent.propertyName == 'height' && $('#nav').hasClass('nav-small')) {
                $('#contentpane').css('display', 'block');
                $('#nav').addClass('nav-small-finished');
            }
        });

        $('#text-button').click(function (ev) {
            console.log('text-button', ev);
            showTextSection('.questions');
            $('#controls-right').find('.button').hide();
            if ($('#content').find('.infotext').length) {
                $('#text-info-button').show();
            }
        });

        $('#music-button').click(function (ev) {
            console.log('music-button', ev);
            showTextSection('.questions');
            $('#controls-right').find('.button').hide();
            if ($('#content').find('.musicinfo').length) {
                $('#music-info-button').show();
            }
        });

        $('#text-info-button').click(function () {
            showTextSection('.infotext');
        });

        $('#music-info-button').click(function () {
            showTextSection('.musicinfo');
        });

        $.ajaxSetup({
            // Disable caching of AJAX responses
            cache: false
        });
    }

    function showTextSection(selector) {
        $('#content')
            .children()
            .hide()
            .end()
            .find(selector)
            .show();
    }

    function sign(x) {
        if (x > 0) {
            return 1;
        } else if (x < 0) {
            return -1;
        } else {
            return 0;
        }
    }

    return {
        'init': init,
        'render': renderNavigation,
        'calcLineWidths': calcLineWidths
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
    {complete: 'Der Satz vom Grunde', lines: ['Der Satz vom', 'Grunde'], align: 'center', offset: {x: 0, y: -60}},
    {complete: 'Die Welt als Vorstellung', lines: ['Die Welt als', 'Vorstellung'], align: 'left', offset: {x: 30, y: 0}},
    {complete: 'Die Welt als Wille', lines: ['Die Welt als', 'Wille'], align: 'left', offset: {x: 30, y: 0}},
    {complete: 'Metaphysik des Schönen', lines: ['Metaphysik', 'des Schönen'], align: 'left', offset: {x: 30, y: 0}},
    {complete: 'Bejahung & Verneinung', lines: ['Bejahung &', 'Verneinung'], align: 'center', offset: {x: 0, y: 60}},
    {complete: 'Schlechte & gute Musik', lines: ['Schlechte &', 'gute Musik'], align: 'right', offset: {x: -30, y: 0}},
    {complete: 'Entzweihung & Versöhnung', lines: ['Entzweihung &', 'Versöhnung'], align: 'right', offset: {x: -30, y: 0}},
    {complete: 'Klassische & populäre Musik', lines: ['Klassische &', 'populäre Musik'], align: 'right', offset: {x: -30, y: 0}}
];

var linewidths = [[227, 126], [209, 220], [209, 93], [195, 213], [192, 199], [209, 185], [253, 209], [218, 264]];