var schop = (function ($) {
    function renderOctagon(radius, offsetX, offsetY) {
        $('#nav').html('');
        for (var i = 0; i < 8; i++) {
            var point1 = pointAtOffset(i, radius, offsetX, offsetY);
            for (var j = 0; j < 8; j++) {
                if (i >= j) {
                    continue;
                }
                var point2 = pointAtOffset(j, radius, offsetX, offsetY);
                var line = renderLine(point1, point2, 'nav-line');
                var lineClickable = renderLine(point1, point2, 'nav-line-clickable');
                lineClickable
                    .hover(function () {
                        console.log('over');
                        line.attr('class', 'nav-line nav-line-hover');
                    },
                    function () {
                        console.log('out');
                        line.attr('class', 'nav-line');
                    });
                lineClickable.click(console.log);
            }
            var dim = stringDimensions('Lorem Ipsum', 'nav-text');
            //console.log('dimensions', dim);
            var signX = Math.sign(point1.x - offsetX - radius);
            var signY = Math.sign(point1.y - offsetY - radius);
            //console.log(point1, signX, signY);
            //signX = signY = 0;
            $('<text/>')
                .text('Lorem Ipsum')
                .attr('x', point1.x - dim.width / 2 - (signX * -1 * dim.width / 2))
                .attr('y', point1.y - (signY * -1 * dim.height / 2))
                .addClass('nav-text')
                .appendTo('#nav');
        }


        // refresh html hack to move svg elements into svg namespace
        $("body").html($("body").html());
    }

    function renderLine(point1, point2, clazz) {
        return $('<line/>')
            .attr('x1', point1.x)
            .attr('y1', point1.y)
            .attr('x2', point2.x)
            .attr('y2', point2.y)
            .addClass(clazz)
            .appendTo('#nav');
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
                //'font': font
            })
            .appendTo($('body'));
        //console.log(dom);
        var dim = {
            'width': dom.width(),
            'height': dom.height()
        };
        //var width = dom.width();
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
            //ev.preventDefault();
            //console.log('click', ev);
            if ($('#nav').attr('class') == 'nav') {
                //console.log('nav scale down');
                $('#nav').attr('class', 'nav nav-small');
            } else {
                //console.log('nav scale up');
                $('#nav').attr('class', 'nav');
            }
            //return false;
        });
    }

    return {
        'init': init,
        'renderOctagon': renderOctagon
    };
})(jQuery);

jQuery(document).ready(function () {
    var radius = 300;
    var offsetX = 200;
    var offsetY = 50
    schop.init();
    schop.renderOctagon(radius, offsetX, offsetY);
    setTimeout(function () {
        schop.renderOctagon(radius, offsetX, offsetY);
    }, 50);
});