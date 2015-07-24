#!/bin/bash
echo '$debug: false;' > app/styles/_debug.scss
brunch build --production
rsync -av --delete public/ daishan.de:~/public_html/schopenhauer/
brunch build
#echo '$debug: true;' > app/styles/_debug.scss
