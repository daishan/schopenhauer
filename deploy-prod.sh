#!/bin/bash
brunch build --production
rsync -av --delete public/ daishan.de:~/public_html/schopenhauer/
brunch build
