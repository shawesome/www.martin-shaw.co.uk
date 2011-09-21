#!/usr/bin/env python
# python script which creates a command to create a background image with given dimensions using the "montage command"

import sys
import os
import random

HIGHEST_TILE_NO = 8 

if len(sys.argv) < 3:
    print "Expecting 2 arguments. The number of ROWS and the number of COLUMNS."
    sys.exit()

#TODO type checking
rows = int(sys.argv[1]);
cols = int(sys.argv[2]);
sequence = [random.randint(1,HIGHEST_TILE_NO) for r in xrange(cols * rows)]
files = map(lambda x: '../images/tiles/tile-' + str(x) + '.png', sequence)

files = str(files).strip().replace(',', '').replace('\'', '').replace('[', '').replace(']', '');
cmd = 'montage %s -geometry 32x32+0+0 -tile %sx%s out.png' % (files, str(cols), str(rows)) 

print cmd
