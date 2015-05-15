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
                renderLine(svg, point1, point2, 'line' + i + '_' + j, 'nav-line');
                renderLine(svg, point1, point2, 'linec' + i + '_' + j, 'nav-line-clickable');
            }
            renderTextAtVertex(svg, i, point1, radius, offsetX, offsetY);
        }
        attachEventListeners();
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
        var signX = Math.sign(point.x - offsetX - radius);
        var signY = Math.sign(point.y - offsetY - radius);
        var x = point.x - dim.width / 2 - (signX * -1 * dim.width / 2);
        var y = point.y - (signY * -1 * dim.height / 2);
        var $text = $(svg.text(x, y, text));
        $text.addClass('nav-text');
    }

    function attachEventListeners() {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (i >= j) {
                    continue;
                }
                var line = $('#linec' + i + '_' + j);
                console.log('found', line);
                line.hover((function (i, j) {
                        return function () {
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
        }
    }

    function pointAtOffset(n, radius, offsetX, offsetY) {
        var point = pointAt(n, radius);
        return {
            "x": point.x + offsetX,
            "y": point.y + offsetY
        }
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

    function init() {
        $('body').click(function (ev) {
            console.log('click', ev);
            var $nav = $('#nav');
            if ($nav.attr('class') == 'nav') {
                $nav.attr('class', 'nav nav-small');
            } else {
                $nav.attr('class', 'nav');
            }
        });
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
    'SATZ VOM GRUNDE',
    'DIE WELT ALS WILLE',
    'DIE WELT ALS VORSTELLUNG',
    'METAPHYSIK DES SCHÖNEN',
    'BEJAHUNG & VERNEINUNG',
    'SCHLECHTE & GUTE MUSIK',
    'ENTZWEIUNG & VERSÖHNUNG',
    'KLASSISCHE & POPULÄRE MUSIK'
];