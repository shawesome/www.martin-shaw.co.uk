$(function() {
    // load the background tiles
    container = $('div.tiles');
    screen_width = $(window).width();
    screen_height = $(window).height();
    tile_width = 32;
    tile_height = 32;

    horz_tile_count = Math.ceil(screen_width / tile_width);
    vert_tile_count = Math.ceil(screen_height / tile_height);

    for (i=0; i < vert_tile_count; i++) {
        container.append('<div class="tile-row current-tile-row">')
        row = $('div.current-tile-row')
        console.log(row);
        for (j=0; j < horz_tile_count; j++) {
            tile_no = Math.ceil(Math.random() * 8);
            row.append('<div class="tile"><img src="images/tiles/tile-' + tile_no + '.png" /></div>')
        }
        row.removeClass('current-tile-row')
    }
});
