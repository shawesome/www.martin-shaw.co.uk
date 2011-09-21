#!/bin/bash
here=`pwd`
function gif_gen {
    dir=$1
    w=$2
    h=$3
    d=10

    cd $dir
    convert src.png -crop ${w}x${h} +repage +adjoin frame%02d.png
    convert -dispose previous -delay $d -loop 0 frame* animated.gif
    rm frame*
    cd $here
}

gif_gen ../images/link/blue/walk-down/ 30 30    #0      90      300     30
gif_gen ../images/link/blue/walk-up/ 30 30      #90     777     300     30
gif_gen ../images/link/blue/walk-left/ 30 30    #88    1527    270     30

