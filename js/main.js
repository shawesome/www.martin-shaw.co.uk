// global variables to configure the battle

// arrays of the links 
var links = Array();
var red_links = Array();
var blue_links = Array();

// engine variables
var fps = 30;

// link variables
var spacing = 30;
var link_cnt = 0;
var link_limit = 10;
var move_speed = 1;

// searching
var perform_search = 30;
var approach_distance = 100;



$(function() {
    // generate link_limit links to place in the battle.
    for (var i = 0; i < link_limit/2; i++) {
        var new_link = add_link('red', i);
        links.push(new_link)   
        red_links.push(new_link)   
    }
    for (var i = 0; i < link_limit/2; i++) {
        var new_link = add_link('blue', i);
        links.push(new_link)   
        blue_links.push(new_link)   
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
    function add_link (colour, index) {
        var battle = $('div#battle');
        var link = new Array();
        link['colour'] = colour;

        var id = 'link-' + ++link_cnt;
        var left = (colour == 'blue') ? -30 - index * spacing: document.width + index * spacing;
        var top = Math.random() * (document.height - 30);
        link['orientation'] = (colour == 'blue') ? 'right': 'left';
        link['action'] = 'walk';
        battle.append($('<div/>')
            .addClass('link ' + colour + ' ' + link.action + '-' + link.orientation)
            .attr('id', id)
            .css({
                'z-index': Math.floor(top),
                'left': left + 'px',
                'top': top +'px',
            }));

        link['object'] = $('#' + id);
        link['status'] = 'searching';
        //searching is costly so divide it equally

        link['search_tick'] = Math.floor(((perform_search / (link_limit / 2)) * i) % perform_search);


        return link;
    }

    function update() {
        for (var i = 0; i < link_cnt; i++) {
            do_behaviour(links[i]);
        }
    }

    function do_behaviour(link) {
        switch(link.status) {
            case 'searching':
                search(link);
                break;
            case 'approaching':
                approach(link);
                break;

        }
        
    }

    function search(link) {
        // see if anyone is in range
        link.search_tick++;
        if (link.search_tick == perform_search) {
            var target_links = (link.colour == 'blue') ? red_links: blue_links;
            var x1 = link.object.position().left + link.object.width() / 2;
            var y1 = link.object.position().top + link.object.height() / 2;

            for (var i = 0; i < link_limit / 2; i++) {
                var x2 = target_links[i].object.position().left + target_links[i].object.width() / 2;
                var y2 = target_links[i].object.position().top + target_links[i].object.height() / 2;
                var dx = x1 - x2;
                var dy = y1 - y2;

                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < approach_distance) {
                    link.status = 'approaching';
                    link.target = target_links[i];
                    continue;
                }

            }
            link.search_tick = 0;
        }
        
        // no one is in range so just keep moving
        var move = (link.colour == 'blue') ? +move_speed : -move_speed;
        link.object.css('left', link.object.position().left + move + 'px');
    }

    function change_orientation(link, orientation) {
        if (orientation != link.orientation) {
            link.object.removeClass(link.action + '-' + link.orientation)
                .addClass(link.action + '-' + orientation);
            
            link.orientation = orientation;
        }
    }


    function approach(link) {
        var x1 = link.object.position().left + link.object.width() / 2;
        var y1 = link.object.position().top + link.object.height() / 2;

        var x2 = link.target.object.position().left + link.target.object.width() / 2;
        var y2 = link.target.object.position().top + link.target.object.height() / 2;
        

        var y_move = 0;
        if (y1 - move_speed > y2) { 
            y_move = -move_speed; 
        } else if (y1 + move_speed < y2) { 
            y_move = move_speed; 
        }

        var x_move = 0;
        if (x1 - move_speed > x2 + 30) { 
            x_move = -move_speed; 
        } else if (x1 + move_speed < x2 - 30) { 
            x_move = move_speed; 
        }

        var orientation;
        if (y_move != 0) {
            link.object.css('top', link.object.position().top + y_move + 'px');
            link.object.css('z-index', link.object.position().top + y_move + 'px');
            orientation = (y_move == 1) ? 'down' : 'up';
        } else {
            if (x_move != 0) {
                link.object.css('left', link.object.position().left + x_move + 'px');
                orientation = (x_move == 1) ? 'right' : 'left';
            } else {
                fight(link, link.target);
                return;
            }
        }
        change_orientation(link, orientation)

    }
    
    function fight(fighter1, fighter2) {
        var rand = Math.random();
        if (rand > 0.5) {
            fighter1.status = 'dying';
            fighter2.status = 'slaying';
        } else {
            fighter1.status = 'slaying';
            fighter2.status = 'dying';
        }


        //var rand = Math.random();
        //fighter1.status = 'searching';
        //fighter2.status = 'searching';
        //if (rand > 0.5) {
        //    fighter2.object.css('left', (fighter2.colour == 'blue') ? -30 : document.width);
        //} else {
        //    fighter1.object.css('left', (fighter1.colour == 'blue') ? -30 : document.width);
        //}
    }

});
