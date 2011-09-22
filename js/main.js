var linkCnt = 0;
var linkLimit = 30;
var links = [];
var fps = 60;
$(function() {
    // generate linkLimit links to place in the battle.
    for (var i = 0; i < linkLimit; i++) {
        var colour = (i % 2 == 0) ? 'red': 'blue';
        links.push(add_link(colour));
    }

    // function which loops indefinitely
    game_loop = (function () {
        var loops = 0;
        var skipTicks = 1000 / fps;
        var maxFrameSkip = 10;
        var nextGameTick = (new Date).getTime();

        return function() {
            loops = 0;
            while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
                update();
                nextGameTick += skipTicks;
                loops++;
            }
            //draw
        };
    })();

    // decide how we are going to loop
    var onEachFrame;
    if (window.webkitRequestAnimationFrame) {
        onEachFrame = function(cb) {
            var _cb = function() { cb(); webkitRequestAnimationFrame(_cb); }
            _cb();
        };
    } else if (window.mozRequestAnimationFrame) {
        onEachFrame = function(cb) {
            var _cb = function() { cb(); mozRequestAnimationFrame(_cb); }
            _cb();
        };
    } else {
        onEachFrame = function(cb) {
            setInterval(cb, 1000 / fps);
        }
    }

    // kick off the game loop
    window.onEachFrame = onEachFrame;
    window.onEachFrame(game_loop);

    // randomly adds a link to the battle. positions based on colour.
    function add_link (colour) {
        var battle = $('div#battle');
        var id = 'link-' + ++linkCnt;
        var left = (colour == 'blue') ? Math.random() * 100: Math.random() * 100 + (document.width - 150);
        var top = Math.random() * (document.height - 50);
        var orientation = (colour == 'blue') ? 'right': 'left';
        battle.append($('<div/>')
            .addClass('link ' + colour + ' walk-' + orientation)
            .attr('id', id)
            .css({
                'z-index': Math.floor(top),
                'left': left + 'px',
                'top': top +'px',
            }));

        return $('#' + id);
    }

    function update() {
        for (var i = 0; i < linkCnt; i++) {
            var move = (i % 2 == 0) ? '-=1' : '+=1';
            links[i].animate({
                'left': move,
            }, 1000/fps);
        }
    }


});
