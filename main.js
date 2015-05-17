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
            renderTextAtVertex(svg, i, point1, radius, offsetX, offsetY);
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

    function renderTextAtVertex(svg, i, point, radius, offsetX, offsetY) {
        var text = nodetexts[i];
        var dim = stringDimensions(text, 'nav-text');
        var signX = sign(point.x - offsetX - radius);
        var signY = sign(point.y - offsetY - radius);
        var x = point.x - dim.width / 2 + (signX * (dim.width / 2 + 10));
        var y = point.y + dim.height / 2 + (signY * dim.height);
        if (i == 5) {
            x -= 10;
        }
        var $text = $(svg.text(x, y, text));
        $text.addClass('nav-text');
        $text.click(function (ev) {
            //console.log('click nav-text', ev);
            $('#singleheadline')
                .text(text)
                .css('display', 'inline-block');
            $('#doubleheadline')
                .css('display', 'none');
            openSingleTopic(i);
            return false;
        })
    }

    function attachClickLineListener($line, i, j) {
        $line.click(function () {
            $('#singleheadline').css('display', 'none');
            $('#doubleheadline').css('display', 'inline-block');
            $('#headline1').text(nodetexts[i]);
            $('#headline2').text(nodetexts[j]);
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
        $('#nav-container').toggleClass('nav-small', $nav.hasClass('nav-small'));
    }

    function openSingleTopic(i) {
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
        $('#nav')
            .click(function (ev) {
                //console.log('click nav', ev);
                if ($('#nav').hasClass('nav-small')) {
                    toggleNavigation();
                }
            }).on('webkitTransitionEnd', function (ev) {
                //console.log('webkitTransitionEnd', ev);
                if ($('#nav').hasClass('nav-small')) {
                    $('#contentpane').css('display', 'block');
                    $('#nav').addClass('nav-small-finished');
                }
            });
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
        "render": renderNavigation
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
    'Der Satz vom Grunde',
    'Die Welt als Vorstellung',
    'Die Welt als Wille',
    'Metaphysik des Schönen',
    'Bejahung & Verneinung',
    'Schlechte & gute Musik',
    'Entzweihung & Versöhnung',
    'Klassische & populäre Musik'
];