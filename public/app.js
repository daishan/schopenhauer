(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = (window.brunch || {});
  var ar = br['auto-reload'] = (br['auto-reload'] || {});
  if (!WebSocket || ar.disabled) return;

  var cacheBuster = function(url){
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function(){
      window.location.reload(true);
    },

    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel=stylesheet]'))
        .filter(function(link) {
          var val = link.getAttribute('data-autoreload');
          return link.href && val != 'false';
        })
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function() { document.body.offsetHeight; }, 25);
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function(){
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function(event){
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function(){
      if (connection.readyState) connection.close();
    };
    connection.onclose = function(){
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();

var audio = (function ($) {
    "use strict";

    var stopCallback;
    var currentPlaylist;
    var titleOverride;

    var audioElement = $('audio').get(0);

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

        $('#seekbar').click(function (e) {
            var seekFraction = (e.pageX - $(this).offset().left) / $(this).width();
            var seekPos = seekFraction * audioElement.duration;
            console.log('seek', seekFraction, seekPos);
            audioElement.currentTime = seekPos;
        });

        stopCallback = onStop;
    }

    function play() {
        //var audioElement = $('audio').get(0);
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
        var subtext = index ? nodetexts[index].sub : '';
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
        $('#nav-container').find('hr').removeClass('active');
        $nav.removeClass('nav-small-finished');
        $nav.toggleClass('nav-small');
        $nav.children().removeClass('nav-line-hover');
        $('#nav-container').toggleClass('nav-small', $nav.hasClass('nav-small'));
    }

    function resetAudioAndButtons() {
        audio.reset();
        toggleButtonState($('#text-button'), false);
        toggleButtonState($('#music-button'), false);
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
        loadContentOnly(section, code);
    }

    function loadContentOnly(section, code) {
        console.log('loadContentOnly', section, code);
        $('#content').load('content/' + section + '/' + code + '.html', function (response, status) {
            if (status == 'error') {
                console.error('content loading failed');
                $('#content').load('content/' + section + '/A.html');
            }
        });
        if (!$('#nav').hasClass('nav-small')) {
            toggleNavigation();
        }
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
            //console.log('transitionEnd', ev.originalEvent.propertyName);
            if (ev.originalEvent.propertyName == 'height' && $('#nav').hasClass('nav-small')) {
                $('#contentpane').addClass('active');
                $('#nav').addClass('nav-small-finished');
                $('#nav-container').find('hr').addClass('active');
            }
        });

        $('#text-button').click(function () {
            console.log('text-button', firstIndex, secondIndex);
            toggleButtonState($(this), true);
            toggleButtonState($('#music-button'), false);
            $('#info-button').css('visibility', 'hidden');
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
            $('#info-button').css('visibility', 'visible');
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
    {complete: 'Der Satz vom Grunde', lines: ['Der Satz vom', 'Grunde'], align: 'center', offset: {x: 0, y: -60}, sub: 'FIXME'},
    {complete: 'Die Welt als Vorstellung', lines: ['Die Welt als', 'Vorstellung'], align: 'left', offset: {x: 30, y: 0}, sub: 'Erkenntnistheorie'},
    {complete: 'Die Welt als Wille', lines: ['Die Welt als', 'Wille'], align: 'left', offset: {x: 30, y: 0}, sub: 'FIXME'},
    {complete: 'Metaphysik des Schönen', lines: ['Metaphysik', 'des Schönen'], align: 'left', offset: {x: 30, y: 0}, sub: 'FIXME'},
    {complete: 'Bejahung & Verneinung', lines: ['Bejahung &', 'Verneinung'], align: 'center', offset: {x: 0, y: 60}, sub: 'FIXME'},
    {complete: 'Schlechte & gute Musik', lines: ['Schlechte &', 'gute Musik'], align: 'right', offset: {x: -30, y: 0}, sub: 'FIXME'},
    {complete: 'Entzweihung & Versöhnung', lines: ['Entzweihung &', 'Versöhnung'], align: 'right', offset: {x: -30, y: 0}, sub: 'FIXME'},
    {complete: 'Klassische & populäre Musik', lines: ['Klassische &', 'populäre Musik'], align: 'right', offset: {x: -30, y: 0}, sub: 'FIXME'}
];

var linewidths = [[227, 126], [209, 220], [209, 93], [195, 213], [192, 199], [209, 185], [253, 209], [218, 264]];

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

var musicPlaylists = {
    'A': [
        {'title': 'Dem Bach sein Song', 'file': 'music/test1.ogg', 'length': '9:59'},
        {'title': 'Hein Blöd und das Bielefelder Symphonieorchester', 'file': 'music/test2.mp3', 'length': '8:59'}
    ]
};

var speakerPlaylists = {
    '1': [{'file': 'speaker/01_SatzVomGrunde_WeltAlsVorstellung.mp3', 'length': '9:59'}],
    '2': [{'file': 'speaker/02_SatzVomGrunde_WeltAlsWille.mp3', 'length': '9:59'}],
    '3': [{'file': 'speaker/03_SatzVomGrunde_MetaphysikDesSchoenen.mp3', 'length': '9:59'}],
    '4': [{'file': 'speaker/04_SatzVomGrunde_BejahungVerneinung.mp3', 'length': '9:59'}],
    '5': [{'file': 'speaker/05_SatzVomGrunde_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    '6': [{'file': 'speaker/06_SatzVomGrunde_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '7': [{'file': 'speaker/07_SatzVomGrunde_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    '8': [{'file': 'speaker/08_WeltAlsVorstellung_WeltAlsWille.mp3', 'length': '9:59'}],
    '9': [{'file': 'speaker/09_WeltAlsVorstellung_MetaphysikDesSchoenen.mp3', 'length': '9:59'}],
    '10': [{'file': 'speaker/10_WeltAlsVorstellung_BejahungVerneinung.mp3', 'length': '9:59'}],
    '11': [{'file': 'speaker/11_WeltAlsVorstellung_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    '12': [{'file': 'speaker/12_WeltAlsVorstellung_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '13': [{'file': 'speaker/13_WeltAlsVorstellung_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    '14': [{'file': 'speaker/14_WeltAlsWille_MetaphysikDesSchoenen.mp3', 'length': '9:59'}],
    '15': [{'file': 'speaker/15_WeltAlsWille_BejahungVerneinung.mp3', 'length': '9:59'}],
    '16': [{'file': 'speaker/16_WeltAlsWille_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    '17': [{'file': 'speaker/17_WeltAlsWille_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '18': [{'file': 'speaker/18_WeltAlsWille_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    '19': [{'file': 'speaker/19_MetaphysikDesSchoenen_BejahungVerneinung.mp3', 'length': '9:59'}],
    '20': [{'file': 'speaker/20_MetaphysikDesSchoenen_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    '21': [{'file': 'speaker/21_MetaphysikDesSchoenen_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '22': [{'file': 'speaker/22_MetaphysikDesSchoenen_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    '23': [{'file': 'speaker/23_BejahungVerneinung_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    '24': [{'file': 'speaker/24_BejahungVerneinung_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '25': [{'file': 'speaker/25_BejahungVerneinung_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    '26': [{'file': 'speaker/26_GuteSchlechteMusik_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    '27': [{'file': 'speaker/27_GuteSchlechteMusik_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    '28': [{'file': 'speaker/28_EntzweiungVersoehnung_KlassischePopulaereMusik.mp3', 'length': '9:59'}],
    'A': [{'file': 'speaker/A_SatzVomGrunde.mp3', 'length': '9:59'}],
    'B': [{'file': 'speaker/B_WeltAlsVorstellung.mp3', 'length': '9:59'}],
    'C': [{'file': 'speaker/C_WeltAlsWille.mp3', 'length': '9:59'}],
    'D': [{'file': 'speaker/D_MetaphysikDesSchoenen.mp3', 'length': '9:59'}],
    'E': [{'file': 'speaker/E_BejahungVerneinung.mp3', 'length': '9:59'}],
    'F': [{'file': 'speaker/F_GuteSchlechteMusik.mp3', 'length': '9:59'}],
    'G': [{'file': 'speaker/G_EntzweiungVersoehnung.mp3', 'length': '9:59'}],
    'H': [{'file': 'speaker/H_KlassischePopulaereMusik.mp3', 'length': '9:59'}]
};

var plusmenu = (function ($, schop) {
    "use strict";

    function init() {
        console.log('plusmenu.init()');
        $('#plus-button')
            .on('click', function () {
                console.log('#plus-button click');
                $('#menu-buttons').find('.button').toggleClass('active');
            });

        $('#impressum-button').click(function () {
            schop.load("Impressum", 'special', 'impressum');
            $('#menu-buttons').find('.button').removeClass('active');
        });
    }

    return {
        init: init
    }

})(jQuery, schop);

$(document).ready(plusmenu.init);


//# sourceMappingURL=app.js.map