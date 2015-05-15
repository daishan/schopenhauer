(function ($) {
    function renderOctagon(radius, offsetX, offsetY) {
        for (var i = 0; i < 8; i++) {
            var point1 = pointAtOffset(i, radius, offsetX, offsetY);
            for (var j = 0; j < 8; j++) {
                if (i >= j) {
                    continue;
                }
                var point2 = pointAtOffset(j, radius, offsetX, offsetY);
                renderLine(point1, point2);
            }
            $('<text/>')
                .text('Lorem Ipsum')
                .attr('x', point1.x)
                .attr('y', point1.y)
                .addClass('nav-text')
                .appendTo('#nav')
        }

        // refresh html hack to move svg elements into svg namespace
        $("body").html($("body").html());
    }

    function renderLine(point1, point2) {
        $('<line/>')
            .attr('x1', point1.x)
            .attr('y1', point1.y)
            .attr('x2', point2.x)
            .attr('y2', point2.y)
            .addClass('nav-line')
            .appendTo('#nav');
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

    renderOctagon(300, 50, 50);
})(jQuery);
