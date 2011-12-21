#!/usr/bin/env python
# python script which creates a command to create a background image with given dimensions using the "montage command"

import sys
import os
import random


if len(sys.argv) < 4:
    print "Expecting 3 arguments. The number of ROWS, the number of COLUMNS. And the number of TILES"
    sys.exit()

#TODO type checking
rows = int(sys.argv[1]);
cols = int(sys.argv[2]);
tiles = int(sys.argv[3]);

sequence = [random.randint(1, tiles) for r in xrange(cols * rows)]
files = map(lambda x: '../images/tiles/tile-' + str(x) + '.png', sequence)

files = str(files).strip().replace(',', '').replace('\'', '').replace('[', '').replace(']', '');
cmd = 'montage %s -geometry 32x32+0+0 -tile %sx%s out.png' % (files, str(cols), str(rows)) 

print cmd
